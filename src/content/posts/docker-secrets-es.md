---
title: "Docker Secrets: Deja de Guardar tus Claves en Archivos .env"
date: 2026-10-01
categories: ["herramientas", "seguridad"]
tags: ["docker", "docker-compose", "secretos", "seguridad", "devops"]
lang: es
translation_key: docker-secrets
description: "Aprende por qué los archivos .env son un lugar riesgoso para tus secretos y cómo los Docker secrets mantienen tus contraseñas y API keys fuera del entorno, de tus imágenes y de tus logs."
---

# Docker Secrets: Deja de Guardar tus Claves en Archivos .env

Todos lo hemos hecho: un archivo `.env` con `DATABASE_PASSWORD`, `JWT_SECRET` y un par de API keys, sentado al lado del `docker-compose.yml`. Funciona, es fácil, y es lo que aparece en todos los tutoriales. Pero las variables de entorno nunca fueron diseñadas para guardar secretos. Los **Docker secrets** sí.

En esta guía te muestro cómo mover tus contraseñas, tokens y llaves fuera del entorno, fuera de tus imágenes y fuera de `docker inspect`, empezando por algo tan simple como convertir un secreto en un archivo.

## ¿Por qué los archivos .env son un problema?

Un archivo `.env` por sí solo es solo un archivo de texto. Los problemas empiezan cuando su contenido se convierte en **variables de entorno** dentro de tus contenedores:

- **Son visibles para cualquiera que pueda inspeccionar el contenedor.** Ejecuta `docker inspect <contenedor>` y todas las variables aparecen en texto plano.
- **Se filtran a los logs y reportes de errores.** Un framework que vuelca `process.env` al fallar, o un endpoint de debug que quedó habilitado por error, y tu contraseña de base de datos ya está en tu plataforma de logs.
- **Los procesos hijos los heredan.** Cada proceso que tu app lanza recibe una copia de cada secreto.
- **Están a un `git add .` de tu repositorio.** Olvidar una línea en `.gitignore` es suficiente, y el historial de Git es para siempre.
- **Pueden quedar horneados en las imágenes.** Un `ENV`, un `ARG`, o un `COPY .env` en un Dockerfile deja el valor en las capas de la imagen. Cualquiera que tenga la imagen puede ejecutar `docker history` y leerlo.

> ⚠️ **Importante:** Si un secreto se subió a Git o quedó horneado en una imagen, la única solución real es rotarlo. Borrar el archivo después no lo saca del historial ni de las capas.

## ¿Qué son los Docker secrets?

Un Docker secret es un dato sensible (una contraseña, un token, una llave TLS) que Docker entrega a un contenedor **como archivo**, montado en:

```
/run/secrets/<nombre_del_secreto>
```

Tu aplicación lee el archivo cuando necesita el valor. El secreto nunca forma parte del entorno del contenedor, nunca forma parte de la imagen y no aparece en `docker inspect`.

### ¿Por qué deberías importarte?

- **Menor superficie de ataque:** Solo los servicios a los que les das acceso explícito pueden leer un secreto determinado.
- **Imágenes más limpias:** La misma imagen corre en dev, staging y producción. Solo cambia el secreto.
- **Mejores hábitos:** Tratar los secretos como archivos con permisos, en vez de cadenas en el entorno, te empuja hacia defaults más seguros.

## Requisitos previos

Antes de comenzar, asegúrate de tener:

- Docker Engine instalado y funcionando
- Docker Compose v2 (el comando `docker compose`, no el `docker-compose` clásico)
- Un proyecto con al menos un `Dockerfile` si vas a seguir el ejemplo de la API
- Acceso a tu repositorio para configurar `.gitignore` y `.dockerignore`

## Configuración paso a paso

### Paso 1: Crear los archivos de secretos

Docker Compose (sin Swarm) toma los secretos de archivos en tu host. El primer paso es crearlos con permisos restrictivos:

```bash
mkdir -p secrets

# printf evita agregar un salto de línea final (¡echo sí lo agrega!)
printf 'mi-password-super-secreto' > secrets/db_password.txt
printf 'mi-llave-de-firma-jwt' > secrets/jwt_secret.txt

# Solo tu usuario puede leerlos
chmod 600 secrets/*.txt
```

Y asegúrate de que nunca lleguen a Git ni a la imagen:

```bash
# .gitignore
secrets/
.env

# .dockerignore (¡no olvides este!)
secrets/
.env
.env*
```

> 💡 **Cuidado con el salto de línea final.** `echo "pass" > archivo` escribe `pass\n`. Algunas apps toman ese salto de línea como parte de la contraseña y la autenticación falla de formas confusas. Usa `printf`, o `.trim()` al leer el archivo en tu código.

