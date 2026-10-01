---
title: "Docker Secrets: Stop Storing Your Keys in .env Files"
date: 2026-10-01
categories: ["tools", "security"]
tags: ["docker", "docker-compose", "secrets", "security", "devops"]
lang: en
translation_key: docker-secrets
description: "Learn why .env files are a risky place for secrets and how Docker secrets keep passwords and API keys out of your environment, your images, and your logs."
---

# Docker Secrets: Stop Storing Your Keys in .env Files

We've all done it: a `.env` file with `DATABASE_PASSWORD`, `JWT_SECRET` and a couple of API keys, sitting next to `docker-compose.yml`. It works, it's easy, and it's the default in every tutorial. But environment variables were never designed to hold secrets. **Docker secrets** are.

In this guide I'll show you how to move your passwords, tokens and keys out of the environment, out of your images and out of `docker inspect`, starting with something as simple as turning a secret into a file.

## What's wrong with .env files?

A `.env` file by itself is just a text file. The problems start when its content becomes **environment variables** inside your containers:

- **They're visible to anyone who can inspect the container.** Run `docker inspect <container>` and every variable shows up in plain text.
- **They leak into logs and crash reports.** A framework that dumps `process.env` on error, or a debug endpoint left on by mistake, and your database password is in your logging platform.
- **Child processes inherit them.** Every process your app spawns gets a copy of every secret.
- **They're one `git add .` away from your repository.** Forgetting a line in `.gitignore` is enough, and Git history is forever.
- **They can end up baked into images.** `ENV`, `ARG`, or a `COPY .env` in a Dockerfile leaves the value in the image layers. Anyone with the image can run `docker history` and read it.

> ⚠️ **Important:** If a secret was ever committed to Git or baked into an image, rotating it is the only real fix. Deleting the file later doesn't remove it from history or from the layers.

## What are Docker secrets?

A Docker secret is a piece of sensitive data (a password, a token, a TLS key) that Docker delivers to a container **as a file**, mounted at:

```
/run/secrets/<secret_name>
```

Your application reads the file when it needs the value. The secret is never part of the container's environment, never part of the image, and doesn't appear in `docker inspect`.

### Why should you care?

- **Smaller attack surface:** Only the services you explicitly grant access to can read a given secret.
- **Cleaner images:** The same image runs in dev, staging and production. Only the secret changes.
- **Better habits:** Treating secrets as files with permissions, instead of strings in the environment, pushes you toward safer defaults.

## Prerequisites

Before you start, make sure you have:

- Docker Engine installed and running
- Docker Compose v2 (the `docker compose` command, not the classic `docker-compose`)
- A project with at least one `Dockerfile` if you're going to follow the API example
- Access to your repository so you can set up `.gitignore` and `.dockerignore`

## Step-by-step setup

### Step 1: Create the secret files

Docker Compose (without Swarm) takes secrets from files on your host. The first step is to create them with restrictive permissions:

```bash
mkdir -p secrets

# printf avoids adding a trailing newline (echo adds one!)
printf 'my-super-secret-password' > secrets/db_password.txt
printf 'my-jwt-signing-key' > secrets/jwt_secret.txt

# Only your user can read them
chmod 600 secrets/*.txt
```

And make sure they never reach Git or the image:

```bash
# .gitignore
secrets/
.env

# .dockerignore (don't forget this one!)
secrets/
.env
.env*
```

> 💡 **Watch the trailing newline.** `echo "pass" > file` writes `pass\n`. Some apps will treat the newline as part of the password and authentication will fail in confusing ways. Use `printf`, or `.trim()` when reading the file in your code.

> ⚠️ The `.dockerignore` is critical: without it, a `COPY . .` in your Dockerfile puts the `secrets/` directory (and your `.env`) inside the image. Runtime secrets don't protect the build context.

### Step 2: Declare them in docker-compose.yml

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: app
      POSTGRES_DB: app
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password
    volumes:
      - pgdata:/var/lib/postgresql/data

  api:
    build: ./api
    environment:
      DB_HOST: db
      DB_USER: app
      DB_PASSWORD_FILE: /run/secrets/db_password
      JWT_SECRET_FILE: /run/secrets/jwt_secret
    secrets:
      - db_password
      - jwt_secret
    depends_on:
      - db

