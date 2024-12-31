const { app, BrowserWindow, ipcMain, session } = require("electron");
const path = require("path");
const fs = require("fs/promises");
const CookieManager = require("./src/cookies");

const COOKIE_FILE_PATH = path.join(app.getPath('userData'), 'cookies.json');
const cookieManager = new CookieManager(COOKIE_FILE_PATH);

const SERVER_URL = "http://localhost:5000";
const SINGLE_DOCUMENTATION_URL = (id) => `${SERVER_URL}/documentations/${id}/`;

let mainWindow;
let documentationId;

let allowQuit = false;
let allowClose = false;

// Register the custom protocol
if (process.defaultApp) {
    if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient("document-io", process.execPath, [
            path.resolve(process.argv[1]),
        ]);
    }
} else {
    app.setAsDefaultProtocolClient("document-io");
}

// Handling deeplink for Windows and Linux (when app is already running)
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
} else {
    app.on("second-instance", async (event, argv, workingDirectory) => {
        // App already running, focus the window
        if (mainWindow) {
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }
            mainWindow.focus();
        }
        const url = argv.pop();
        console.error("Welcome Back!", `You arrived from: ${url}`);

        documentationId = fetchDocId(url);
        console.log("Opening documentation:", documentationId);
        await openDocumentation(documentationId);
    });
}

// Handling deeplink for Windows and Linux (when app is closed)
const url = process.argv.pop();
console.log("Welcome!", `You arrived from: ${url}`);
documentationId = fetchDocId(url);

app.on("ready", async () => {
    console.group("app:ready");
    await createWindow();

    // If app was opened from a deeplink, open the documentation
    if (documentationId) {
        console.log("Opening documentation:", documentationId);
        await openDocumentation(documentationId);
    }

    // Re-create window on app activation (macOS)
    // https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app#open-a-window-if-none-are-open-macos
    app.on("activate", async () => {
        console.group("app:activate");
        if (BrowserWindow.getAllWindows().length === 0) {
            console.log("Re-creating window");
            await createWindow();
        }
        console.groupEnd();
    });
    console.groupEnd();
});

// Handling deeplink for macOS
app.on("open-url", async (event, url) => {
    console.group("app:open-url");

    console.log("Welcome Back!", `You arrived from: ${url}`);
    documentationId = fetchDocId(url);
    console.log("Opening documentation:", documentationId);
    await openDocumentation(documentationId);

    console.groupEnd();
});

