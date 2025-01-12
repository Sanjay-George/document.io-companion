const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    onNavigationUpdate: (callback: () => void) => ipcRenderer.on('nav:updated', callback),

    submitAuth: (credentials: { username: string, password: string }) =>
        ipcRenderer.send('auth-submit', credentials),


    fetch: (...args: any) => ipcRenderer.invoke('api:fetch', ...args),
})