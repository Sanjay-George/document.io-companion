const { BrowserWindow, app } = require("electron");
const pie = require("puppeteer-in-electron")
const puppeteer = require("puppeteer-core");


const SERVER_URL = 'http://localhost:5000';
const SINGLE_DOCUMENTATION_URL = (id) => `${SERVER_URL}/documentations/${id}/`;



const main = async () => {
    await pie.initialize(app);
    const browser = await pie.connect(app, puppeteer);
    const window = new BrowserWindow({
        width: 1080,
        height: 800,
    });
    window.webContents.openDevTools();

    // Load home page URL first
    const url = "https://example.com/";
    await window.loadURL(url);

    // Handover the browser to the puppeteer
    const page = await pie.getPage(browser, window);
    // console.log(page.url());
    // window.destroy();


    const documentationId = '66ed029c96ef6350fab3ce6d';
    page.on('domcontentloaded', async () => {
        console.log('DOM loaded. Injecting assets...');
        await injectEditorAssets(page, documentationId);
    });

    await setupEditor(page, documentationId);

};

main();


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
        // await page.addScriptTag({ path: './src/puppeteer/editor.js', type: 'module' });

    }
    catch (error) {
        console.error(error);
    }
}