> ⚠️ El `.dockerignore` es crítico: sin él, un `COPY . .` en tu Dockerfile mete el directorio `secrets/` (y tu `.env`) dentro de la imagen. Los secretos de runtime no protegen el build context.

### Paso 2: Declararlos en docker-compose.yml

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

Observa que el bloque `environment` solo contiene **rutas** a los secretos, no los secretos en sí. Las rutas no son sensibles, así que no hay problema si aparecen en `docker inspect`.

Observa también que cada servicio solo lista los secretos que necesita. `db` no puede leer `jwt_secret`.

> ⚠️ **Ten en cuenta qué hace Compose y qué no:** Compose simplemente hace bind mount de un archivo de tu host en `/run/secrets/<nombre>`. Obtienes los beneficios principales (sin variables de entorno, nada en `docker inspect`, nada en la imagen), pero no obtienes cifrado en reposo ni `tmpfs`. Protege ese archivo del host como cualquier otro archivo sensible. Ten en cuenta además que los secretos solo funcionan en contenedores Linux.

| Característica                   | `.env` / entorno    | Compose secrets  | Swarm secrets    |
| -------------------------------- | ------------------- | ---------------- | ---------------- |
| Visible en `docker inspect`      | ✔                   | ✘                | ✘                |
| Heredado por procesos hijos      | ✔                   | ✘                | ✘                |
| Queda en la imagen si se abusa   | ✔                   | ✘                | ✘                |
| Montado como archivo en memoria  | ✘                   | ✘ (bind mount)   | ✔ (`tmpfs`)      |
| Cifrado en reposo y en tránsito  | ✘                   | ✘                | ✔                |
| Control de acceso por servicio   | ✘                   | ✔                | ✔                |

#### La convención `_FILE`

Muchas imágenes oficiales ya saben leer secretos desde archivos. En vez de pasar `POSTGRES_PASSWORD`, pasas `POSTGRES_PASSWORD_FILE` apuntando al secreto montado. La misma convención funciona con MySQL, MariaDB y otras.

### Paso 3: Leer el secreto en tu aplicación

Para un backend en Node.js / NestJS, un helper pequeño es todo lo que necesitas. Lee desde la variable `_FILE` cuando está presente y cae a una variable de entorno normal, lo que mantiene funcionando el desarrollo local sin Docker:

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

  throw new Error(`Secreto "${name}" no encontrado (define ${name}_FILE o ${name})`);
}
```

Después lo usas en tu configuración:

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

#### Nota para usuarios de Prisma

Prisma lee `DATABASE_URL` del entorno, así que no puede consumir una variable `_FILE` directamente. Un workaround común es un script de entrada que construya la URL a partir del secreto justo antes de arrancar la app:

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

> ⚠️ **Compromiso:** esto devuelve la contraseña al entorno de **ese único proceso**. Sigue siendo mucho mejor que un `.env` (el secreto no está en la imagen, ni en `docker inspect`, ni en tu repo), pero no es tan estricto como leer el archivo directamente. Recuerda además codificar en URL la contraseña si contiene caracteres especiales como `@`, `:` o `/`.

### Paso 4: Verificar que funciona

```bash
docker compose up -d

# El secreto es un archivo dentro del contenedor
docker compose exec api ls -l /run/secrets

