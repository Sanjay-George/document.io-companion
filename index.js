const { BrowserWindow, app } = require("electron");
const pie = require("puppeteer-in-electron")
const puppeteer = require("puppeteer-core");

const main = async () => {
    await pie.initialize(app);
    const browser = await pie.connect(app, puppeteer);

    const targetURL = "https://stackoverflow.com/";

    // Electron window 
    const window = new BrowserWindow();
    await window.loadURL(targetURL);

    // Puppeteer page
    const page = await pie.getPage(browser, window);
    console.log(page.url());

    // Insert scripts and styles into the page






    // window.destroy();
};

main();