secrets:
  db_password:
    file: ./secrets/db_password.txt
  jwt_secret:
    file: ./secrets/jwt_secret.txt

volumes:
  pgdata:
```

Notice that the `environment` block only contains **paths** to the secrets, not the secrets themselves. Paths aren't sensitive, so it's fine for them to appear in `docker inspect`.

Notice also that each service only lists the secrets it needs. `db` can't read `jwt_secret`.

> ⚠️ **Keep in mind what Compose does and doesn't do:** Compose simply bind-mounts a file from your host at `/run/secrets/<name>`. You get the main benefits (no environment variables, nothing in `docker inspect`, nothing in the image), but you don't get encryption at rest or a `tmpfs`. Protect that host file like any other sensitive file. Also note that secrets are supported on Linux containers only.

| Feature                          | `.env` / environment | Compose secrets  | Swarm secrets    |
| -------------------------------- | -------------------- | ---------------- | ---------------- |
| Visible in `docker inspect`      | ✔                    | ✘                | ✘                |
| Inherited by child processes     | ✔                    | ✘                | ✘                |
| Stored in image if misused       | ✔                    | ✘                | ✘                |
| Mounted as in-memory file        | ✘                    | ✘ (bind mount)   | ✔ (`tmpfs`)      |
| Encrypted at rest and in transit | ✘                    | ✘                | ✔                |
| Per-service access control       | ✘                    | ✔                | ✔                |

#### The `_FILE` convention

Many official images already support reading secrets from files. Instead of passing `POSTGRES_PASSWORD`, you pass `POSTGRES_PASSWORD_FILE` pointing to the mounted secret. The same convention works for MySQL, MariaDB, and others.

### Step 3: Read the secret in your app

For a Node.js / NestJS backend, a small helper is all you need. It reads from the `_FILE` variable when present and falls back to a plain environment variable, which keeps local development without Docker working:

```ts
// src/config/secrets.ts
import { readFileSync } from 'node:fs';

export function getSecret(name: string): string {
  const filePath = process.env[`${name}_FILE`];

  if (filePath) {
    return readFileSync(filePath, 'utf8').trim();
  }

  const value = process.env[name];
  if (value) return value;

  throw new Error(`Secret "${name}" not found (set ${name}_FILE or ${name})`);
}
```

Then use it in your configuration:

```ts
// src/config/configuration.ts
import { getSecret } from './secrets';

export default () => ({
  jwt: {
    secret: getSecret('JWT_SECRET'),
  },
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: getSecret('DB_PASSWORD'),
  },
});
```

```ts
// app.module.ts
ConfigModule.forRoot({ isGlobal: true, load: [configuration] });
```

#### A note for Prisma users

Prisma reads `DATABASE_URL` from the environment, so it can't consume a `_FILE` variable directly. A common workaround is an entrypoint script that builds the URL from the secret right before starting the app:

```bash
#!/bin/sh
# docker-entrypoint.sh
set -e

DB_PASSWORD="$(cat /run/secrets/db_password)"
export DATABASE_URL="postgresql://app:${DB_PASSWORD}@db:5432/app"

exec "$@"
```

```dockerfile
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "dist/main.js"]
```

> ⚠️ **Trade-off:** This puts the password back into the environment of **that one process**. It's still much better than a `.env` (the secret isn't in the image, in `docker inspect`, or in your repo), but it's not as strict as reading a file directly. Also remember to URL-encode the password if it contains special characters like `@`, `:` or `/`.

### Step 4: Verify it

```bash
docker compose up -d

# The secret is a file inside the container
docker compose exec api ls -l /run/secrets

