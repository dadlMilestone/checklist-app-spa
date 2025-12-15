export const createStaticPath = (filepath: string): string => {
    // Normalize the filepath - remove leading './'
    const normalizedPath = filepath.replace(/^\.\//, '');
    
    // In development (Vite dev server), return URL path
    // Vite serves static files from publicDir at the root
    if (import.meta.env?.DEV) {
        return `/${normalizedPath}`;
    }
    
    // In production (Electron), static files are in dist/renderer/
    // They're in the same directory as index.html, so use relative paths
    return normalizedPath;
}