---
title: "cmux, Wave, Limux y WezTerm: Terminales modernas que cambian tu forma de trabajar"
date: 2026-07-01
categories: ["herramientas"]
tags: ["terminal", "cmux", "wave", "limux", "wezterm", "zellij", "yazi", "macos", "linux", "productividad"]
lang: es
translation_key: modern-terminals
description: "Una comparación interactiva y entretenida de terminales modernas: cmux para macOS, Wave Terminal, Limux para Linux y WezTerm con Zellij + Yazi. Descubre cómo cada una puede transformar tu flujo de trabajo."
---

# cmux, Wave y Limux: Tres terminales modernas que cambian tu forma de trabajar

Seamos sinceros: la terminal no ha cambiado mucho en 50 años. Texto verde en pantalla negra, cursor parpadeante, y a rezar para que recuerdes las banderas correctas. Pero 2026 es diferente. Tres terminales están redefiniendo lo que una línea de comandos puede ser — y cada una tiene su propia personalidad.

Bienvenido al **Terminal Throwdown** (el duelo de terminales).

---

## 🍏 cmux — El titán nativo de macOS

![Captura de cmux](https://raw.githubusercontent.com/manaflow-ai/cmux/main/docs/assets/main-first-image.png)

### La vibra

cmux es una app **nativa en Swift + AppKit** construida sobre el motor acelerado por GPU de Ghostty. Está diseñada para desarrolladores que ejecutan agentes de IA en paralelo y necesitan mantener un ojo en todos sin volverse locos.

| Característica | Qué hace |
|---|---|
| **Pestañas verticales** | Barra lateral muestra rama git, PR, directorio y puertos |
| **Anillos de notificación** | Los paneles brillan en azul cuando un agente te necesita |
| **Navegador integrado** | Abre un navegador real junto a tu terminal. API programable incluida |
| **Paneles divididos** | Divisiones horizontales y verticales dentro de cada espacio |
| **Programable** | CLI + API de socket Unix para automatizar todo |
| **Restaurar sesión** | Al reiniciar recupera layout, scrollback y estado de agentes |

### Qué la hace especial

cmux trata a los **agentes de IA como ciudadanos de primera clase**. Cuando Claude Code, Codex u OpenCode te necesita, el panel se ilumina — no más alt-tab entre 15 ventanas para ver quién se quedó atascado. Y el comando `cmux claude-teams` lanza a los compañeros como paneles nativos con metadatos en la barra lateral.

> **Instalar:** `brew install --cask cmux` o descarga el DMG en [cmux.com](https://cmux.com)

---

## 🌊 Wave Terminal — La navaja suiza multiplataforma

![Captura de Wave Terminal](https://raw.githubusercontent.com/wavetermdev/waveterm/main/assets/wave-screenshot.webp)

### La vibra

Wave es una **terminal open-source con IA integrada** para macOS, Linux y Windows. Piensa en ella como un escritorio de desarrollo dentro de una ventana de terminal — paneles arrastrables, editor incorporado, vista previa de archivos, y un asistente de IA que realmente lee lo que pasa en tu terminal.

| Característica | Qué hace |
|---|---|
| **Wave AI** | Asistente con contexto que lee el scrollback, analiza widgets y edita archivos |
| **SSH durable** | Las sesiones sobreviven cortes de red, reinicios y suspensión |
| **UI drag & drop** | Organiza terminales, editores, navegadores y chat IA en bloques flexibles |
| **Editor integrado** | Edita archivos remotos con resaltado de sintaxis, sin necesitar vim |
| **Vista previa** | Renderiza markdown, imágenes, PDFs, CSV en línea — dentro de tu terminal |
| **Sistema wsh** | Gestiona todo tu espacio de trabajo desde la CLI |

### Qué la hace especial

El **SSH durable** de Wave es un antes y un después. Tu sesión remota no muere cuando el WiFi titubea o la laptop se duerme — se reconecta automáticamente. Combinado con el diseño de paneles arrastrables, puedes tener una terminal, vista previa de archivos y chat IA todo visible a la vez sin moverte del teclado.

> **Instalar:** Descarga desde [waveterm.dev](https://www.waveterm.dev) — disponible para macOS, Linux y Windows

---

## 🐧 Limux — El multiplexor linuxero

![Captura de Limux](https://github.com/user-attachments/assets/6f3047c2-e2b6-49f2-b536-570a1570d0f8)

### La vibra

Limux es un **gestor de espacios de trabajo acelerado por GPU para Linux**, impulsado por el motor de Ghostty e inspirado por cmux. GTK4 nativo con libadwaita — se siente como si hubiera *nacido* en GNOME.

| Característica | Qué hace |
|---|---|
| **Renderizado GPU** | Ghostty vía OpenGL para texto increíblemente suave |
| **Espacios de trabajo** | Nombres tipo carpeta, persistencia, gestión desde barra lateral |
| **Paneles divididos** | Divisiones horizontales y verticales navegables por teclado |
| **Navegador integrado** | Panel WebKitGTK junto a tu terminal |
| **Arrastrar y soltar** | Reordenar espacios, fijar favoritos, colapsar barra lateral |
| **Editor de atajos** | Editor visual de atajos de teclado incluido en la terminal |

### Qué la hace especial

Si cmux es el hermano de macOS, Limux es el primo linuxero que heredó todos los genes bacanes. GTK4 nativo, acelerado por GPU, y profundamente integrado con el escritorio Linux. Incluso tiene un **editor de atajos de teclado** incorporado — `F11` para pantalla completa, atajos basados en `Ctrl`, soporte para tecla `Super`. Y viene en versiones `.deb`, `.rpm` y AppImage.

> **Instalar:** Descarga el `.deb`, `.rpm` o AppImage desde [github.com/am-will/limux](https://github.com/am-will/limux)

---

## 🦀 WezTerm — El caballo de batalla configurable

![Captura de WezTerm](https://wezterm.org/screenshots/two.png)

### La vibra

WezTerm es un **emulador de terminal y multiplexor acelerado por GPU** escrito en Rust por @wez. Corre en macOS, Linux, Windows y hasta FreeBSD. Si te encanta ajustar cada píxel de tu terminal con Lua, este es tu patio de juegos.

| Característica | Qué hace |
|---|---|
| **Aceleración GPU** | Motor wgpu (WebGPU) — Metal, Vulkan o DirectX 12 |
| **Multiplexor integrado** | Paneles, pestañas, ventanas — locales y remotas, con scrollback |
| **Configuración Lua** | Archivo scriptable con recarga en caliente |
| **SSH nativo** | Cliente SSH integrado con multiplexación y soporte de config |
| **Soporte de imágenes** | Protocolos Sixel, Kitty y iTerm2 |
| **Espacios de trabajo** | Sesiones nombradas que agrupan ventanas, pestañas y paneles |
| **Puerto serie** | Conexión a puertos serie para trabajo embebido/Arduino |

### Qué la hace especial

WezTerm es **la terminal más configurable de esta lista**. Todo es Lua — colores, atajos, reglas de ventanas, incluso manejadores de eventos personalizados. Lleva en desarrollo desde 2018, tiene más de 25K estrellas en GitHub, y es una de las terminales Rust más maduras. Pero a diferencia de las otras, no intenta ser una plataforma de IA ni un entorno de escritorio — es una terminal excelente que se aparta de tu camino.

> **Instalar:** `brew install --cask wezterm` (macOS) o descarga un paquete desde [wezterm.org](https://wezterm.org)

---

## 🧩 Potenciando WezTerm con Zellij + Yazi

Aquí es donde se pone interesante. WezTerm por sí solo es una terminal fantástica, pero combínala con **Zellij** (multiplexor de terminal) y **Yazi** (gestor de archivos), y obtienes un flujo de trabajo que compite con cualquier solución todo-en-uno — construido con piezas componibles.

### Zellij — El multiplexor que te enseña

<img src="https://zellij.dev/img/logo.png" alt="Logo de Zellij" width="300" />

Zellij es un **multiplexor de terminal escrito en Rust** que funciona dentro de cualquier emulador de terminal. Piensa en tmux, pero con ruedas de entrenamiento que se convierten en alas.

```
zellij           # Iniciar una sesión
Ctrl + p, n      # Nuevo panel abajo
Ctrl + p, d      # Nuevo panel a la derecha
Ctrl + t, n      # Nueva pestaña
Ctrl + o, w      # Gestor de sesiones (visual)
Ctrl + p, w      # Panel flotante (superposición, no desordena el layout)
```

**¿Por qué Zellij sobre tmux?** Paneles flotantes 🎯 — se superponen sin reorganizar tu diseño. Paneles apilados — capas de paneles uno sobre otro y cambias entre ellos. Las sugerencias de atajos en la parte inferior de la pantalla significan que nunca más tendrás que memorizar una tecla de prefijo.

### Yazi — El gestor de archivos más rápido que tu IDE

Yazi (significa "pato" 🦆) es un **gestor de archivos de terminal ultrarrápido escrito en Rust**, construido sobre I/O asíncrono. Es como ranger o lf, pero con esteroides y velocidad de GPU.

| Característica | Qué hace |
|---|---|
| **I/O asíncrono** | Nunca se congela — ni siquiera en monturas de red lentas |
| **Vista previa de imágenes** | Kitty, iTerm2, Sixel, Überzug++ — en línea en tu terminal |
| **Plugins Lua** | Previsualizadores personalizados, precargadores, sobreescrituras de UI |
| **Multi-pestaña** | Múltiples directorios abiertos a la vez con cambio instantáneo |
| **Atajos tipo Vim** | `j/k`, modo visual con `v`, copiar/pegar con `y`/`p` |
| **Integraciones** | ripgrep, fd, fzf, zoxide — busca y salta al instante |

### Armándolo todo

```
WezTerm  +  Zellij  +  Yazi
  │           │           │
  │     Multiplexor    Gestor archivos
  │     (paneles/tabs) (navegación)
  │
 Terminal
 (acelerada por GPU)
```

Así se ve una sesión típica:

1. Abre **WezTerm** — tu lienzo acelerado por GPU
2. Lanza **Zellij** — al instante tienes paneles, pestañas, ventanas flotantes y persistencia de sesión
3. Abre **Yazi** en un panel — navega archivos con previsualización de imágenes, busca con fzf, renombra en lote
4. Divide otro panel para tu editor/IDE
5. Panel flotante para comandos rápidos (`nvidia-smi`, `curl`, `tail -f`) que no desordenan tu layout

¿Lo mejor? Cada herramienta es la mejor en lo suyo, y juntas son imbatibles. Además, como Zellij y Yazi funcionan dentro de *cualquier* terminal, puedes usar esta misma configuración en un servidor remoto por SSH.

> **Instalar Zellij:** `cargo install zellij` o `brew install zellij` — [zellij.dev](https://zellij.dev)
> **Instalar Yazi:** `cargo install yazi-build` o `brew install yazi` — [yazi-rs.github.io](https://yazi-rs.github.io)

---

## ⚔️ Cara a cara

| Característica | Ghostty (cmux) | Wave Terminal | Limux | WezTerm |
| :--- | :--- | :--- | :--- | :--- |
| **Plataforma** | Solo macOS | macOS, Linux, Windows | Solo Linux | macOS, Linux, Windows, BSD |
| **Lenguaje** | Swift + AppKit | Go + TypeScript | Rust + GTK4 | Rust |
| **Aceleración GPU** | ✅ (libghostty) | ❌ (xterm.js) | ✅ (libghostty) | ✅ (wgpu) |
| **Integración IA** | ✉️ Notificaciones de agente | ✅ Asistente integrado | ✉️ Notificaciones de agente | ❌ (Configurable por usuario) |
| **Navegador integrado**| ✅ Programable | ✅ Widget web | ✅ WebKitGTK | ❌ No tiene |
| **SSH** | ✅ Espacios nativos | ✅ Reconexión automática | 🐚 Vía terminal | ✅ Nativo + multiplexación |
| **Paneles divididos** | ✅ Soportado | ✅ Basado en mosaicos | ✅ Soportado | ✅ Multiplexor integrado |
| **Open Source** | ✅ GPL-3.0 | ✅ Apache 2.0 | ✅ GPL-3.0 | ✅ MIT |
| **Restaurar sesión** | ✅ Completa | ✅ Durable | ✅ Por espacio | ✅ Vía Zellij / Nativo |
| **Programable** | CLI + Socket API | Sistema `wsh` | CLI + Socket API | Scripting en Lua |

---

## 🎯 ¿Cuál deberías elegir?

Imagina que esto es un test de personalidad:

- **Usas Mac, corres múltiples agentes de IA y quieres notificaciones visuales cuando uno te necesita.** → **cmux** es tu alma gemela.
- **Saltas entre macOS, Linux y Windows, necesitas SSH durable y quieres una IA que lea tu terminal.** → **Wave Terminal** te cubre las espaldas.
- **Vives en Linux, quieres rendimiento nativo GTK4 y amas el flujo de trabajo inspirado en cmux.** → **Limux** es el indicado.
- **Quieres máxima configurabilidad con Lua, amas las herramientas componibles y el flujo terminal + Zellij + Yazi.** → **WezTerm** es lo tuyo.

O, ya sabes, pruébalas todas y decide. Son todas gratis y open source.

---

## Conclusión

El emulador de terminal ya no es solo una caja donde aparece texto. cmux, Wave, Limux y WezTerm están reinventando lo que puede ser — desde espacios de trabajo conscientes de agentes hasta copilotos de IA y multiplexación acelerada por GPU. Y con Zellij y Yazi, incluso una terminal tradicional puede potenciarse hasta convertirse en una central moderna. Ya sea que estés en macOS, Linux o saltando entre ambos, 2026 es un gran año para actualizar tu terminal.

Elige a tu luchador.
