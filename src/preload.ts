const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    onNavigationUpdate: (callback: () => void) => ipcRenderer.on('nav:updated', callback),

    fetch: (...args: any) => ipcRenderer.invoke('api:fetch', ...args),
})