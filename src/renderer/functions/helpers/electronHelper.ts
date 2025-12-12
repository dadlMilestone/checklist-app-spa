// Electron module helper for Vite compatibility
// Uses runtime require to avoid Vite trying to bundle electron modules

// Type definitions for electron modules we use
interface ElectronShell {
  openExternal(url: string): Promise<void>;
}

interface ElectronIpcRenderer {
  send(channel: string, ...args: any[]): void;
  on(channel: string, listener: (event: any, ...args: any[]) => void): void;
}

interface ElectronRemote {
  app: {
    getVersion(): string;
  };
  process: {
    resourcesPath: string;
  };
}

interface ElectronModules {
  shell: ElectronShell;
  ipcRenderer: ElectronIpcRenderer;
  remote: ElectronRemote;
}

// Cache the electron modules
let electronModules: ElectronModules | null = null;

/**
 * Get electron modules using runtime require
 * This avoids Vite trying to bundle electron at build time
 */
export const getElectron = (): ElectronModules | null => {
  if (electronModules) {
    return electronModules;
  }

  if (typeof window !== 'undefined' && typeof window.require === 'function') {
    try {
      const electron = window.require('electron');
      electronModules = {
        shell: electron.shell,
        ipcRenderer: electron.ipcRenderer,
        remote: electron.remote
      };
      return electronModules;
    } catch (e) {
      console.warn('Failed to load electron modules:', e);
      return null;
    }
  }
  return null;
};

/**
 * Get the shell module for opening external links
 */
export const getShell = (): ElectronShell | null => {
  return getElectron()?.shell || null;
};

/**
 * Get ipcRenderer for main process communication
 */
export const getIpcRenderer = (): ElectronIpcRenderer | null => {
  return getElectron()?.ipcRenderer || null;
};

/**
 * Get remote module for accessing main process objects
 */
export const getRemote = (): ElectronRemote | null => {
  return getElectron()?.remote || null;
};

/**
 * Get app version from remote
 */
export const getAppVersion = (): string => {
  try {
    return getRemote()?.app?.getVersion() || '1.0.0';
  } catch {
    return '1.0.0';
  }
};