function fetchDocId(url) {
    const regex = /document-io:\/\/documentations\/([a-f0-9]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

async function createWindow() {
    console.group("createWindow()");
    try {
        mainWindow = new BrowserWindow({
            // session: ses,   // Wrong to specify session here
            width: 1366,
            height: 768,
            webPreferences: {
                preload: path.join(__dirname, "src", "preload.js"), // Secure communication with renderer
                contextIsolation: true,
                nodeIntegration: false,
                session: session.fromPartition("persist:document-io")
            },
        });
        allowClose = false;

        // TODO: build home page
        await mainWindow.loadURL("http://localhost:3000");

        mainWindow.on("close", async (e) => {
            if (allowClose) return;

            console.group("mainWindow:close");
            e.preventDefault();

            const cookies = mainWindow.webContents.session.cookies;
            await flushCookiesToDisk(await cookies.get({}));

            allowClose = true;
            mainWindow.close();
            console.groupEnd();
        });

    } catch (error) {
        console.error("Failed to create window:", error);
    }
    console.groupEnd();
}

/**
 * Flushes cookies to disk
 * @param {Electron.Cookie[]} cookies
 */
async function flushCookiesToDisk(cookies) {
    cookieManager.updateCookies(cookies);
    await cookieManager.saveCookies();
    console.log("Cookies flushed to disk");
}
/**
 * Restores cookies from disk
 * @param {string} url - The URL to match cookies against
 * @param {Electron.Session} session - The session to set cookies on
 * @returns {Promise<void>}
 */
async function restoreCookiesFromDisk(url, session) {

    // Load cookies from your custom cookie manager
    await cookieManager.loadCookies();
    const cookies = cookieManager.getSerializedCookies();

    if (!cookies || cookies.length === 0) {
        console.log("No cookies to restore");
        return;
    }

    // Extract the domain from the input URL
    const urlDomain = new URL(url).hostname;

    for (const cookie of cookies) {
        try {
            // Check if the cookie's domain matches the domain of the given URL
            const cookieDomain = cookie.domain.startsWith(".")
                ? cookie.domain.substring(1)
                : cookie.domain;

            if (urlDomain.endsWith(cookieDomain)) {
                await session.cookies.set({ ...cookie, url });
                console.log(`Restored cookie for domain ${cookie.domain}:`);
            } else {
                console.log(`Skipping cookie for mismatched domain ${cookie.domain}`);
            }
        } catch (err) {
            console.error("Error restoring cookie:", cookie, err);
        }
    }

    console.log("Cookies restored from disk");
}


function registerIPCHandlers() {
    // Handle API requests from the renderer
    // To prevent CSP `connect-src` issues.
    ipcMain.removeHandler("api:fetch");
    ipcMain.handle("api:fetch", async (event, url, options) => {
        try {
            const res = await fetch(url, options);
            return res.json();
        } catch (error) {
            console.error("Fetch error:", error);
            throw error;
        }
    });
}

async function openDocumentation(documentationId) {
    // Fetch documentation details and open the URL
    console.group("openDocumentation()");
    try {
        const documentation = await fetchDocumentation(documentationId);
        console.log(`Opening ${documentation.title} at ${documentation.url}`);

        registerIPCHandlers();

        if (!mainWindow || mainWindow.isDestroyed()) {
            await createWindow();
        }
        // Remove the previous event listener
        mainWindow.webContents.off("dom-ready", handleDOMReady);
        // Add event listener to handle DOM ready
        mainWindow.webContents.on("dom-ready", handleDOMReady);

        await restoreCookiesFromDisk(documentation.url, mainWindow.webContents.session);

        // Load the documentation URL
        await mainWindow.loadURL(documentation.url);
        // Clear the navigation history to prevent going back to previous documentation
        mainWindow.webContents.navigationHistory.clear();


    } catch (error) {
        console.error("Failed to open documentation:", error);
    }
    console.groupEnd();
}

async function handleDOMReady() {
    console.log("DOM Ready. Injecting assets...");
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

/**
 * Injects the editor assets (CSS and JS) into the renderer process
 * @param {Electron.BrowserWindow} window 
 * @param {string} documentationId 
 */
async function injectEditorAssets(window, documentationId) {
    const assetsPath = path.join(__dirname, "dist", "assets");
    try {
        // Read CSS and JS files
        const cssContent = await fs.readFile(
            path.join(assetsPath, "index.css"),
            "utf8"
        );
        const jsContent = await fs.readFile(
            path.join(assetsPath, "index.js"),
            "utf8"
        );

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
        console.error("Error injecting editor assets:", error);
    }
}

// Clean up on app close (Windows and Linux)
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});






// // Clean up on app close (macOS)
// // TODO: check if this fixes cookie / session persistence issue
// // https://github.com/electron/electron/issues/8416
// // https://github.com/electron/electron/issues/6388
// app.on('before-quit', async (event) => {
//     if (allowQuit) return;

//     event.preventDefault();

//     console.group('app:before-quit');

//     const ses = session.fromPartition('persist:document-io');
//     await flushCookiesToDisk(await ses.cookies.get({}));

//     // // Flush storage data before quitting
//     // console.log('Flushing storage data');
//     // ses.flushStorageData();


//     setTimeout(() => {
//         allowQuit = true;
//         app.quit();
//     }, 1);

//     console.groupEnd();
// });