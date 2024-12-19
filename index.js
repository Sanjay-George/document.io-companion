const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
// const fetch = require('node-fetch');
const fs = require('fs/promises');


const SERVER_URL = 'http://localhost:5000';
const SINGLE_DOCUMENTATION_URL = (id) => `${SERVER_URL}/documentations/${id}/`;

let mainWindow;

// Register the custom protocol
if (process.defaultApp) {
    if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient('document-io', process.execPath, [path.resolve(process.argv[1])])
    }
} else {
    app.setAsDefaultProtocolClient('document-io')
}

// Handling for Windows and Linux
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit()
} else {

    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
        }

        console.error('Welcome Back', `You arrived from: ${commandLine.pop().slice(0, -1)}`)
    })

    // // Create mainWindow, load the rest of the app, etc...
    // app.whenReady().then(async () => {
    //     await createWindow();


    // })

    // Specific handling for Mac OS
    app.on('open-url', (event, url) => {
        console.error('Welcome Back', `You arrived from: ${url}`)
    })
}

app.on('ready', async () => {
    await createWindow();

    app.on('activate', async () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            await createWindow();
        }
    });
});

async function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1366,
        height: 768,
        webPreferences: {
            preload: path.join(__dirname, 'src', 'preload.js'), // Secure communication with renderer
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    // TODO: make this configurable
    mainWindow.webContents.openDevTools();
    const documentationId = '67534ea8a1a84a18f6e3d9df';

    // Fetch documentation details and open the URL
    try {
        const documentation = await fetchDocumentation(documentationId);
        console.log(`Opening documentation: ${documentation.title} at ${documentation.url}`);

        // Load the target URL
        mainWindow.loadURL(documentation.url);

        // Handle DOMContentLoaded to inject assets
        mainWindow.webContents.on('dom-ready', () => {
            console.log('DOM loaded. Injecting assets...');
            injectEditorAssets(mainWindow, documentationId);
        });

    } catch (error) {
        console.error('Failed to fetch documentation:', error);
        app.quit();
    }
}

// Fetch documentation details from the server
async function fetchDocumentation(documentationId) {
    const response = await fetch(SINGLE_DOCUMENTATION_URL(documentationId));
    if (!response.ok) {
        throw new Error(`Failed to fetch documentation: ${response.statusText}`);
    }
    return response.json();
}

// Inject editor assets into the loaded page
async function injectEditorAssets(window, documentationId) {
    const assetsPath = path.join(__dirname, 'ui', 'dist', 'assets');

    try {
        // Read CSS and JS files
        const cssContent = await fs.readFile(path.join(assetsPath, 'index.css'), 'utf8');
        const jsContent = await fs.readFile(path.join(assetsPath, 'index.js'), 'utf8');

        // Inject a root element and set its data attributes
        await window.webContents.executeJavaScript(`
            (function() {
                const root = document.createElement('div');
                root.id = 'document-io-root';
                root.dataset.documentationId = '${documentationId}';
                document.body.appendChild(root);
            })();
        `);

        // Inject CSS
        await window.webContents.insertCSS(cssContent);

        // Inject JS
        await window.webContents.executeJavaScript(jsContent);
    } catch (error) {
        console.error('Error injecting editor assets:', error);
    }
}

// Clean up on app close
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
