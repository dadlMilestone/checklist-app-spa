// Preload script for Electron
// Exposes a secure API to the renderer process via contextBridge
// This is required for modern Electron with contextIsolation: true

import { contextBridge, ipcRenderer, shell } from 'electron'

// Define the API that will be exposed to the renderer
const electronAPI = {
  // Get the application version
  getAppVersion: (): Promise<string> => ipcRenderer.invoke('get-app-version'),

  // Print to PDF - send filename, returns when done
  printToPdf: (filename: string): void => {
    ipcRenderer.send('print-to-pdf', filename)
  },

  // Listen for print completion
  onPrintDone: (callback: () => void): void => {
    ipcRenderer.on('print-done', () => callback())
  },

  // Export deployment data
  exportData: (data: string, filename: string): void => {
    ipcRenderer.send('export-data', data, filename)
  },

  // Listen for export completion  
  onExportDone: (callback: () => void): void => {
    ipcRenderer.on('export-done', () => callback())
  },

  // Open external URL in default browser
  openExternal: (url: string): Promise<void> => {
    return shell.openExternal(url)
  }
}

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', electronAPI)

// Type declaration for the exposed API (for TypeScript)
export type ElectronAPI = typeof electronAPI

console.log('Preload script loaded - electronAPI exposed')
