---
title: "Asegura tus Commits de Git con Llaves GPG"
date: 2025-12-15
categories: ["gpg", "linux", "config", "git"]
tags: ["gpg", "config", "linux", "git"]
lang: es
translation_key: secure-commits-with-gpg-keys
description: "Aprende cómo firmar tus commits de Git con llaves GPG para demostrar autoría y proteger tu reputación."
---

# Asegura tus Commits de Git con Llaves GPG

> **TL;DR**: Firmar commits con GPG te permite demostrar autoría, proteger tu reputación y cumplir políticas de seguridad. En esta guía aprenderás desde lo básico hasta una configuración avanzada con **múltiples identidades por directorio**, además de buenas prácticas reales.

---

## Introducción

En el desarrollo de software moderno, la **seguridad**, la **trazabilidad** y la **confianza** son fundamentales. Git registra quién hizo un commit, pero por defecto **confía ciegamente** en el nombre y correo configurados.

Cualquiera puede hacerse pasar por ti… **a menos que firmes tus commits**.

En este artículo aprenderás:

* Qué son las llaves GPG y cómo funcionan en Git
* Por qué deberías firmar tus commits
* Cómo configurarlas correctamente
* Cómo manejar **múltiples identidades GPG automáticamente**
* Buenas prácticas reales para entornos profesionales

---

## ¿Qué es GPG y para qué se usa en Git?

**GPG (GNU Privacy Guard)** es una implementación libre del estándar **OpenPGP** que permite:

* Cifrar información
* Firmar datos
* Verificar identidades

En Git, GPG se utiliza principalmente para:

* **Firmar commits** → demostrar autoría
* **Firmar tags** → garantizar autenticidad de releases
* **Auditoría** → trazabilidad confiable del código

GPG usa criptografía de clave pública:

* **Llave privada** → solo tú la tienes (firma)
* **Llave pública** → la compartes (verificación)

---

## ¿Por qué firmar tus commits?

### 1. Verificación de identidad

Esto es perfectamente válido en Git:

```bash
git config user.name "John Doe"
git config user.email "john.doe@email.com"
```

Sin GPG, **no hay garantía** de que el commit sea realmente tuyo.

---

### 2. Integridad del código

Si un commit firmado se modifica, la firma **se invalida automáticamente**.

---

### 3. Confianza en equipos y open source

Permite a mantenedores verificar que las contribuciones provienen de fuentes legítimas.

---

### 4. Compliance y auditoría

Muchas empresas requieren:

* Commits firmados
* Historial verificable
* Identidades separadas por contexto

---

### 5. Badge "Verified" en GitHub

GitHub muestra un badge verde **Verified** cuando:

* El commit está firmado
* La llave pública está en tu cuenta
* El email coincide

---

### 6. Protección de reputación

Evita suplantación de identidad en tu nombre o proyectos.

---

## Instalación de GPG

### Linux (Debian / Ubuntu)

```bash
sudo apt update
sudo apt install gnupg
```

### macOS

```bash
brew install gnupg
```

> En macOS asegúrate de tener `pinentry-mac` instalado para el prompt de contraseña.

### Windows

Instala **Gpg4win** desde su sitio oficial.

Verifica la instalación:

```bash
gpg --version
```

---

## Configuración básica

### 1. Generar una llave GPG

```bash
gpg --full-generate-key
```

Recomendaciones:

* **Tipo**: RSA and RSA
* **Tamaño**: 4096 bits
* **Expiración**: Recomendado (ej: 1–2 años)

> Aunque GPG permite llaves sin expiración, **expirar y rotar llaves es una mejor práctica de seguridad**.

---

### 2. Listar llaves

```bash
gpg --list-secret-keys --keyid-format=long
```

Ejemplo:

```
sec   rsa4096/ABCD1234EFGH5678 2024-01-15
uid   John Doe <john.doe@personal.com>
```

El **Key ID** es lo que usará Git.

---

### 3. Exportar llave pública

```bash
gpg --armor --export ABCD1234EFGH5678
```

Copia el bloque completo.

---

### 4. Agregar llave a GitHub

* GitHub → Settings → SSH and GPG Keys
* New GPG Key
* Pega la llave pública

---

### 5. Configurar Git

```bash
git config --global user.signingkey ABCD1234EFGH5678
git config --global commit.gpgsign true
git config --global tag.gpgsign true
```

Opcional pero recomendado:

```bash
git config --global gpg.program gpg
```

---

## Firmar commits y tags

Commit firmado manualmente:

```bash
git commit -S -m "Signed commit"
```

Tag firmado:

```bash
git tag -s v1.0.0 -m "Release v1.0.0"
```

---

## Múltiples llaves GPG por contexto (trabajo / personal)

### Estructura recomendada

```
~/projects/
├── work/
└── personal/
```

---

### Configuración condicional (`includeIf`)

`~/.gitconfig`

```ini
[user]
    name = John Doe
    email = john.doe@email.com

[includeIf "gitdir:~/projects/personal/"]
    path = ~/.gitconfig-personal

[includeIf "gitdir:~/projects/work/"]
    path = ~/.gitconfig-work
```

---

### Configuración personal

```ini
[user]
    email = john.doe@personal.com
    signingkey = ABCD1234EFGH5678

[commit]
    gpgsign = true
```

### Configuración trabajo

```ini
[user]
    email = john.doe@company.com
    signingkey = WORK5678ABCD1234

[commit]
    gpgsign = true
```

---

## Verificación de firmas

```bash
git log --show-signature
```

```bash
git verify-commit <hash>
```

En GitHub:

* Verified
* Unverified
* Invalid

---

## Solución de problemas comunes

### Error: `Inappropriate ioctl for device`

```bash
export GPG_TTY=$(tty)
```

---

### GPG pide contraseña en cada commit

`~/.gnupg/gpg-agent.conf`

```
default-cache-ttl 86400
max-cache-ttl 604800
```

```bash
gpgconf --kill gpg-agent
```

---

## Buenas prácticas de seguridad

* Usa llaves de 4096 bits
* Establece expiración y rota llaves
* Una llave por contexto
* Respaldos cifrados
* Revoca llaves comprometidas
* Documenta tus llaves

---

## Respaldo y recuperación

```bash
gpg --export-secret-keys --armor KEY_ID > private.asc
gpg --gen-revoke KEY_ID > revoke.asc
```

Guarda estos archivos **offline y cifrados**.

---

## Conclusión

Firmar tus commits con GPG no es una moda, es una **práctica profesional**.

Con esta configuración obtienes:

* Autoría verificable
* Protección de identidad
* Confianza en equipos
* Historial auditable
* Profesionalismo real

Si trabajas en múltiples contextos, la configuración por directorios es **la mejor solución posible**.
