---
layout: post
title: "Cómo Configurar Múltiples Llaves SSH de Git y Conectarlas con GitHub"
date: 2025-12-06
categories: [linux, config, git]
tags: [config, linux, git]
lang: es
---
# Cómo Configurar Múltiples Llaves SSH de Git y Conectarlas con GitHub

## Introducción

Si trabajas en proyectos personales y profesionales en la misma computadora, probablemente te has enfrentado al desafío de manejar múltiples cuentas de GitHub o diferentes llaves SSH para distintos contextos. La buena noticia es que existe una solución elegante y sencilla: configurar múltiples llaves SSH usando un archivo `config`.

En este artículo te mostraré cómo configurar y gestionar varias llaves SSH en tu sistema, permitiéndote trabajar sin conflictos entre tus proyectos personales y laborales.

## ¿Por qué necesitas múltiples llaves SSH?

Existen varias razones por las que podrías necesitar configurar múltiples llaves SSH:

- **Separación de contextos**: Mantener separados tus proyectos personales de los laborales es una buena práctica de organización y seguridad.
- **Múltiples cuentas de GitHub**: Si tienes una cuenta personal y otra del trabajo, necesitarás llaves diferentes para cada una.
- **Seguridad mejorada**: Si una llave se ve comprometida, solo afecta a un contexto específico, no a todos tus proyectos.
- **Políticas empresariales**: Muchas empresas requieren el uso de llaves SSH específicas para acceder a sus repositorios.

## Requisitos previos

Antes de comenzar, asegúrate de tener:

- Git instalado en tu sistema
- Acceso a la terminal o línea de comandos
- Al menos dos pares de llaves SSH (pública y privada) ya generadas
- Cuentas de GitHub configuradas

Si aún no has generado tus llaves SSH, puedes hacerlo con el siguiente comando:

```bash
ssh-keygen -t ed25519 -C "tu_email@ejemplo.com" -f ~/.ssh/id_personal
```

Repite el proceso para crear tu llave del trabajo:

```bash
ssh-keygen -t ed25519 -C "tu_email@trabajo.com" -f ~/.ssh/id_trabajo
```

## Configuración paso a paso

### Paso 1: Crear el archivo config

Primero, necesitas crear un archivo de configuración en tu directorio `.ssh`. Este archivo le dirá a SSH qué llave usar para cada conexión.

```bash
touch ~/.ssh/config
```

Si el archivo ya existe, simplemente ábrelo con tu editor favorito:

```bash
nano ~/.ssh/config
# o
vim ~/.ssh/config
# o
code ~/.ssh/config
```

### Paso 2: Configurar tus llaves SSH

Dentro del archivo `config`, añade las configuraciones para cada una de tus llaves. Aquí te muestro un ejemplo completo con dos configuraciones:

```
# Configuración para proyectos personales
Host github.com-personal
    HostName github.com
    AddKeysToAgent yes
    IdentityFile ~/.ssh/id_personal

# Configuración para proyectos del trabajo
Host github.com-trabajo
    HostName github.com
    AddKeysToAgent yes
    IdentityFile ~/.ssh/id_trabajo
```

**Explicación de cada parámetro:**

- **Host**: Es el alias que usarás para identificar esta conexión. Puede ser cualquier nombre que elijas.
- **HostName**: El dominio real del servidor (en este caso, github.com).
- **AddKeysToAgent**: Añade automáticamente la llave al agente SSH para que no tengas que introducir la contraseña constantemente.
- **IdentityFile**: La ruta a tu llave privada SSH.

### Paso 3: Ajustar los permisos del archivo config

Por seguridad, es importante que el archivo `config` tenga los permisos correctos:

```bash
chmod 600 ~/.ssh/config
```

### Paso 4: Agregar las llaves públicas a GitHub

Ahora necesitas agregar cada llave pública a su respectiva cuenta de GitHub:

1. Copia el contenido de tu llave pública:
   ```bash
   cat ~/.ssh/id_personal.pub
   ```

2. Ve a GitHub → Settings → SSH and GPG keys → New SSH key

3. Pega el contenido y dale un nombre descriptivo (ej: "Mi Laptop Personal")

4. Repite el proceso para tu llave del trabajo en la cuenta correspondiente

