// Helper to safely get Node.js modules in Electron renderer
const getNodeModules = () => {
  if (typeof window !== 'undefined' && typeof window.require === 'function') {
    try {
      return {
        path: window.require('path'),
        electron: window.require('electron')
      };
    } catch {
      return null;
    }
  }
  return null;
};

export const createStaticPath = (filepath: string): string => {
    // In development (Vite dev server), return URL path
    if (import.meta.env?.DEV) {
        // Vite serves static from publicDir, strip leading ./
        return `/${filepath.replace(/^\.\//, '')}`;
    }
    
    // In production (Electron), use Node.js path resolution
    const modules = getNodeModules();
    if (modules) {
        const resourcesPath = modules.electron.remote?.process?.resourcesPath || process.resourcesPath;
        return modules.path.join(resourcesPath, 'static', filepath);
    }
    
    // Fallback
    return filepath;
}