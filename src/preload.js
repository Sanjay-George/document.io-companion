const { contextBridge, ipcRenderer } = require('electron')

// contextBridge.exposeInMainWorld('electronAPI', {
//     canGoBack: () => ipcRenderer.invoke('nav:canGoBack'),
//     canGoForward: () => ipcRenderer.invoke('nav:canGoForward'),
//     onNavigationUpdate: (callback) => ipcRenderer.on('nav:updated', callback),
// })