# ...and it's NOT in the environment inspection
docker inspect $(docker compose ps -q api) | grep -i password
```

You should see `DB_PASSWORD_FILE` (the path) but never the actual value.

Another way to check is to render the full Compose configuration:

```bash
docker compose config
```

The secret paths show up, but their contents are never printed.

> ⚠️ **Careful with `docker compose config`:** it prints every **interpolated** `${VAR}` value in your Compose file in plain text. So if you left a `DB_PASSWORD: ${DB_PASSWORD}` behind, that command dumps your password to your terminal — and into your shell history, a CI log, or a bug report. Before running it, make sure nothing sensitive is being interpolated.

## Complete workflow example

Migrating an existing project is a ten-minute change. This is the whole flow:

```bash
# 1. Create the secret files and keep them out of Git
mkdir -p secrets
printf 'my-super-secret-password' > secrets/db_password.txt
chmod 600 secrets/*.txt

# 2. Add them to .gitignore and .dockerignore
echo "secrets/" >> .gitignore
echo "secrets/" >> .dockerignore

# 3. Drop the variable from .env and declare the secret in docker-compose.yml
#    (replace DB_PASSWORD=${DB_PASSWORD} with DB_PASSWORD_FILE=/run/secrets/db_password)

# 4. Bring it up and verify
docker compose up -d
docker compose exec api ls -l /run/secrets
docker inspect $(docker compose ps -q api) | grep -i password
```

From that moment on, the password is out of the environment, out of the image and out of your repository. The same image you used in development serves production: only the secret file changes.

## Docker Swarm secrets (production-grade)

If you run Docker Swarm, secrets are created in the cluster instead of read from files on your host:

```bash
# Create the secret from stdin (never touches disk)
printf 'my-super-secret-password' | docker secret create db_password -

# List and inspect (the value is never shown)
docker secret ls
docker secret inspect db_password
```

Then reference it as `external` in your stack file:

```yaml
services:
  api:
    image: myorg/api:1.0.0
    environment:
      DB_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password

secrets:
  db_password:
    external: true
```

```bash
docker stack deploy -c docker-compose.yml myapp
```

There you do get the full treatment: secrets are stored **encrypted in the Raft log** of the Swarm managers, they're **encrypted in transit** (mutual TLS) when sent to the nodes running the service, and they're mounted on an **in-memory `tmpfs`**, so they're never written to the node's disk.

### Rotating a secret

Swarm secrets are **immutable**, so you rotate them by creating a new version and swapping it in:

```bash
printf 'the-new-password' | docker secret create db_password_v2 -

docker service update \
  --secret-rm db_password \
  --secret-add source=db_password_v2,target=db_password \
  myapp_api
```

Because of the `target`, the container still sees `/run/secrets/db_password`, so your app doesn't need any changes. Once everything is running on the new one, remove the old secret:

```bash
docker secret rm db_password
```

## Bonus: build-time secrets

Runtime secrets are only half the story. What about a private npm token needed during `npm ci`? **Never** use `ARG` or `ENV` for that: they remain in the image history. Use BuildKit secret mounts instead:

```dockerfile
# syntax=docker/dockerfile:1
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./

RUN --mount=type=secret,id=npmrc,target=/root/.npmrc \
    npm ci

COPY . .
RUN npm run build
```

```bash
docker build --secret id=npmrc,src=$HOME/.npmrc -t myorg/api:1.0.0 .
```

The secret is available only during that single `RUN` instruction and is **not** stored in any layer.

#### Build secrets from Compose

If you build with `docker compose build`, the `--secret` flag isn't available. Compose declares them in the `build` section instead, taking the value from a host environment variable:

```yaml
services:
  api:
    build:
      context: ./api
      secrets:
        - npm_token

secrets:
  npm_token:
    environment: NPM_TOKEN
```

```bash
NPM_TOKEN=$(cat ~/.npmrc | ...) docker compose build
```

The `environment` source is Compose-only: it isn't supported by `docker stack deploy`, where you'd use `file` or `external` instead.

## Benefits of using Docker secrets

1. **Smaller attack surface**: each service only sees the secrets it needs, nothing more.
2. **Cleaner, reusable images**: the same image works across every environment.
3. **Nothing to commit by accident**: secrets live in ignored files, not in your repository.
4. **Configuration with permissions**: files have `chmod`, environment strings don't.
5. **Scales without refactoring**: moving from Compose to Swarm is changing where the secret comes from, not rewriting your app.
6. **Rotation becomes practical**: when a secret is compromised, you change it without shipping new code.

## Additional tips

- **Never commit secrets.** Add `secrets/` and `.env` to `.gitignore` from day one, and consider a pre-commit scanner like `gitleaks` or GitHub's push protection.
- **Use `printf`, not `echo`,** when creating secret files, and `.trim()` when reading them.
- **Restrict file permissions.** `chmod 600` on host secret files, and keep them outside the project directory if you can.
- **Grant secrets per service.** If a container doesn't need a secret, don't list it.
- **Never log your config object.** A `console.log(config)` can undo all the work above.
- **Rotate regularly,** and immediately if you suspect a leak.
- **Use `environment` secrets in dev if you want to avoid files.** `secrets: { api_token: { environment: API_TOKEN } }` takes the value from a host variable, and it's the only source where `uid`, `gid` and `mode` are honored.
- **Remember `.env` is still for interpolation.** Compose reads `.env` automatically and substitutes `${VAR}` in your Compose file. That's useful for non-sensitive values like `POSTGRES_USER`, but it's exactly the mechanism that leaks a password into `docker compose config`.
- **Separate configuration from secrets.** Ports, feature flags or log levels are fine as plain environment variables.

## Common troubleshooting

### The app can't read the secret at all

If the app only knows how to read environment variables and doesn't support the `_FILE` convention, you have two options:

- **Wrap it in an entrypoint** that reads the file and exports the variable right before starting (the Prisma example above). The value ends up in that one process's environment, but never in the image or your repo.
- **Patch the app** to read `/run/secrets/<name>` directly. More work up front, but the value never enters the environment at all.

### Permission denied reading /run/secrets/...

The `uid`, `gid` and `mode` attributes of the long syntax **are silently ignored in Docker Compose when the source of the secret is a file**, because a bind mount can't remap the owner. The container sees the host file's permissions, so the fix is to align the owner on the host with the UID the container runs as:

```bash
# The container runs as node (uid 1000), so:
sudo chown 1000:1000 secrets/db_password.txt

# Or, more flexible, a shared group
sudo chown $USER:docker secrets/db_password.txt
chmod 640 secrets/db_password.txt
```

### The password is right but authentication fails

It's almost always the trailing newline. Compare the file size against the length of the password: if the file is one byte longer, that's your culprit.

```bash
# 'my-super-secret-password' is 24 characters
wc -c secrets/db_password.txt
```

To fix it, recreate the file with `printf` instead of `echo`, and make sure you `.trim()` it when reading:

```bash
printf 'my-super-secret-password' > secrets/db_password.txt
wc -c secrets/db_password.txt   # 24, no trailing newline
```

### The secret doesn't show up in /run/secrets

Check these three things:

- **The `file:` path** is relative to the `docker-compose.yml` file, not to the directory you run the command from.
- **The service lists the secret** in its `secrets:` block. Declaring it in the top-level section doesn't mount it anywhere.
- **The name**: if you use `target:`, the name inside the container changes. With `target: /run/secrets/other_name`, the file shows up under that other name.

### I changed the file and the value doesn't update

In Compose the secret is a bind mount, so restarting the process that reads it is enough:

```bash
docker compose restart api
```

Swarm is different: secrets are resolved when the container is created, so you need to force the service to be recreated.

```bash
docker service update --force myapp_api
```

### I found a secret in Git history or in an image

First things first: **rotate the credential**. That's the only thing that actually makes it safe. Then clean up the history if you want to:

```bash
# Did the value show up in any commit?
git log -S 'my-super-secret-password' --oneline

# Clean the history (this rewrites commits: do it before others clone)
git filter-repo --path secrets --invert-paths
```

For images, check whether the value made it into the layers and rebuild from scratch:

```bash
docker history --no-trunc myorg/api:1.0.0 | grep -i secret
docker system prune -a --volumes
```

## Conclusion

A `.env` file is fine for non-sensitive configuration like ports, feature flags, or log levels. But for passwords, tokens and keys, Docker secrets are a small change with a big payoff: your secrets stay out of the environment, out of your images, and out of `docker inspect`.

Start simple: move one password to a file, add the `_FILE` variable, and use the `getSecret()` helper. Once that feels natural, Swarm secrets or a cloud secrets manager are the next step.

For reference, the official docs are the complete source: [docs.docker.com/compose/how-tos/use-secrets](https://docs.docker.com/compose/how-tos/use-secrets/) and [docs.docker.com/engine/swarm/secrets](https://docs.docker.com/engine/swarm/secrets/).