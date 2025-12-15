// Electron API helper for accessing contextBridge-exposed APIs
// All Electron functionality is accessed via window.electronAPI

/**
 * Get the application version from the main process
 * Returns a promise that resolves to the version string
 */
export const getAppVersion = async (): Promise<string> => {
  try {
    if (window.electronAPI?.getAppVersion) {
      return await window.electronAPI.getAppVersion();
    }
    return '1.0.0';
  } catch {
    return '1.0.0';
  }
};

/**
 * Print to PDF - sends print request to main process
 */
export const printToPdf = (filename: string): void => {
  window.electronAPI?.printToPdf(filename);
};

/**
 * Register callback for print completion
 */
export const onPrintDone = (callback: () => void): void => {
  window.electronAPI?.onPrintDone(callback);
};

/**
 * Export deployment data to file
 */
export const exportData = (data: string, filename: string): void => {
  window.electronAPI?.exportData(data, filename);
};

/**
 * Register callback for export completion
 */
export const onExportDone = (callback: () => void): void => {
  window.electronAPI?.onExportDone(callback);
};

/**
 * Open external URL in default browser
 */
export const openExternal = (url: string): void => {
  window.electronAPI?.openExternal(url);
};
