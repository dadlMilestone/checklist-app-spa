# Copilot Instructions for Checklist App SPA

## ⚠️ CRITICAL: Current Project Status (December 2025)

### Background

This application had not been touched for 4 years and we successfully modernized it to release a new version. The codebase has been fully updated with modern Electron security practices.

### Current State: FULLY MODERNIZED ✅

**What Works:**

- ✅ `npm run build` - electron-vite builds all three processes (main, preload, renderer)
- ✅ `npm run dev` - Vite dev server starts with HMR
- ✅ `npm run preview` - Production preview mode works
- ✅ `npm run dist` - Creates Windows NSIS installer
- ✅ Application window launches and displays content
- ✅ Main menu renders, navigation works
- ✅ IndexedDB initializes correctly (version 5)
- ✅ UI is interactive (clicking, navigation all work)
- ✅ Static assets load correctly in dev and production modes
- ✅ Help content (`info_content/*.html`) loads properly
- ✅ PDF export works
- ✅ Data export/import works
- ✅ **0 vulnerabilities** (production and dev)

**Security:**

- ✅ Modern Electron 39.x with all security patches
- ✅ `contextIsolation: true` - Renderer is isolated from Node.js
- ✅ `nodeIntegration: false` - No direct Node.js access in renderer
- ✅ Secure IPC via `contextBridge` - All main↔renderer communication is explicit
- ✅ No deprecated `remote` module usage

## Application Overview

**Application Name:** Milestone Deployment Assistant 2020 R3  
**Type:** Electron Desktop Application  
**Purpose:** A deployment checklist application for Milestone Systems VMS installations  
**Repository:** https://github.com/sjhammond/checklist-app-spa

## Architecture

### Technology Stack

| Component    | Technology       | Version |
| ------------ | ---------------- | ------- |
| Framework    | Electron         | 39.2.7  |
| Build System | electron-vite    | 5.0.0   |
| Bundler      | Vite             | 7.2.7   |
| Language     | TypeScript       | 5.x     |
| UI Library   | jQuery           | 3.7.1   |
| Database     | IndexedDB (idb)  | 8.x     |
| Installer    | electron-builder | 26.0.12 |

### Project Structure

```
checklist-app-spa/
├── src/
│   ├── main/              # Electron main process
│   │   └── index.ts       # Main process entry, IPC handlers, window creation
│   ├── preload/           # Preload scripts (contextBridge)
│   │   └── index.ts       # Exposes electronAPI to renderer
│   ├── renderer/          # Electron renderer process (UI)
│   │   ├── index.ts       # Renderer entry point
│   │   ├── index.html     # HTML entry point
│   │   ├── css/           # Stylesheets
│   │   ├── data/          # Data initialization (db, phases, steps, tasks)
│   │   ├── models/        # TypeScript interfaces/types
│   │   ├── types/         # Global type declarations
│   │   │   └── global.d.ts  # ElectronAPI type definitions
│   │   └── functions/     # Business logic
│   │       ├── helpers/
│   │       │   ├── electronHelper.ts  # Wrapper for window.electronAPI
│   │       │   ├── createStaticPath.ts
│   │       │   └── ...
│   │       └── *.ts       # Builders and event handlers
├── static/               # Static assets (copied to dist)
│   ├── icons/            # Application icons
│   ├── images/           # UI images
│   ├── info_content/     # Help/info HTML content
│   └── licenses/         # License files
├── build/                # electron-builder resources
├── docs/                 # Documentation
├── electron.vite.config.ts  # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

### Security Architecture (Modern Electron)

```
┌─────────────────────────────────────────────────────────────┐
│                     MAIN PROCESS                             │
│  - Full Node.js access                                       │
│  - File system, dialogs, app lifecycle                       │
│  - IPC handlers (ipcMain.handle, ipcMain.on)                │
└─────────────────────┬───────────────────────────────────────┘
                      │ IPC (secure channel)
┌─────────────────────▼───────────────────────────────────────┐
│                   PRELOAD SCRIPT                             │
│  - contextBridge.exposeInMainWorld('electronAPI', {...})    │
│  - Selective API exposure only                               │
└─────────────────────┬───────────────────────────────────────┘
                      │ window.electronAPI
┌─────────────────────▼───────────────────────────────────────┐
│                  RENDERER PROCESS                            │
│  - NO Node.js access (contextIsolation: true)               │
│  - Uses window.electronAPI for main process features         │
│  - Standard web environment (DOM, fetch, etc.)              │
└─────────────────────────────────────────────────────────────┘
```

**Exposed API (src/preload/index.ts):**
```typescript
window.electronAPI = {
  getAppVersion: () => Promise<string>,    // Get app version
  printToPdf: (filename) => void,          // Trigger PDF export
  onPrintDone: (callback) => void,         // PDF complete callback
  exportData: (data, filename) => void,    // Export deployment data
  onExportDone: (callback) => void,        // Export complete callback
  openExternal: (url) => Promise<void>     // Open URL in browser
}
```

### IPC Communication

**Main Process Handlers (src/main/index.ts):**
- `ipcMain.handle('get-app-version')` - Returns app version
- `ipcMain.on('print-to-pdf')` - Handles PDF generation
- `ipcMain.on('export-data')` - Handles data file export

**Renderer Usage (via electronHelper.ts):**
```typescript
import { getAppVersion, printToPdf, openExternal } from './helpers/electronHelper';

