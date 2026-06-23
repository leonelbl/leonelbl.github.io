---
title: "Holehe: Discover Which Accounts Are Linked to an Email Address"
date: 2026-06-23
categories: ["tools", "security"]
tags: ["osint", "security", "privacy", "python", "tools"]
lang: en
translation_key: holehe-email-footprint
description: "Learn how Holehe, an OSINT tool, lets you audit the digital footprint of an email address across 120+ platforms — silently and without alerting the target."
---

# Holehe: Discover Which Accounts Are Linked to an Email Address

Your email is the skeleton key of your digital identity. Almost every account you've ever created — Spotify, GitHub, Instagram, Discord — is tied to it. But how many of those accounts are *actually* out there? **Holehe** is an OSINT tool that answers exactly that question.

---

## 🔍 Part 1: The Basics (Level: Beginner)

### What is OSINT?

**OSINT** stands for *Open Source Intelligence* — the practice of gathering information from publicly available sources. It's widely used in cybersecurity, digital forensics, and journalism. The key rule: no hacking, no unauthorized access. Only information the systems expose by design.

### What does Holehe do?

Holehe takes an email address and checks whether it has a registered account on over 120 platforms (Twitter/X, Instagram, Snapchat, GitHub, Adobe, Discord, and many more). It works by exploiting the **password recovery flow** — the same "Forgot my password?" button you use every day.

When you enter an email into that form, most sites will respond differently depending on whether the account exists:

- *"We sent you a reset link"* → account exists ✅
- *"We couldn't find that email"* → account does not exist ❌

Holehe automates this check across dozens of services simultaneously, and **the target email never receives a notification**.

### Why should you care?

- **Audit your own footprint:** Find forgotten accounts you created years ago — old forums, abandoned services, data breach targets.
- **Privacy hygiene:** Know your attack surface before someone else does.
- **Security research & investigations:** Used by penetration testers, journalists, and incident responders.

> ⚠️ **Important:** Holehe is built for educational and authorized use only. Using it against someone else's email without permission may be illegal depending on your jurisdiction. Always use it responsibly.

---

## ⚙️ Part 2: Under the Hood (Level: Technical)

### How the detection works

Holehe uses Python's `httpx` async HTTP client together with `trio` for concurrency, which allows it to query dozens of services in parallel without blocking. For each module (one per platform), it sends a crafted request to the password recovery or registration endpoint and inspects the response — HTTP status codes, response body content, or redirect behavior — to infer account existence.

The output per module follows a consistent structure:

```json
{
  "name": "github",
  "rateLimit": false,
  "exists": true,
  "emailrecovery": "le****@gmail.com",
  "phoneNumber": null,
  "others": null
}
```

- `exists` — whether an account was found.
- `emailrecovery` — a partially masked recovery email, when the service leaks it.
- `phoneNumber` — a partially masked phone number, when available.
- `rateLimit` — whether the module hit a rate limit during the scan.

This passive fingerprinting technique is powerful precisely because it abuses features the platforms intentionally expose to users.

---

## 🛠️ Installation

### ⚠️ A note for Linux users: always use a virtual environment

On Linux, Python is not just a developer tool — it's part of the OS itself. Package managers, system utilities, and many desktop components depend on specific Python versions and libraries. Running `pip install` globally can silently upgrade or conflict with those system packages, potentially breaking things in subtle ways.

The safe habit is to isolate every Python project in its own **virtual environment**. It takes two extra commands and protects your entire system:

```bash
# Create a virtual environment (once)
python3 -m venv ~/.venvs/holehe

# Activate it (every session)
source ~/.venvs/holehe/bin/activate

# Now install safely — nothing touches your system Python
pip install holehe

# When you're done
deactivate
```

After activation your prompt will show `(holehe)` as a prefix, confirming you're inside the isolated environment. The `holehe` command will be available for as long as that session is active.

> 💡 If you use **pyenv** or **pipx**, those are also solid alternatives. `pipx` in particular is designed exactly for this use case — installing Python CLI tools in isolated environments automatically:
> ```bash
> pipx install holehe
> ```

---

### Via PyPI

```bash
pip install holehe
```

### Via GitHub

```bash
git clone https://github.com/megadose/holehe.git
cd holehe/
python3 setup.py install
```

### Via Docker

No Python setup needed — Docker handles everything in its own isolated container:

```bash
docker build . -t holehe-image
docker run holehe-image holehe your@email.com
```

---

## 🚀 Quick Usage

### CLI — scan an email

```bash
holehe your@email.com
```

That's it. Holehe will iterate through all available modules and print which services returned a positive match, along with any additional data recovered (partial recovery emails, phone numbers).

### Python integration

You can embed individual modules into your own scripts:

```python
import trio
import httpx
from holehe.modules.social_media.snapchat import snapchat

async def main():
    email = "target@example.com"
    out = []
    client = httpx.AsyncClient()

    await snapchat(email, client, out)
    print(out)

    await client.aclose()

trio.run(main)
```

This makes it easy to build custom OSINT pipelines or integrate Holehe into larger automation workflows.

---

## 📋 Highlighted Modules

Holehe covers 120+ platforms. A few notable ones:

| Platform     | Method            | Rate Limit |
| ------------ | ----------------- | ---------- |
| GitHub       | Register check    | ✘          |
| Instagram    | Register check    | ✔          |
| Snapchat     | Login check       | ✘          |
| Discord      | Register check    | ✘          |
| Adobe        | Password recovery | ✘          |
| Twitter / X  | Register check    | ✘          |
| Spotify      | Register check    | ✔          |
| Google       | Register check    | ✔          |
| Gravatar     | Other             | ✘          |
| ProtonMail   | Other             | ✘          |

Services marked with ✔ under *Rate Limit* tend to block rapid repeated requests — if you hit one, rotating your IP is the standard workaround.

---

## 🧩 Maltego Integration

If you use **Maltego** for graphical OSINT investigations, there's an official transform available: [holehe-maltego](https://github.com/megadose/holehe-maltego). It lets you map discovered accounts as nodes in a visual graph, which is particularly useful for linking multiple identities or building an investigation timeline.

---

## 🛡️ Defensive Takeaways

Understanding how a tool like Holehe works is the first step to protecting yourself against it:

- **Delete accounts you no longer use.** Every dormant account is a potential breach vector.
- **Use email aliases.** Services like SimpleLogin or DuckDuckGo Email Protection let you create per-service aliases, breaking the link between your real address and your accounts.
- **Enable 2FA everywhere.** Even if someone discovers your accounts exist, they can't get in without the second factor. (Check my [Bitwarden post](/en/posts/password-manager) for 2FA app recommendations.)
- **Monitor breaches.** Use [Have I Been Pwned](https://haveibeenpwned.com) to get notified when your email appears in a data leak.

---

## Conclusion

Holehe is a sharp, focused tool that reveals just how much information leaks through a single email address. Whether you're auditing your own digital footprint, conducting authorized security research, or simply curious about your attack surface, it's an excellent addition to your OSINT toolkit.

The fact that it operates silently — without alerting the target — is what makes it particularly relevant to understand, both as a practitioner and as someone who wants to protect their own privacy.

More information and source code at [github.com/megadose/holehe](https://github.com/megadose/holehe).