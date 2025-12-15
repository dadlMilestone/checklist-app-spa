// Global type declarations for Electron renderer

// Type definition for the electronAPI exposed via contextBridge
interface ElectronAPI {
  getAppVersion: () => Promise<string>;
  printToPdf: (filename: string) => void;
  onPrintDone: (callback: () => void) => void;
  exportData: (data: string, filename: string) => void;
  onExportDone: (callback: () => void) => void;
  openExternal: (url: string) => Promise<void>;
}

// Extend Window interface to include the electronAPI
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

// Re-export to make this a module
export {};
