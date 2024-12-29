const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs/promises');

const SERVER_URL = 'http://localhost:5000';
const SINGLE_DOCUMENTATION_URL = (id) => `${SERVER_URL}/documentations/${id}/`;

let mainWindow;
let documentationId;


// Register the custom protocol
if (process.defaultApp) {
    if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient('document-io', process.execPath, [path.resolve(process.argv[1])])
    }
} else {
    app.setAsDefaultProtocolClient('document-io')
}

// Handling deeplink for Windows and Linux (when app is already running)
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', async (event, argv, workingDirectory) => {
        // App already running, focus the window
        if (mainWindow) {
            if (mainWindow.isMinimized()) {
                mainWindow.restore()
            }
            mainWindow.focus()
        }
        const url = argv.pop();
        console.error('Welcome Back!', `You arrived from: ${url}`);

        documentationId = fetchDocId(url);
        console.log('Opening documentation:', documentationId);
        await openDocumentation(documentationId);
    })
}

// Handling deeplink for Windows and Linux (when app is closed)
const url = process.argv.pop();
console.log('Welcome!', `You arrived from: ${url}`);
documentationId = fetchDocId(url);

app.on('ready', async () => {
    await createWindow();

    // If app was opened from a deeplink, open the documentation
    if (documentationId) {
        console.log('Opening documentation:', documentationId);
        await openDocumentation(documentationId);
    }

    // Re-create window on app activation (macOS)
    // https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app#open-a-window-if-none-are-open-macos
    app.on('activate', async () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            await createWindow();
        }
    });
});


// Handling deeplink for macOS
app.on('open-url', async (event, url) => {
    console.log('Welcome Back!', `You arrived from: ${url}`);
    documentationId = fetchDocId(url);
    console.log('Opening documentation:', documentationId);
    await openDocumentation(documentationId);
});


function fetchDocId(url) {
    const regex = /document-io:\/\/documentations\/([a-f0-9]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

async function createWindow() {
    try {
        mainWindow = new BrowserWindow({
            width: 1366,
            height: 768,
            webPreferences: {
                preload: path.join(__dirname, 'src', 'preload.js'), // Secure communication with renderer
                contextIsolation: true,
                nodeIntegration: false,
            },
        });
        // TODO: build home page
        await mainWindow.loadURL('http://localhost:3000');

        // Handle API requests from the renderer
        // To prevent CSP `connect-src` issues.
        ipcMain.handle('api:fetch', async (event, url, options) => {
            try {
                const res = await fetch(url, options);  
                return res.json();  
            } catch (error) {
                console.error('Fetch error:', error);
                throw error;
            }
        });
     
        // // Enable navigation history
        // const { navigationHistory } = mainWindow.webContents;
        // ipcMain.handle('nav:canGoBack', () => navigationHistory.canGoBack())
        // ipcMain.handle('nav:canGoForward', () => navigationHistory.canGoForward())
    
        // mainWindow.webContents.on('did-navigate', () => {
        //     mainWindow.webContents.send('nav:updated');
        // });
        // mainWindow.webContents.on('did-navigate-in-page', () => {
        //     mainWindow.webContents.send('nav:updated');
        // });
    }
    catch (error) {
        console.error('Failed to create window:', error);
    }
}

async function openDocumentation(documentationId) {
    // Fetch documentation details and open the URL
    try {
        const documentation = await fetchDocumentation(documentationId);
        console.log(`Opening documentation: ${documentation.title} at ${documentation.url}`);

        // TODO: Remove
        // mainWindow.webContents.openDevTools();
        mainWindow.webContents.once('did-start-loading',  () => {
            console.log('Started loading');
        });
        mainWindow.webContents.once('dom-ready', () => {
            console.log('DOM ready');
        });
        mainWindow.webContents.once('did-finish-load', () => {
            console.log('Finsihed loading');
        });

        // Remove the previous event listener
        mainWindow.webContents.off('dom-ready', handleDOMReady);
        // Add event listener to handle DOM ready
        mainWindow.webContents.on('dom-ready', handleDOMReady);

        // Load the documentation URL
        await mainWindow.loadURL(documentation.url);

        // Clear the navigation history to prevent going back to previous documentation
        mainWindow.webContents.navigationHistory.clear();

    } catch (error) {
        console.error('Failed to fetch documentation:', error);
    }
}

async function handleDOMReady() {
    console.log('DOM loaded. Injecting assets...');
    await injectEditorAssets(mainWindow, documentationId);
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
    const assetsPath = path.join(__dirname, 'dist', 'assets');

    try {
        // Read CSS and JS files
        const cssContent = await fs.readFile(path.join(assetsPath, 'index.css'), 'utf8');
        const jsContent = await fs.readFile(path.join(assetsPath, 'index.js'), 'utf8');

        // Inject a root element and set its data attributes
        await window.webContents.executeJavaScript(`
            (function() {
                if(document.getElementById('document-io-root')) {
                    document.getElementById('document-io-root').dataset.documentationId 
                        = '${documentationId}';
                    return;
                }

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


// Clean up on app close (Windows and Linux)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

