# Document.io — Companion Extension

The companion browser extension for [document.io](https://github.com/Sanjay-George/document.io). Install it in Chrome or Edge to annotate any website and view your documentation directly on the pages you care about.

![screely-1736026495039](https://github.com/user-attachments/assets/ce662841-0d6c-4f37-a9a9-1f901253af69)

More functionalities are [showcased here...](https://github.com/Sanjay-George/document.io-companion/wiki/Showcase)

## 🚀 Quick Start

### Prerequisites
- **Node.js** v20 or higher — [Download](https://nodejs.org/)
- A running instance of [document.io](https://github.com/Sanjay-George/document.io) (self-hosted or [the live demo](https://www.document-io.tech/))
- Chrome or Edge (latest or previous major version)

---

### For users

#### 1. Clone the repo

```bash
git clone https://github.com/Sanjay-George/document.io-companion.git
cd document.io-companion
```

#### 2. Install and build

```bash
npm install
npm run build-ext
```

This builds the React UI and copies the output into `extensions/dist/`.

#### 3. Load the extension in your browser

**Chrome:** open `chrome://extensions` → enable **Developer mode** → click **Load unpacked** → select the `extensions/` folder.

**Edge:** open `edge://extensions` → enable **Developer mode** → click **Load unpacked** → select the `extensions/` folder.

#### 4. Configure the server URL

Click the extension icon in your toolbar and enter your document.io server URL (e.g. `http://localhost:5001` for a local instance). Click **Save**.

#### 5. Open a documentation

From your document.io workspace, open any documentation link. The URL will contain a `?documentation-id=` parameter — the extension detects this automatically and activates the annotation panel on the page.

---

### For devs

```bash
# Install root deps
npm install

# Install UI deps and start the Vite dev server
cd ui && npm install && npm run dev
```

The UI dev server runs on `http://localhost:5173`. To test the full extension flow, build with `npm run build-ext` from the root and load unpacked as above.

[More on UI development →](https://github.com/Sanjay-George/document.io-companion/blob/master/ui/README.md)

---

## 🎶 Important Notes

- The extension uses your existing browser session to authenticate with document.io. If you see a "not signed in" message in the panel, log in to your document.io instance in the same browser first.
- The [document.io central application](https://github.com/Sanjay-George/document.io) must be running and reachable at the URL you configured in the extension settings.
- This is currently in BETA — features are being actively improved.

## 🎯 Motivation

Many websites enforce strict CSP rules that block external scripts from loading directly. The extension sidesteps this by running in its own isolated context, injecting the annotation panel into any page without conflicting with the host site's security policy.

## ✨ Key Features

- Right-click any element to annotate it — no mode switching required
- Markdown editor with live preview
- Page and component annotation types
- Drag-to-reorder annotations (saves automatically)
- SPA-aware: panel refreshes on client-side navigation
- Works on Chrome and Edge (latest and previous major version)

