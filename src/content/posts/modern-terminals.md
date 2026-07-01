---
title: "cmux, Wave, Limux, and WezTerm: Modern Terminals That Change How You Work"
date: 2026-07-01
categories: ["tools"]
tags: ["terminal", "cmux", "wave", "limux", "wezterm", "zellij", "yazi", "macos", "linux", "productivity"]
lang: en
translation_key: modern-terminals
description: "A fun, interactive comparison of modern terminals: cmux for macOS, Wave Terminal, Limux for Linux, and WezTerm with Zellij + Yazi. See how each can transform your workflow."
---

# cmux, Wave, and Limux: Three Modern Terminals That Change How You Work

Let's be honest: the terminal hasn't changed much in 50 years. Green text on a black screen, blinking cursor, and pray you remember the right flags. But 2026 is different. Three terminals are redefining what a command line can be — and each has a personality of its own.

Welcome to the **Terminal Throwdown**.

---

## 🍏 cmux — The Mac-Native Powerhouse

![cmux screenshot](https://raw.githubusercontent.com/manaflow-ai/cmux/main/docs/assets/main-first-image.png)

### The Vibe

cmux is a **native Swift + AppKit** app built on Ghostty's GPU-accelerated engine. It's designed for developers who run AI coding agents in parallel and need to keep an eye on all of them without losing their mind.

| Feature | What it does |
|---|---|
| **Vertical tabs** | Sidebar shows git branch, PR status, working directory, and ports |
| **Notification rings** | Panes glow blue when an agent needs your attention |
| **In-app browser** | Split a real browser next to your terminal. Scriptable API included |
| **Split panes** | Horizontal + vertical splits within each workspace |
| **Programmable** | CLI + Unix socket API to automate everything |
| **Session restore** | Full layout, scrollback, and agent state come back on relaunch |

### What makes it special

cmux treats **AI agents as first-class citizens**. When Claude Code, Codex, or OpenCode needs you, the pane lights up — no more alt-tabbing through 15 windows to see who's stuck. And the `cmux claude-teams` command spawns teammates as native splits with sidebar metadata.

> **Install:** `brew install --cask cmux` or grab the DMG at [cmux.com](https://cmux.com)

---

## 🌊 Wave Terminal — The Cross-Platform Swiss Army Knife

![Wave Terminal screenshot](https://raw.githubusercontent.com/wavetermdev/waveterm/main/assets/wave-screenshot.webp)

### The Vibe

Wave is an **open-source AI-integrated terminal** for macOS, Linux, and Windows. Think of it as a development desktop inside a terminal window — drag-and-drop tiles, built-in editor, file previews, and an AI assistant that actually reads your terminal output.

| Feature | What it does |
|---|---|
| **Wave AI** | Context-aware assistant that reads scrollback, analyzes widgets, edits files |
| **Durable SSH** | Sessions survive network drops, restarts, and computer sleep |
| **Drag & drop UI** | Tile terminals, editors, browsers, and AI chat in flexible blocks |
| **Built-in editor** | Edit remote files with syntax highlighting, no vim required |
| **File previews** | Render markdown, images, PDFs, CSVs inline — inside your terminal |
| **wsh command system** | Manage your whole workspace from the CLI |

### What makes it special

Wave's **durable SSH** is a game-changer. Your remote session doesn't die when your WiFi flickers or your laptop goes to sleep — it reconnects automatically. Combined with the drag-and-drop workspace layout, you can have a terminal, file preview, and AI chat all visible at once without leaving your keyboard.

> **Install:** Download from [waveterm.dev](https://www.waveterm.dev) — available for macOS, Linux, and Windows

---

## 🐧 Limux — The Linux-First Multiplexer

![Limux screenshot](https://github.com/user-attachments/assets/6f3047c2-e2b6-49f2-b536-570a1570d0f8)

### The Vibe

Limux is a **GPU-accelerated terminal workspace manager for Linux**, powered by Ghostty's rendering engine and inspired by cmux. Native GTK4 with libadwaita — it feels like it was *born* on GNOME.

| Feature | What it does |
|---|---|
| **GPU rendering** | Embedded Ghostty via OpenGL for buttery-smooth text |
| **Workspaces** | Folder-based naming, persistence, sidebar management |
| **Split panes** | Keyboard-navigable horizontal and vertical splits |
| **Built-in browser** | WebKitGTK browser pane alongside your terminal |
| **Drag & drop** | Reorder workspaces, pin favorites, collapse sidebar |
| **Keybind editor** | Visual shortcut editor shipped inside the terminal |

### What makes it special

If cmux is the macOS sibling, Limux is the Linux cousin that inherited all the cool genes. GTK4 native, GPU-accelerated, and deeply integrated with the Linux desktop. It even has a built-in **keyboard shortcut editor** — `F11` for fullscreen, `Ctrl`-based defaults, `Super` key support. And it comes in `.deb`, `.rpm`, and AppImage flavors.

> **Install:** Grab the `.deb`, `.rpm`, or AppImage from [github.com/am-will/limux](https://github.com/am-will/limux)

---

## 🦀 WezTerm — The Configurable Cross-Platform Workhorse

![WezTerm screenshot](https://wezterm.org/screenshots/two.png)

### The Vibe

WezTerm is a **GPU-accelerated cross-platform terminal emulator and multiplexer** written in Rust by @wez. It runs on macOS, Linux, Windows, and even FreeBSD. If you love tweaking every pixel of your terminal with Lua, this is your playground.

| Feature | What it does |
|---|---|
| **GPU acceleration** | wgpu (WebGPU) backend — Metal, Vulkan, or DirectX 12 |
| **Built-in multiplexer** | Panes, tabs, windows — local and remote, with scrollback |
| **Lua config** | Hot-reloaded, scriptable configuration file |
| **SSH native** | Built-in SSH client with multiplexing and config file support |
| **Image support** | Sixel, Kitty, and iTerm2 graphics protocols |
| **Workspaces** | Named sessions that group windows, tabs, and panes |
| **Serial support** | Connect to serial ports for embedded/Arduino work |

### What makes it special

WezTerm is **the most configurable terminal on this list**. Everything is Lua — colors, keybindings, window rules, even custom event handlers. It's been in development since 2018, has 25K+ GitHub stars, and is one of the most mature Rust terminals out there. But unlike the others, it doesn't try to be an AI platform or a desktop environment — it's a damn good terminal that gets out of your way.

> **Install:** `brew install --cask wezterm` (macOS), or grab a package from [wezterm.org](https://wezterm.org)

---

## 🧩 Supercharging WezTerm with Zellij + Yazi

Here's where it gets interesting. WezTerm on its own is a fantastic terminal, but pair it with **Zellij** (terminal multiplexer) and **Yazi** (file manager), and you get a workflow that rivals any all-in-one solution — built from composable pieces.

### Zellij — The Multiplexer That Actually Teaches You

<img src="https://zellij.dev/img/logo.png" alt="Zellij logo" width="300" />

Zellij is a **terminal multiplexer written in Rust** that works inside any terminal emulator. Think tmux, but with training wheels that turn into wings.

```
zellij           # Start a session
Ctrl + p, n      # New pane below
Ctrl + p, d      # New pane to the right
Ctrl + t, n      # New tab
Ctrl + o, w      # Session manager (visual!)
Ctrl + p, w      # Floating pane (overlay, doesn't disturb layout)
```

**Why Zellij over tmux?** Floating panes 🎯 — they overlay your layout without rearranging it. Stacked panes — layer panes on top of each other and switch between them. The built-in keybinding hints at the bottom of the screen mean you never have to memorize a prefix key again.

### Yazi — The File Manager That's Faster Than Your IDE

Yazi (means "duck" 🦆) is a **blazing-fast terminal file manager written in Rust**, built on async I/O. It's like ranger or lf, but on steroids and with GPU-level speed.

| Feature | What it does |
|---|---|
| **Async I/O** | Never freezes — even on slow network mounts |
| **Image previews** | Kitty, iTerm2, Sixel, Überzug++ — inline in your terminal |
| **Lua plugins** | Custom previewers, preloaders, UI overrides |
| **Multi-tab** | Multiple directories open at once with instant switching |
| **Vim keybindings** | `j/k`, visual mode with `v`, yank/paste with `y`/`p` |
| **Built-in integrations** | ripgrep, fd, fzf, zoxide — search and jump instantly |

### Putting It All Together

```
WezTerm  +  Zellij  +  Yazi
  │           │           │
  │     Multiplexer    File Manager
  │     (panes/tabs)   (navigation)
  │
 Terminal Emulator
 (GPU-accelerated)
```

Here's what a typical session looks like:

1. Open **WezTerm** — your GPU-accelerated canvas
2. Launch **Zellij** — instantly get panes, tabs, floating windows, and session persistence
3. Open **Yazi** in one pane — browse files with image previews, search with fzf, bulk rename
4. Split another pane for your editor/IDE
5. Floating pane for quick commands (`nvidia-smi`, `curl`, `tail -f`) that don't disturb your layout

The beauty? Each tool is best-in-class at one thing, and together they're unstoppable. Plus, since Zellij and Yazi run inside *any* terminal, you can use this exact setup on a remote server over SSH.

> **Install Zellij:** `cargo install zellij` or `brew install zellij` — [zellij.dev](https://zellij.dev)
> **Install Yazi:** `cargo install yazi-build` or `brew install yazi` — [yazi-rs.github.io](https://yazi-rs.github.io)

---

## ⚔️ Head-to-Head

| Feature | Wave Terminal | Limux | WezTerm |
| :--- | :--- | :--- | :--- |
| **Platform** | macOS, Linux, Windows | Linux only | macOS, Linux, Windows, BSD |
| **Language** | Go + TypeScript | Rust + GTK4 | Rust |
| **GPU Acceleration** | ❌ (xterm.js) | ✅ (libghostty) | ✅ (wgpu) |
| **AI Integration** | ✅ Built-in AI assistant | ✉️ Agent notifications | ❌ (User-configured) |
| **Built-in Browser** | ✅ Web widget | ✅ WebKitGTK | ❌ None |
| **SSH** | ✅ Auto-reconnect | 🐚 Via terminal | ✅ Native + multiplexing |
| **Split Panes** | ✅ Tile-based | ✅ Supported | ✅ Built-in multiplexer |
| **Open Source** | ✅ Apache 2.0 | ✅ GPL-3.0 | ✅ MIT |
| **Session Restore** | ✅ Durable | ✅ Per space | ✅ Via Zellij / Native |
| **Programmable** | `wsh` system | CLI + Socket API | Lua scripting |

---

## 🎯 Which One Should You Pick?

Picture this as a personality quiz:

- **You use a Mac, run multiple AI agents, and want visual notifications when one needs you.** → **cmux** is your soulmate.
- **You switch between macOS, Linux, and Windows, need durable SSH, and want an AI that reads your terminal.** → **Wave Terminal** has your back.
- **You live on Linux, want native GTK4 performance, and love the cmux-inspired workflow.** → **Limux** is the one.
- **You want maximum configurability with Lua, love composable tools, and want a terminal + Zellij + Yazi workflow.** → **WezTerm** is your jam.

Or, you know, try them all and decide. They're all free and open source.

---

## Conclusion

The terminal emulator is no longer just a box where text appears. cmux, Wave, Limux, and WezTerm are each reimagining what it can be — from agent-aware workspaces to AI co-pilots to GPU-accelerated multiplexing. And with Zellij and Yazi, even a traditional terminal can be supercharged into a modern powerhouse. Whether you're on macOS, Linux, or hopping between them, 2026 is a great year to upgrade your terminal.

Choose your fighter.