## Cómo usar tus llaves configuradas

### Clonar un repositorio

Cuando clones un repositorio, simplemente reemplaza `github.com` con el alias que configuraste en tu archivo `config`:

**Proyecto personal:**
```bash
git clone git@github.com-personal:usuario/mi-proyecto-personal.git
```

**Proyecto del trabajo:**
```bash
git clone git@github.com-trabajo:empresa/proyecto-trabajo.git
```

### Cambiar la URL remota de un repositorio existente

Si ya tienes repositorios clonados, puedes cambiar su URL remota para usar el alias correcto:

```bash
# Ver la URL actual
git remote -v

# Cambiar a la configuración personal
git remote set-url origin git@github.com-personal:usuario/mi-proyecto.git

# O cambiar a la configuración del trabajo
git remote set-url origin git@github.com-trabajo:empresa/proyecto.git
```

### Verificar la conexión

Puedes verificar que tu configuración funciona correctamente con:

```bash
ssh -T git@github.com-personal
ssh -T git@github.com-trabajo
```

Deberías recibir un mensaje como: "Hi usuario! You've successfully authenticated..."

## Ejemplo completo de flujo de trabajo

Imagina que trabajas en un proyecto personal por la mañana y en uno del trabajo por la tarde:

```bash
# Por la mañana - Proyecto personal
cd ~/proyectos/personales
git clone git@github.com-personal:usuario/proyecto-personal.git
cd mi-blog
# Trabajas en tu código...
git add .
git commit -m "Nuevo post del blog"
git push origin main

# Por la tarde - Proyecto del trabajo
cd ~/proyectos/trabajo
git clone git@github.com-trabajo:empresa/aplicacion-web.git
cd aplicacion-web
# Trabajas en el proyecto...
git add .
git commit -m "Feature: nueva funcionalidad"
git push origin main
```

Todo funciona sin conflictos porque cada repositorio usa automáticamente la llave SSH correcta.

## Beneficios de esta configuración

1. **Organización clara**: Separas claramente tus contextos de trabajo sin confusiones
2. **Sin cambios manuales**: No necesitas cambiar configuraciones cada vez que cambias de proyecto
3. **Mayor seguridad**: Cada contexto tiene su propia llave, reduciendo el riesgo de comprometer todos tus proyectos
4. **Cumplimiento de políticas**: Facilita cumplir con políticas empresariales que requieren llaves específicas
5. **Escalabilidad**: Puedes agregar tantas configuraciones como necesites (freelance, open source, etc.)
6. **Menos errores**: Evitas accidentalmente hacer push a repositorios del trabajo con tu cuenta personal o viceversa

## Consejos adicionales

- **Nombres descriptivos**: Usa nombres claros en tus alias (`github.com-personal`, `github.com-trabajo`) para evitar confusiones
- **Documentación**: Mantén un registro de qué llave usas para qué propósito
- **Respaldos**: Asegúrate de hacer respaldo de tus llaves privadas de forma segura
- **Rotación de llaves**: Considera cambiar tus llaves SSH periódicamente por seguridad
- **Variables de entorno Git**: También puedes configurar diferentes nombres de usuario y correos para cada repositorio con configuraciones locales de Git

## Solución de problemas comunes

### "Permission denied (publickey)"

Si recibes este error, verifica:
- Que la llave pública esté agregada a GitHub
- Que estés usando el alias correcto en la URL
- Que los permisos del archivo sean correctos (`chmod 600`)

### La llave no se encuentra

Asegúrate de que la ruta en `IdentityFile` sea correcta:
```bash
ls -la ~/.ssh/
```

### Problemas con el agente SSH

Inicia el agente SSH y agrega tus llaves manualmente:
```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_personal
ssh-add ~/.ssh/id_trabajo
```

## Conclusión

Configurar múltiples llaves SSH es más sencillo de lo que parece y ofrece beneficios significativos en términos de organización, seguridad y productividad. Con un simple archivo `config`, puedes gestionar sin esfuerzo múltiples identidades y contextos de trabajo.

Esta configuración te permitirá trabajar de manera más eficiente, evitando conflictos entre tus proyectos personales y profesionales, y manteniendo una separación clara que es beneficiosa tanto desde el punto de vista técnico como organizacional.