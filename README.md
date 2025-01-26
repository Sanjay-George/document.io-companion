# Document.io - Companion App

This is a desktop application that works as a companion application to [document.io](https://github.com/Sanjay-George/document.io), enabling seamless website annotation. Built with Electron, it allows you to create and manage annotations on any website while maintaining security and performance.

![screely-1736026495039](https://github.com/user-attachments/assets/ce662841-0d6c-4f37-a9a9-1f901253af69)

More functionalities are [showcased here...](https://github.com/Sanjay-George/document.io-companion/wiki/Showcase)

## 🚀 Quick Start

#### Prerequisites
- **Node.js** (v20 or higher preferred): [Download Node.js](https://nodejs.org/)

### For users

Get started in 4 simple steps:

#### 1. Download or clone the repo

```bash
git clone https://github.com/Sanjay-George/document.io-companion.git
```

If you don't have git on your machine, just download this repo by clicking the **Code** -> **Download ZIP** and unzip it.


#### 2. Install dependencies
In the application root folder, run the following:

```
npm install
cd ui && npm install && cd ..
```

#### 3. Build the application

```bash
npm run make
```

The built application can be accessed in `out/make/` folder. Install the application.

#### 4. Open a documentation for the main application
From your hosted version of [document.io](https://github.com/Sanjay-George/document.io) (or from https://www.document-io.tech/), click on a documentation link to open it in the companion app.


### For devs
Follow similar steps as users, but run `npm run start` or `npm run package` to start the application. 

Note: On macOS and Linux, deeplinking works [only if the app is packaged.](https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app#packaging).

<!-- 1. For now, the application needs to be built locally and used, since code-signing and notarizing is not in place. To build the application, run the following command in the root folder: -->

## 🎯 Motivation

Many websites implement strict CSP rules that prevent loading external resources or scripts directly into their pages. This makes it difficult to integrate the annotation interface into the [main application](https://github.com/Sanjay-George/document.io). By using this companion app, you can circumvent these restrictions and still annotate content directly on the pages they visit. 

## ✨ Key Features

- Element-level website annotations with Markdown support
- Local session management
- Cross-platform support (Windows & MacOS)
- Coming soon: Image, video, and voice note annotations







## 🎶 Important Notes
- Cookies are stored locally in JSON files to persist logins without compromising security. (This is a temporary workaround for an issue where cookies are not persisted on macOS).
- The [document.io central application](https://github.com/Sanjay-George/document.io) must be set up for the companion app to work.
- This app must be launched via deeplink from the central application, which configures the correct server address for communication.
- This is currently in beta - features are constantly being improved and added!



