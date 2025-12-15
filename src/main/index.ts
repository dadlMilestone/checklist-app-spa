'use strict'
import { app, BrowserWindow, ipcMain, shell, dialog, Menu } from 'electron'
import fs from 'fs'
import * as path from 'path'
import { format as formatUrl } from 'url'

// electron-vite: Use app.getAppPath() for static assets instead of __static
const isDevelopment = process.env.NODE_ENV !== 'production'

// Helper to resolve static asset paths
function getStaticPath(relativePath: string): string {
  if (isDevelopment) {
    // In dev, static folder is at project root
    return path.join(app.getAppPath(), 'static', relativePath)
  } else {
    // In production, resources are in the app.asar
    return path.join(process.resourcesPath, 'static', relativePath)
  }
}

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow;

//disable the toolbar
Menu.setApplicationMenu(null); 

function createMainWindow() {
  const window = new BrowserWindow({
    icon: getStaticPath('icons/win/favicon.ico'),
    minWidth: 800,
    minHeight: 600,
    title: 'Milestone Deployment Assistant',
    // Use standard frame for proper window controls and dragging
    frame: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false, // Required for preload script to access Node.js APIs
      preload: path.join(__dirname, '../preload/index.js')
    }
  });

  //prevent app title from updating
  window.on('page-title-updated', (evt): void => {
    evt.preventDefault();
  });

  //open devtools in development
  if (isDevelopment) {
    window.webContents.openDevTools({mode: 'detach'})
  }

  //load the app - electron-vite uses VITE_DEV_SERVER_URL in dev
  if (isDevelopment && process.env.VITE_DEV_SERVER_URL) {
    window.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    // In production, load from dist/renderer
    window.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  window.on('closed', () => {
    mainWindow = null
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}


// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow()
})

// IPC handler for getting app version (invoke/handle pattern)
ipcMain.handle('get-app-version', () => {
  return app.getVersion()
})

//print to PDF
ipcMain.on('print-to-pdf', (event: { sender: Electron.WebContents; }, filename: string) => {

  const win = BrowserWindow.fromWebContents(event.sender)
  let filepath:string = ""

  //open save dialog, pass in the filename and restrict filetype to PDF
  dialog.showSaveDialog({
    defaultPath: `${filename}.pdf`,
    filters: [{ name: 'PDF', extensions: ['pdf'] }]
  })
    .then(result => {
      filepath = result.filePath;
      return win.webContents.printToPDF({ pageSize: "Letter" })
    })
    .then(data => {
      fs.writeFile(filepath, data, err => {
        if (err) return console.log(err.message);
        shell.openExternal(`file://${filepath}`);
      });
    });
  event.sender.send('print-done');
});


ipcMain.on('export-data', (event: { sender: { send: (arg0: string) => void; }; }, data: string, filename: string) => {

  dialog.showSaveDialog({
    defaultPath: `${filename}.mddata`,
    filters: [{ name: 'Milestone Deployment Data', extensions: ['mddata'] }]
  })
  .then(result => {
      fs.writeFile(result.filePath, data, err => {
        if (err) return console.log(err.message);
      });
    })
    event.sender.send('export-done');
});
