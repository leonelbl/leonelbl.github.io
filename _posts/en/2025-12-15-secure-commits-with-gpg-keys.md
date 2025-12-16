---
layout: post
title: "Secure Your Git Commits with GPG Keys"
date: 2025-12-15
categories: [gpg, linux, config, git]
tags: [gpg, config, linux, git]
lang: en
---
# Secure Your Git Commits with GPG Keys

> **TL;DR**: Signing commits with GPG allows you to prove authorship, protect your reputation, and comply with security policies. In this guide you’ll learn everything from the basics to an **advanced multi-identity setup by directory**, plus real-world best practices.

---

## Table of Contents

1. [Introduction](#introduction)
2. [What is GPG and how is it used with Git?](#what-is-gpg-and-how-is-it-used-with-git)
3. [Why should you sign your commits?](#why-should-you-sign-your-commits)
4. [Installing GPG](#installing-gpg)
5. [Basic configuration](#basic-configuration)
6. [Signing commits and tags](#signing-commits-and-tags)
7. [Multiple GPG keys by context (work / personal)](#multiple-gpg-keys-by-context-work--personal)
8. [Verifying signatures](#verifying-signatures)
9. [Common troubleshooting](#common-troubleshooting)
10. [Security best practices](#security-best-practices)
11. [Backup and recovery](#backup-and-recovery)
12. [Conclusion](#conclusion)

---

## Introduction

In modern software development, **security**, **traceability**, and **trust** are essential. Git records who created a commit, but by default it **blindly trusts** the configured name and email.

👉 Anyone can impersonate you… **unless you sign your commits**.

In this article you’ll learn:

* What GPG keys are and how they work with Git
* Why signing commits matters
* How to configure GPG correctly
* How to manage **multiple identities automatically**
* Practical best practices used in professional environments

---

## What is GPG and how is it used with Git?

**GPG (GNU Privacy Guard)** is a free implementation of the **OpenPGP** standard that allows you to:

* 🔐 Encrypt data
* ✍️ Sign data
* 🪪 Verify identities

In Git, GPG is mainly used to:

* **Sign commits** → prove authorship
* **Sign tags** → guarantee release authenticity
* **Auditing** → provide a verifiable history

GPG uses public-key cryptography:

* **Private key** → kept secret, used to sign
* **Public key** → shared, used to verify

---

## Why should you sign your commits?

### 1. Identity verification

This is perfectly valid in Git:

```bash
git config user.name "John Doe"
git config user.email "john.doe@example.com"
```

Without GPG, there is **no guarantee** the commit actually came from you.

---

### 2. Code integrity

If a signed commit is modified, the signature is **automatically invalidated**.

---

### 3. Trust in teams and open source

Maintainers can verify that contributions come from legitimate sources.

---

### 4. Compliance and auditing

Many companies require:

* Signed commits
* Verifiable history
* Clear identity separation

---

### 5. GitHub "Verified" badge

GitHub shows a green **Verified** badge when:

* The commit is signed
* The public key is added to your account
* The commit email matches the key

---

### 6. Reputation protection

Prevents others from committing malicious code under your name.

---

## Installing GPG

### Linux (Debian / Ubuntu)

```bash
sudo apt update
sudo apt install gnupg
```

### macOS

```bash
brew install gnupg
```

> 💡 On macOS, make sure `pinentry-mac` is installed so GPG can prompt for your passphrase.

### Windows

Install **Gpg4win** from its official site.

Verify installation:

```bash
gpg --version
```

---

## Basic configuration

### 1. Generate a GPG key

```bash
gpg --full-generate-key
```

Recommended options:

* **Type**: RSA and RSA
* **Key size**: 4096 bits
* **Expiration**: ✅ *Recommended* (e.g. 1–2 years)

> 🔐 Although keys can be created without expiration, **setting an expiration and rotating keys is a security best practice**.

---

### 2. List your keys

```bash
gpg --list-secret-keys --keyid-format=long
```

Example:

```
sec   rsa4096/ABCD1234EFGH5678 2024-01-15
uid   John Doe <john.doe@example.com>
```

The **Key ID** is what Git will use.

---

### 3. Export your public key

```bash
gpg --armor --export ABCD1234EFGH5678
```

Copy the entire block.

---

### 4. Add the key to GitHub

* GitHub → Settings → SSH and GPG Keys
* New GPG key
* Paste the public key

---

### 5. Configure Git

```bash
git config --global user.signingkey ABCD1234EFGH5678
git config --global commit.gpgsign true
git config --global tag.gpgsign true
```

Optional but recommended:

```bash
git config --global gpg.program gpg
```

---

## Signing commits and tags

Manually signed commit:

```bash
git commit -S -m "Signed commit"
```

Signed tag:

```bash
git tag -s v1.0.0 -m "Release v1.0.0"
```

---

## Multiple GPG keys by context (work / personal)

### Recommended directory structure

```
~/projects/
├── work/
└── personal/
```

---

### Conditional Git configuration (`includeIf`)

`~/.gitconfig`

```ini
[user]
    name = John Doe
    email = john.doe@example.com

[includeIf "gitdir:~/projects/personal/"]
    path = ~/.gitconfig-personal

[includeIf "gitdir:~/projects/work/"]
    path = ~/.gitconfig-work
```

---

### Personal configuration

```ini
[user]
    email = john.doe@example.com
    signingkey = ABCD1234EFGH5678

[commit]
    gpgsign = true
```

### Work configuration

```ini
[user]
    email = john.doe@company.com
    signingkey = WORK5678ABCD1234

[commit]
    gpgsign = true
```

✔ Automatic, safe, and error‑free.

---

## Verifying signatures

```bash
git log --show-signature
```

```bash
git verify-commit <hash>
```

On GitHub:

* ✅ Verified
* ⚠️ Unverified
* ❌ Invalid

---

## Common troubleshooting

### Error: `Inappropriate ioctl for device`

```bash
export GPG_TTY=$(tty)
```

---

### GPG asks for passphrase on every commit

`~/.gnupg/gpg-agent.conf`

```
default-cache-ttl 86400
max-cache-ttl 604800
```

```bash
gpgconf --kill gpg-agent
```

---

## Security best practices

* 🔐 Use 4096‑bit keys
* 🔄 Set expiration dates and rotate keys
* 🧩 One key per context
* 💾 Encrypted backups
* 🚫 Revoke compromised keys
* 📝 Document key usage

---

## Backup and recovery

```bash
gpg --export-secret-keys --armor KEY_ID > private.asc
gpg --gen-revoke KEY_ID > revoke.asc
```

⚠️ Store these files **offline and encrypted**.

---

## Conclusion

Signing your commits with GPG is not a trend — it’s a **professional standard**.

With this setup you gain:

* ✔ Verifiable authorship
* ✔ Identity protection
* ✔ Team trust
* ✔ Auditable history
* ✔ Real professionalism

If you work across multiple contexts, directory‑based configuration is **the best possible approach**.
