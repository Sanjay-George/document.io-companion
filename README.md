# Document.io - Companion App

This is a desktop application that works as a companion application to [document.io](https://github.com/Sanjay-George/document.io), enabling seamless website annotation. Built with Electron, it allows you to create and manage annotations on any website while maintaining security and performance.

![screely-1736026495039](https://github.com/user-attachments/assets/ce662841-0d6c-4f37-a9a9-1f901253af69)

More functionalities are [showcased here...](https://github.com/Sanjay-George/document.io-companion/wiki/Showcase)


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
- This is currently in beta - features are constantly being improved and added!



