// Global type declarations for Electron renderer with nodeIntegration

// Extend Window interface to include require (available in Electron with nodeIntegration)
declare global {
  interface Window {
    require: NodeRequire;
  }
}

// Re-export to make this a module
export {};
