const fs = require('fs/promises');
const path = require('path');

export default class CookieManager {
    filePath: string;
    cookies: any;

    constructor(filePath: string) {
        this.filePath = filePath;
        this.cookies = {};
    }

    // Load cookies from file
    async loadCookies() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            this.cookies = JSON.parse(data);
        } catch (err) {
            if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
                console.log('No existing cookie file. Starting fresh.');
                this.cookies = {};
            } else {
                console.error('Error reading cookies file:', err);
            }
        }
    }

    // Save cookies to file
    async saveCookies() {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(this.cookies, null, 2), 'utf8');
            console.log('Cookies saved to file');
        } catch (err) {
            console.error('Error saving cookies file:', err);
        }
    }

    /**
     * Update cookies variable with new cookies
     * @param {Electron.Cookie[]} newCookies 
     */
    updateCookies(newCookies: Electron.Cookie[]) {
        newCookies.forEach(cookie => {
            const key = `${cookie.domain}|${cookie.name}`;
            this.cookies[key] = cookie;
        });
    }

    // Serialize cookies to restore them later
    getSerializedCookies(): Electron.Cookie[] {
        return Object.values(this.cookies);
    }
}

