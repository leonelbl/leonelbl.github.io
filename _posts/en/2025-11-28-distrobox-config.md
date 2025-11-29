---
layout: post
title: "Complete Distrobox Configuration Guide"
date: 2024-11-28
categories: [linux, config, distrobox]
tags: [config, linux, distrobox, containers, podman, docker]
lang: en
---

# Complete Distrobox Configuration Guide

Distrobox is a powerful tool that allows you to run any Linux distribution inside your terminal, using containers but with full access to your file system and hardware. This guide covers everything from basic container creation to advanced configurations.

## What is Distrobox?

Distrobox allows you to create and manage containers of different Linux distributions without the typical restrictions of traditional containers. You can run graphical applications, access your home directory, use USB devices, and even export applications to the host system.

## Prerequisites

Before starting, make sure you have installed:
- **Podman** or **Docker**
- **Distrobox** (installation: `curl -s https://raw.githubusercontent.com/89luca89/distrobox/main/install | sudo sh`)

---

## Container Creation

### Example 1: Basic Configuration

This is the simplest way to create a Distrobox container with a custom home directory.

**Features:**
- Default image name (generates one automatically)
- Custom home directory
- Ideal for quick tests or temporary environments

```bash
# Create CentOS Stream 9 container with custom home
distrobox create --pull --image centos:stream9 --home ~/distrobox/centos9
```

**Usage:**
```bash
# Enter the container
distrobox enter centos-stream-9
```

---

### Example 2: Custom Configuration

A step forward: assigning a specific name to the container makes it easier to manage and more identifiable.

**Features:**
- Custom container name
- Custom home directory
- Better organization for multiple environments

```bash
# Create Ubuntu 24.04 container with custom name and home
distrobox create --name development \
  --pull \
  --image ubuntu:24.04 \
  --home ~/distrobox/development
```

**Usage:**
```bash
# Enter using the custom name
distrobox enter development
```

**Advantages of using custom names:**
- Easy identification of the container's purpose
- Shorter and more memorable commands
- Better management when you have multiple containers

---

### Example 3: System Docker Access (Advanced Configuration)

This configuration is especially useful for development when you need to use Docker from inside your Distrobox container without installing Docker Engine inside the container.

**Features:**
- Custom name: `development`
- Custom home: `~/distrobox/development`
- Docker socket shared with the host system
- Allows running Docker commands from the container

```bash
distrobox create --name development \
  --pull \
  --image ubuntu:24.04 \
  --home ~/distrobox/development \
  --additional-flags "--volume /var/run/docker.sock:/var/run/docker.sock:rw"
```

**Post-creation configuration:**

After creating the container, you need to add your user to the docker group inside the container:

```bash
# Enter the container
distrobox enter development

# Install Docker CLI (not the daemon, just the client)
sudo apt update
sudo apt install docker.io -y

# Add your user to the docker group
sudo usermod -aG docker $USER

# Exit and re-enter to apply changes
exit
distrobox enter development

# Verify it works
docker ps
```

**Use cases:**
- Containerized application development
- Docker image testing
- Container orchestration from an isolated environment
- CI/CD in local environments

> **⚠️ Important:** Sharing the Docker socket is equivalent to giving root access to the system. Use this configuration only in trusted development environments.

---

## Custom Oh My Zsh Installation

Installing Oh My Zsh inside Distrobox requires a special approach to keep the configuration isolated from the host system. This guide allows you to have independent Zsh configurations on your main system and in each container.

### Why a custom installation?

The standard Oh My Zsh installation can cause conflicts when:
- You share the home directory with the host system
- You want different configurations in each container
- You need to maintain different versions of plugins or themes

### Step 1: Download the Installation Script

First, download the official Oh My Zsh installer to your home directory inside the container:

```bash
curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh -o install_omz.sh
```

### Step 2: Installation with Custom Variables

The key is to use environment variables to change the installation location:

```bash
ZSH=$HOME/.oh-my-zsh-distrobox CHSH=no RUNZSH=no sh install_omz.sh
```

**Variable explanation:**
- `ZSH=$HOME/.oh-my-zsh-distrobox`: Defines a custom directory for Oh My Zsh
- `CHSH=no`: Prevents automatically changing the default shell
- `RUNZSH=no`: Doesn't start Zsh immediately after installation

### Step 3: Configure Zsh

