const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
// const fetch = require('node-fetch');
const fs = require('fs/promises');


const SERVER_URL = 'http://localhost:5000';
const SINGLE_DOCUMENTATION_URL = (id) => `${SERVER_URL}/documentations/${id}/`;

let mainWindow;

app.on('ready', async () => {
    mainWindow = new BrowserWindow({
        width: 1366,
        height: 768,
        webPreferences: {
            preload: path.join(__dirname, 'src', 'preload.js'), // Secure communication with renderer
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    mainWindow.webContents.openDevTools();

    const documentationId = '66f1863d4345aac408b60fb9';

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
});

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
