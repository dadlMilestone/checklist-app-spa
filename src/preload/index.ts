// Preload script for Electron
// This runs in the renderer process but has access to Node.js APIs
// For Electron 12 with nodeIntegration: true, this is minimal
// Future Electron upgrades will require contextBridge here

import { contextBridge, ipcRenderer } from 'electron'

// For now, just expose ipcRenderer for IPC communication
// When we upgrade Electron and enable contextIsolation, 
// we'll use contextBridge.exposeInMainWorld here

console.log('Preload script loaded')
