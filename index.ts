// const { BrowserWindow, app } = require("electron");
// const pie = require("puppeteer-in-electron")
// const puppeteer = require("puppeteer-core");

import puppeteer, { Browser, Puppeteer } from 'puppeteer';

const SERVER_URL = 'http://localhost:5000';
const SINGLE_DOCUMENTATION_URL = (id: string) => `${SERVER_URL}/documentations/${id}/`;


// TODO: Switch to electron-puppeteer once POC ready.
// const main = async () => {
//     await pie.initialize(app);
//     const browser = await pie.connect(app, puppeteer);

//     const targetURL = "https://stackoverflow.com/";

//     // Electron window 
//     const window = new BrowserWindow();
//     await window.loadURL(targetURL);

//     // Puppeteer page
//     const page = await pie.getPage(browser, window);
//     console.log(page.url());

//     // Insert scripts and styles into the page

//     // window.destroy();
// };


(async () => {
    let browser: Browser | null = null;

    try {
        browser = await puppeteer.launch({
            headless: false,
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 768 });

        const documentationId = '66ed029c96ef6350fab3ce6d';

        // Inject assets on page reload or navigation
        page.on('domcontentloaded', async () => {
            console.log('DOM loaded. Injecting assets...');
            await injectEditorAssets(page, documentationId);
        });

        await setupEditor(page, documentationId);



        return;

        // Making API calls... 
        setTimeout(async () => {
            // Make API calls directly from the backend
            const response = await fetch('http://localhost:5000/pages/66e8060840dff95980791abd/annotations/');
            const data = await response.json();
            console.log(`Data from backend: ${JSON.stringify(data)}`);

            // Make API calls from the browser (use this method)
            try {
                await page.evaluate(async () => {
                    const response = await fetch('http://localhost:5000/pages/66e8060840dff95980791abd/annotations/');
                    const data = await response.json();
                    console.log(`Data from frontend: ${JSON.stringify(data)}`);
                });
            } catch (error) {
                console.error(error);
            }
        }, 5000);

    } catch (error) {
        console.error(error);
        browser?.close();
    }
})();


async function setupEditor(page, documentationId) {
    /*
        1. Get the documentation id from the URL
        2. Fetch documentation from server
        3. Open documentation.url with puppeteer
        4. Inject the editor into the page
        ----
        5. Inject other scripts (to handle higlighting, etc)
        6. Make further API calls within the page to display annotations
    */

    if (!documentationId) {
        throw new Error('Documentation Id not provided');
    }

    const documentation = await (await fetch(SINGLE_DOCUMENTATION_URL(documentationId))).json();
    console.log(JSON.stringify(documentation));

    if (!documentation) {
        throw new Error(`Documentation not found. documentationId: ${documentationId}`);
    }

    const { title, url } = documentation;
    console.log(`Opening documentation: ${title} at ${url}`);

    await page.goto(encodeURI(url));
    // await injectEditorAssets(page, documentationId);

    console.log(await page.title());

}


async function injectEditorAssets(page, documentationId) {
    try {
        await page.evaluate((documentationId) => {
            const root = document.createElement('div');
            root.id = 'document-io-root';
            root.dataset.documentationId = documentationId;
            document.body.appendChild(root);
        }, [documentationId]);

        await page.addScriptTag({ path: './ui/dist/assets/index.js' });
        await page.addStyleTag({ path: './ui/dist/assets/index.css' });
        await page.addStyleTag({ path: './styles/editor.css' });
        // await page.addScriptTag({ path: './src/puppeteer/editor.js', type: 'module' });

    }
    catch (error) {
        console.error(error);
    }
}