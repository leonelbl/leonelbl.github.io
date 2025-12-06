---
layout: post
title: "How to Configure Multiple Git SSH Keys and Connect Them with GitHub"
date: 2025-12-06
categories: [linux, config, git]
tags: [config, linux, git]
lang: en
---
# How to Configure Multiple Git SSH Keys and Connect Them with GitHub

## Introduction

If you work on personal and professional projects on the same computer, you've probably faced the challenge of managing multiple GitHub accounts or different SSH keys for different contexts. The good news is that there's an elegant and simple solution: configuring multiple SSH keys using a `config` file.

In this article, I'll show you how to configure and manage multiple SSH keys on your system, allowing you to work without conflicts between your personal and work projects.

## Why do you need multiple SSH keys?

There are several reasons why you might need to configure multiple SSH keys:

- **Context separation**: Keeping your personal projects separate from work ones is a good practice for organization and security.
- **Multiple GitHub accounts**: If you have a personal account and a work account, you'll need different keys for each.
- **Improved security**: If one key is compromised, it only affects a specific context, not all your projects.
- **Corporate policies**: Many companies require the use of specific SSH keys to access their repositories.

## Prerequisites

Before starting, make sure you have:

- Git installed on your system
- Access to the terminal or command line
- At least two pairs of SSH keys (public and private) already generated
- Configured GitHub accounts

If you haven't generated your SSH keys yet, you can do so with the following command:

```bash
ssh-keygen -t ed25519 -C "your_email@example.com" -f ~/.ssh/id_personal
```

Repeat the process to create your work key:

```bash
ssh-keygen -t ed25519 -C "your_email@work.com" -f ~/.ssh/id_work
```

## Step-by-step configuration

### Step 1: Create the config file

First, you need to create a configuration file in your `.ssh` directory. This file will tell SSH which key to use for each connection.

```bash
touch ~/.ssh/config
```

If the file already exists, simply open it with your favorite editor:

```bash
nano ~/.ssh/config
# or
vim ~/.ssh/config
# or
code ~/.ssh/config
```

### Step 2: Configure your SSH keys

Inside the `config` file, add the configurations for each of your keys. Here's a complete example with two configurations:

```
# Configuration for personal projects
Host github.com-personal
    HostName github.com
    AddKeysToAgent yes
    IdentityFile ~/.ssh/id_personal

# Configuration for work projects
Host github.com-work
    HostName github.com
    AddKeysToAgent yes
    IdentityFile ~/.ssh/id_work
```

**Explanation of each parameter:**

- **Host**: The alias you'll use to identify this connection. It can be any name you choose.
- **HostName**: The actual server domain (in this case, github.com).
- **AddKeysToAgent**: Automatically adds the key to the SSH agent so you don't have to enter the password constantly.
- **IdentityFile**: The path to your private SSH key.

### Step 3: Adjust config file permissions

For security, it's important that the `config` file has the correct permissions:

```bash
chmod 600 ~/.ssh/config
```

### Step 4: Add public keys to GitHub

Now you need to add each public key to its respective GitHub account:

1. Copy the content of your public key:
   ```bash
   cat ~/.ssh/id_personal.pub
   ```

2. Go to GitHub → Settings → SSH and GPG keys → New SSH key

3. Paste the content and give it a descriptive name (e.g., "My Personal Laptop")

4. Repeat the process for your work key on the corresponding account

## How to use your configured keys

### Cloning a repository

When cloning a repository, simply replace `github.com` with the alias you configured in your `config` file:

**Personal project:**
```bash
git clone git@github.com-personal:username/my-personal-project.git
```

**Work project:**
```bash
git clone git@github.com-work:company/work-project.git
```

### Change the remote URL of an existing repository

If you already have cloned repositories, you can change their remote URL to use the correct alias:

```bash
# View current URL
git remote -v

# Change to personal configuration
git remote set-url origin git@github.com-personal:username/my-project.git

# Or change to work configuration
git remote set-url origin git@github.com-work:company/project.git
```

### Verify the connection

You can verify that your configuration works correctly with:

```bash
ssh -T git@github.com-personal
ssh -T git@github.com-work
```

You should receive a message like: "Hi username! You've successfully authenticated..."

## Complete workflow example

Imagine you work on a personal project in the morning and a work project in the afternoon:

```bash
# Morning - Personal project
cd ~/projects/personal
git clone git@github.com-personal:username/my-blog.git
cd my-blog
# Work on your code...
git add .
git commit -m "New blog post"
git push origin main

# Afternoon - Work project
cd ~/projects/work
git clone git@github.com-work:company/web-application.git
cd web-application
# Work on the project...
git add .
git commit -m "Feature: new functionality"
git push origin main
```

Everything works without conflicts because each repository automatically uses the correct SSH key.

## Benefits of this configuration

1. **Clear organization**: You clearly separate your work contexts without confusion
2. **No manual changes**: You don't need to change configurations every time you switch projects
3. **Greater security**: Each context has its own key, reducing the risk of compromising all your projects
4. **Policy compliance**: Makes it easier to comply with corporate policies that require specific keys
5. **Scalability**: You can add as many configurations as you need (freelance, open source, etc.)
6. **Fewer errors**: You avoid accidentally pushing to work repositories with your personal account or vice versa

## Additional tips

- **Descriptive names**: Use clear names in your aliases (`github.com-personal`, `github.com-work`) to avoid confusion
- **Documentation**: Keep a record of which key you use for what purpose
- **Backups**: Make sure to securely backup your private keys
- **Key rotation**: Consider changing your SSH keys periodically for security
- **Git environment variables**: You can also configure different usernames and emails for each repository with local Git configurations

## Common troubleshooting

### "Permission denied (publickey)"

If you receive this error, verify:
- That the public key is added to GitHub
- That you're using the correct alias in the URL
- That the file permissions are correct (`chmod 600`)

### Key not found

Make sure the path in `IdentityFile` is correct:
```bash
ls -la ~/.ssh/
```

### Issues with SSH agent

Start the SSH agent and add your keys manually:
```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_personal
ssh-add ~/.ssh/id_work
```

## Conclusion

Configuring multiple SSH keys is simpler than it seems and offers significant benefits in terms of organization, security, and productivity. With a simple `config` file, you can effortlessly manage multiple identities and work contexts.

This configuration will allow you to work more efficiently, avoiding conflicts between your personal and professional projects, and maintaining a clear separation that is beneficial from both a technical and organizational standpoint.