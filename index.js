// const { BrowserWindow, app } = require("electron");
// const pie = require("puppeteer-in-electron")
// const puppeteer = require("puppeteer-core");

import puppeteer from 'puppeteer';


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

    try {
        console.log('Hello World');

        const browser = await puppeteer.launch({
            headless: false,
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 768 });
        await page.goto('https://stackoverflow.com/');


        // Inject the root element into the page
        await page.evaluate(() => {
            // Create root element
            const root = document.createElement('div');
            root.id = 'document-io-root';
            document.body.appendChild(root);
        });

        // Insert scripts and styles into the page from ./ui/dist/asssets/
        await page.addScriptTag({ path: './ui/dist/assets/index.js' });
        await page.addStyleTag({ path: './ui/dist/assets/index.css' });


        console.log(await page.title());
    } catch (error) {
        console.error(error);
    }
})();