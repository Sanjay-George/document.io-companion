# Document.io - Companion App

This is a desktop application that works as a companion application to [document.io](https://github.com/Sanjay-George/document.io), enabling seamless website annotation. Built with Electron, it allows you to create and manage annotations on any website while maintaining security and performance.

![image](https://github.com/user-attachments/assets/9b11f99f-3778-4505-a3dd-4eaf8f385c3e)


## 🎯 Motivation

Many websites implement strict CSP rules that prevent loading external resources or scripts directly into their pages. This makes it difficult to integrate the annotation interface into the main application. By using this companion app, you can circumvent these restrictions and still annotate content directly on the pages they visit. 

## ✨ Key Features

- Element-level website annotations with Markdown support
- Local session management
- Cross-platform support (Windows & MacOS)
- Coming soon: Image, video, and voice note annotations

## 🚀 Quick Start

```bash
# Prerequisites: Node.js >= 20

# Clone and install
git clone https://github.com/Sanjay-George/document.io-companion.git
cd document.io-companion
npm install
cd ui && npm install && cd ..

# Make the application (for users)
npm run make

# Run the application (for development)
npm run start
```

## 🎶 Caveats and Notes
- Cookies are stored locally in JSON files to persist logins without compromising security.
- The [document.io central application](https://github.com/Sanjay-George/document.io) must be set up for the companion app to work.
- This app must be launched via deeplink from the central application, which configures the correct server address for communication.
- This is currently in beta - we're actively improving and adding features.