# ...y NO está en la inspección del entorno
docker inspect $(docker compose ps -q api) | grep -i password
```

Deberías ver `DB_PASSWORD_FILE` (la ruta) pero nunca el valor real.

Otra forma de comprobarlo es renderizar la configuración completa de Compose:

```bash
docker compose config
```

Las rutas de los secretos aparecen, pero sus contenidos nunca se imprimen.

> ⚠️ **Cuidado con `docker compose config`:** imprime en texto plano todos los valores **interpolados** `${VAR}` de tu Compose file. Así que si dejaste un `DB_PASSWORD: ${DB_PASSWORD}` olvidado, ese comando vuelca tu contraseña a tu terminal, y de ahí al historial de tu shell, a un log de CI o a un reporte de bug. Antes de ejecutarlo, asegúrate de que no se esté interpolando nada sensible.

## Ejemplo completo de flujo de trabajo

Migrar un proyecto existente es un cambio de diez minutos. Este es el flujo completo:

```bash
# 1. Crea los archivos de secretos y déjalos fuera de Git
mkdir -p secrets
printf 'mi-password-super-secreto' > secrets/db_password.txt
chmod 600 secrets/*.txt

# 2. Agrégalos a .gitignore y .dockerignore
echo "secrets/" >> .gitignore
echo "secrets/" >> .dockerignore

# 3. Borra la variable del .env y declara el secreto en docker-compose.yml
#    (sustituye DB_PASSWORD=${DB_PASSWORD} por DB_PASSWORD_FILE=/run/secrets/db_password)

# 4. Levanta y verifica
docker compose up -d
docker compose exec api ls -l /run/secrets
docker inspect $(docker compose ps -q api) | grep -i password
```

A partir de ese momento, la contraseña sale del entorno, de la imagen y de tu repositorio. La misma imagen que usabas en desarrollo sirve para producción: solo cambia el archivo de secreto.

## Secretos en Docker Swarm (nivel producción)

Si corres Docker Swarm, los secretos se crean en el clúster en vez de leerse de archivos del host:

```bash
# Crea el secreto desde stdin (nunca toca el disco)
printf 'mi-password-super-secreto' | docker secret create db_password -

# Listar e inspeccionar (el valor nunca se muestra)
docker secret ls
docker secret inspect db_password
```

Luego lo referencias como `external` en tu archivo de stack:

```yaml
services:
  api:
    image: miorg/api:1.0.0
    environment:
      DB_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password

secrets:
  db_password:
    external: true
```

```bash
docker stack deploy -c docker-compose.yml miapp
```

Ahí sí obtienes el tratamiento completo: los secretos se guardan **cifrados en el log Raft** de los managers, viajan **cifrados** (mTLS) a los nodos que ejecutan el servicio, y se montan en un **`tmpfs` en memoria** para no escribirse en el disco del nodo.

### Rotar un secreto

Los secretos de Swarm son **inmutables**, así que rotas creando una versión nueva y cambiándola:

```bash
printf 'el-password-nuevo' | docker secret create db_password_v2 -

docker service update \
  --secret-rm db_password \
  --secret-add source=db_password_v2,target=db_password \
  myapp_api
```

Gracias al `target`, el contenedor sigue viendo `/run/secrets/db_password`, así que tu app no necesita ningún cambio. Cuando todo esté corriendo con el nuevo, eliminas el viejo:

```bash
docker secret rm db_password
```

## Bonus: secretos en tiempo de build

Los secretos de runtime son solo la mitad de la historia. ¿Qué hay de un token privado de npm necesario durante el `npm ci`? **Nunca** uses `ARG` o `ENV` para eso: quedan en el historial de la imagen. Usa los secret mounts de BuildKit:

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
docker build --secret id=npmrc,src=$HOME/.npmrc -t miorg/api:1.0.0 .
```

El secreto solo está disponible durante esa única instrucción `RUN` y **no se guarda en ninguna capa**.

#### Secretos en el build con Compose

Si construyes con `docker compose build`, el flag `--secret` no está disponible. Compose los declara en la sección `build` en su lugar, tomando el valor de una variable de entorno del host:

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

El origen `environment` es exclusivo de Compose: no está soportado por `docker stack deploy`, donde usarías `file` o `external`.

## Beneficios de usar Docker secrets

1. **Menor superficie de ataque**: cada servicio solo ve los secretos que necesita, nada más.
2. **Imágenes limpias y reutilizables**: la misma imagen sirve para todos los entornos.
3. **Nada que se suba a Git por accidente**: los secretos viven en archivos ignorados, no en el repositorio.
4. **Configuración con permisos**: los archivos tienen `chmod`, los strings en el entorno no.
5. **Escalable sin refactorizar**: pasar de Compose a Swarm es cambiar el origen del secreto, no reescribir la app.
6. **Rotación viable**: cuando un secreto se compromete, lo cambias sin desplegar código nuevo.

## Consejos adicionales

- **No commitees secretos.** Agrega `secrets/` y `.env` a `.gitignore` desde el día uno, y considera un escáner como `gitleaks` o la protección de push de GitHub.
- **Usa `printf`, no `echo`,** al crear los archivos de secretos, y `.trim()` al leerlos.
- **Restringe los permisos.** `chmod 600` en los archivos del host, y consérvalos fuera del directorio del proyecto si puedes.
- **Da secretos por servicio.** Si un contenedor no necesita un secreto, no lo listes.
- **Nunca logrees tu objeto de configuración.** Un `console.log(config)` deshace todo lo anterior.
- **Rota regularmente**, e inmediatamente si sospechas de una fuga.
- **Usa secretos de `environment` en dev si quieres evitar archivos.** `secrets: { api_token: { environment: API_TOKEN } }` toma el valor de una variable del host, y es el único origen donde `uid`, `gid` y `mode` sí se respetan.
- **Recuerda que `.env` sigue sirviendo para interpolación.** Compose lee `.env` automáticamente y sustituye `${VAR}` en tu Compose file. Sirve para valores no sensibles como `POSTGRES_USER`, pero es justamente el mecanismo que filtra una contraseña en `docker compose config`.
- **Separa configuración de secreto.** Puertos, feature flags o niveles de log pueden seguir siendo variables de entorno normale sin problema.

## Solución de problemas comunes

### La app no puede leer el secreto

Si tu app solo sabe leer variables de entorno y no soporta la convención `_FILE`, tienes dos opciones:

- **Envolverla con un entrypoint** que lea el archivo y exporte la variable justo antes de arrancar (el ejemplo de Prisma de más arriba). El valor termina en el entorno de ese único proceso, pero nunca en la imagen ni en tu repo.
- **Parchear la app** para que lea `/run/secrets/<nombre>` directamente. Más trabajo inicial, pero el valor nunca entra al entorno.

### Permission denied al leer /run/secrets/...

Los atributos `uid`, `gid` y `mode` del long syntax **se ignoran silenciosamente en Docker Compose cuando el origen del secreto es un archivo**, porque un bind mount no permite remapear el dueño. El contenedor ve los permisos del archivo en el host, así que la solución es alinear el dueño en el host con el UID que corre el contenedor:

```bash
# El contenedor corre como node (uid 1000), así que:
sudo chown 1000:1000 secrets/db_password.txt

# O, más flexible, un grupo compartido
sudo chown $USER:docker secrets/db_password.txt
chmod 640 secrets/db_password.txt
```

### La contraseña es correcta pero la autenticación falla

Casi siempre es el salto de línea final. Compara el tamaño del archivo con el largo de la contraseña: si el archivo tiene un byte más, ese es el culpable.

```bash
# 'mi-password-super-secreto' tiene 25 caracteres
wc -c secrets/db_password.txt
```

Para arreglarlo, recrea el archivo con `printf` en vez de `echo`, y asegúrate de hacer `.trim()` al leerlo:

```bash
printf 'mi-password-super-secreto' > secrets/db_password.txt
wc -c secrets/db_password.txt   # 25, sin salto de línea
```

### El secreto no aparece en /run/secrets

Revisa estas tres cosas:

- **La ruta del `file:`** es relativa al archivo `docker-compose.yml`, no al directorio desde donde ejecutas el comando.
- **El servicio lista el secreto** en su bloque `secrets:`. Declararlo en la sección de nivel superior no lo monta en ningún servicio.
- **El nombre**: si usas `target:`, el nombre dentro del contenedor cambia. Con `target: /run/secrets/otro_nombre`, el archivo aparece con ese otro nombre.

### Cambié el archivo y el valor no se refleja

En Compose el secreto es un bind mount, así que basta con reiniciar el proceso que lo lee:

```bash
docker compose restart api
```

En Swarm es distinto: los secretos se resuelven al crear el contenedor, así que necesitas forzar la recreación del servicio.

```bash
docker service update --force myapp_api
```

### Encontré un secreto en el historial de Git o en una imagen

Primero lo importante: **rota la credencial**. Eso es lo único que realmente la deja segura. Después limpia el historial si quieres:

```bash
# ¿Apareció el valor en algún commit?
git log -S 'mi-password-super-secreto' --oneline

# Limpia el historial (reescribe commits: hazlo antes de que others clonen)
git filter-repo --path secrets --invert-paths
```

Para las imágenes, revisa si el valor quedó en las capas y reconstruye desde cero:

```bash
docker history --no-trunc miorg/api:1.0.0 | grep -i secret
docker system prune -a --volumes
```

## Conclusión

Un archivo `.env` está perfecto para configuración no sensible como puertos, feature flags o niveles de log. Pero para contraseñas, tokens y llaves, los Docker secrets son un cambio pequeño con un beneficio grande: tus secretos se quedan fuera del entorno, fuera de tus imágenes y fuera de `docker inspect`.

Empieza simple: mueve una contraseña a un archivo, agrega la variable `_FILE` y usa el helper `getSecret()`. Una vez que te resulte natural, el siguiente paso son los secretos de Swarm o un gestor de secretos en la nube.

Para consultas, la documentación oficial es la referencia completa: [docs.docker.com/compose/how-tos/use-secrets](https://docs.docker.com/compose/how-tos/use-secrets/) y [docs.docker.com/engine/swarm/secrets](https://docs.docker.com/engine/swarm/secrets/).