// Get version (async)
const version = await getAppVersion();

// Print to PDF
printToPdf('My Deployment');

// Open external link
openExternal('https://example.com');
```

## Build & Development

### Prerequisites
- Node.js 20+ (tested on 24.11.1)
- npm 10+

### Commands

```bash
# Install dependencies
npm install

# Development (with HMR)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Create installer
npm run dist
```

### Build Output

```
dist/
├── main/           # Main process bundle
│   └── index.js
├── preload/        # Preload script bundle
│   └── index.js
└── renderer/       # Renderer bundle + assets
    ├── index.html
    └── assets/

release/            # Installer output (npm run dist)
└── *.exe
```

## Key Dependencies

### Runtime Dependencies
| Package | Version | Purpose                          |
| ------- | ------- | -------------------------------- |
| jquery  | ^3.7.1  | DOM manipulation, event handling |
| idb     | ^8.0.0  | Promise-based IndexedDB wrapper  |
| js-yaml | ^4.1.0  | YAML parsing for import/export   |

### Dev Dependencies
| Package          | Version  | Purpose                       |
| ---------------- | -------- | ----------------------------- |
| electron         | ^39.2.7  | Desktop app framework         |
| electron-builder | ^26.0.12 | App packager/installer        |
| electron-vite    | ^5.0.0   | Vite integration for Electron |
| vite             | ^7.2.7   | Build tool and dev server     |
| typescript       | ^5.0.0   | TypeScript compiler           |

## Application Features

### Core Features
1. **Deployment Management** - Create, edit, delete deployment checklists
2. **PDF Export** - Print checklists to PDF via system dialog
3. **Data Export/Import** - Save/load deployment data (.mddata files)
4. **Checklist System** - Organized by Phases → Steps → Tasks
5. **Help System** - Context-sensitive help content
6. **Data Persistence** - IndexedDB for local storage

### IndexedDB Schema (Version 5)
```typescript
interface MilestoneDB extends DBSchema {
  deployments: {
    key: number;
    value: Deployment;
    indexes: { dateModified: Date };
  };
  'deployment-items': {
    key: number;
    value: DeploymentItem;
    indexes: { stepId: number };
  };
}
```

## Migration History

### December 2025: Full Modernization

**Build System Migration (electron-webpack → electron-vite):**
- Removed abandoned electron-webpack (last updated 2020)
- Migrated to electron-vite with Vite 7.x
- Simplified configuration, faster builds, HMR support

**Electron Upgrade (12.0.0 → 39.2.7):**
- Upgraded from EOL Electron 12 (9+ high severity CVEs) to latest
- Implemented modern security model:
  - `contextIsolation: true`
  - `nodeIntegration: false`
  - `contextBridge` for secure IPC
- Replaced deprecated `remote` module with explicit IPC
- Upgraded electron-builder 22 → 26

**Security Result:**
- Before: 38+ vulnerabilities (including 9 high severity)
- After: **0 vulnerabilities**

## Troubleshooting

### Common Issues

**App shows blank window:**
- Check DevTools console for errors
- Verify preload script is loading (`console.log` in preload)
- Check that `window.electronAPI` is defined in renderer

**Static assets not loading:**
- In dev: assets served from `static/` via Vite
- In production: assets in `dist/renderer/` 
- Check `createStaticPath.ts` for path resolution

**IPC not working:**
- Verify handler exists in main process
- Check channel names match exactly
- Ensure preload exposes the method

### DevTools Warnings (Safe to Ignore)
```
Request Autofill.enable failed
Request Autofill.setAddresses failed
```
These are harmless DevTools warnings about autofill features not available in Electron.

## Future Improvements

### 🟡 Medium Priority (Code Quality)
| Task                             | Description                 |
| -------------------------------- | --------------------------- |
| Add ESLint + Prettier            | No linting configured       |
| Add unit tests                   | No test framework currently |
| Move CSS deps to devDependencies | cssnano, postcss-svgo, svgo |

### 🟢 Low Priority (Nice to Have)
| Task                  | Description                  |
| --------------------- | ---------------------------- |
| Add GitHub Actions CI | Automate build/test on PRs   |
| Add Dependabot        | Automated dependency updates |
| macOS/Linux builds    | Currently Windows-only       |

## Session History

| Date       | Summary                                                             |
| ---------- | ------------------------------------------------------------------- |
| 2025-12-12 | Migrated electron-webpack → electron-vite                           |
| 2025-12-15 | Fixed static asset paths (PR #3)                                    |
| 2025-12-15 | Upgraded Electron 12 → 39, implemented contextBridge security model |

---

**Last Updated:** December 15, 2025  
**Node.js Version Tested:** 24.11.1  
**Build Status:** ✅ Fully functional - 0 vulnerabilities