Edit (or create) the configuration file in your Distrobox:

**Path:** `/home/<your_user>/distrobox/development/.zshrc`

Add these lines:

```bash
export ZSH="$HOME/.oh-my-zsh-distrobox"
source $ZSH/oh-my-zsh.sh
```

> **Note:** With this configuration, your Zsh inside Distrobox:
> - Will load its **own** `.zshrc` (in `/distrobox/development/.zshrc`)
> - Will use its **own** Oh My Zsh installation (in `/distrobox/development/.oh-my-zsh-distrobox`)
> 
> This keeps the installation completely isolated from the parent system, regardless of whether they share the mounted `/home/<your_user>/` directory.

**Additional configuration (optional):**

You can add more customization to your `.zshrc`:

```bash
# Theme (you can change it)
ZSH_THEME="robbyrussell"

# Recommended plugins for development
plugins=(
  git
  docker
  ubuntu
  command-not-found
  colored-man-pages
)

# Your personal aliases and configurations
alias ll='ls -lah'
alias update='sudo apt update && sudo apt upgrade -y'
```

### Step 4: Apply Changes

```bash
# Reload configuration
source ~/.zshrc

# Or restart the shell
exec zsh
```

### Additional Plugins (Optional)

For a better experience, you can install these popular plugins:

```bash
# Autosuggestions
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-$HOME/.oh-my-zsh-distrobox/custom}/plugins/zsh-autosuggestions

# Syntax highlighting
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh-distrobox/custom}/plugins/zsh-syntax-highlighting
```

Then add them to the plugin list in your `.zshrc`:

```bash
plugins=(
  git
  docker
  ubuntu
  command-not-found
  colored-man-pages
  zsh-autosuggestions
  zsh-syntax-highlighting
)
```

---

## Useful Distrobox Commands

```bash
# List containers
distrobox list

# Remove a container
distrobox rm <container-name>

# Stop a container
distrobox stop <container-name>

# Export an application to the host system
distrobox-export --app <application-name>

# Execute a command without entering the container
distrobox enter <container-name> -- <command>

# Update Distrobox
curl -s https://raw.githubusercontent.com/89luca89/distrobox/main/install | sudo sh
```

---

## Tips and Best Practices

### Container Organization

Keep your containers organized with a clear structure:

```bash
~/distrobox/
├── development/     # Main development environment
├── testing/         # Testing and experimentation
├── centos9/         # CentOS for compatibility
└── archlinux/       # Rolling release for latest versions
```

### Descriptive Names

Use names that clearly indicate the purpose:
- `dev-python` - Python development
- `dev-nodejs` - Node.js development
- `test-ubuntu` - Ubuntu testing
- `prod-centos` - Production simulation

### Configuration Backups

Save your important configurations:

```bash
# Export container list
distrobox list > ~/distrobox-containers.txt

# Backup Zsh configurations
cp ~/distrobox/development/.zshrc ~/backups/zshrc-distrobox-backup
```

### System Resources

Distrobox containers are lightweight, but consider:
- Don't create more containers than necessary
- Stop containers you're not actively using
- Clean up old containers regularly

---

## Common Troubleshooting

### Docker socket doesn't work

```bash
# Check socket permissions
ls -l /var/run/docker.sock

# Ensure the user is in the docker group
groups | grep docker
```

### Oh My Zsh doesn't load correctly

```bash
# Verify the path is correct
echo $ZSH

# Verify the file exists
ls -la $ZSH/oh-my-zsh.sh

# Force reload
source ~/.zshrc
```

### Container won't start

```bash
# View logs
podman logs <container-id>

# Recreate the container
distrobox rm <name>
distrobox create [options]
```

---

## Additional Resources

- [Official Distrobox Documentation](https://distrobox.privatedns.org/)
- [GitHub Repository](https://github.com/89luca89/distrobox)
- [Oh My Zsh Documentation](https://github.com/ohmyzsh/ohmyzsh/wiki)

---

## Conclusion

Distrobox is an incredibly versatile tool that allows you to run multiple Linux distributions in parallel without the complexity of traditional virtual machines. With the configurations presented in this guide, you can create isolated, secure, and highly customizable development environments.

Whether you need to test software on different distributions, maintain separate development environments, or simply experiment with new tools without compromising your main system, Distrobox offers an elegant and efficient solution.