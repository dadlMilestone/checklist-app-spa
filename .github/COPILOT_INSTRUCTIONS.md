# Copilot Instructions for Checklist App SPA

## ⚠️ CRITICAL: Current Project Status (December 2025)

### Background

This application has not been touched for 4 years and we are attempting to modernize it to release a new version with updated content. The alternative would be building a new application from scratch, but reusing this existing codebase is preferred if feasible.

### Current State: BUILD SYSTEM MIGRATION COMPLETE ✅

**What Works:**

- ✅ `npm run build` - electron-vite builds all three processes (main, preload, renderer)
- ✅ `npm run dev` - Vite dev server starts with HMR
- ✅ `npm run preview` - Production preview mode works
- ✅ Application window launches and displays content
- ✅ Main menu renders, navigation works
- ✅ IndexedDB initializes correctly (version 5)
- ✅ UI is interactive (clicking, navigation all work)
- ✅ Static assets load correctly in dev and production modes
- ✅ Help content (`info_content/*.html`) loads properly
- ✅ 0 production vulnerabilities

**Build System:**

- ✅ Migrated from electron-webpack → electron-vite
- ✅ Removed electron-webpack, electron-webpack-ts, ts-loader, webpack dependencies
- ✅ Static asset path resolution fixed (PR #3 merged December 15, 2025)
- ✅ Error handling added to HTML include functionality

## Application Overview

**Application Name:** Milestone Deployment Assistant 2020 R3  
**Type:** Electron Desktop Application  
**Purpose:** A deployment checklist application for Milestone Systems VMS installations  
**Repository:** https://github.com/dadlMilestone/checklist-app-spa

## Architecture

### Technology Stack

- **Framework:** Electron 12.0.0 (desktop application framework)
- **Build System:** electron-vite 5.0.0 (Vite-based build system for Electron)
- **Language:** TypeScript 5.9.3
- **UI Library:** jQuery 3.7.1 (for DOM manipulation)
- **Database:** IndexedDB via idb 8.0.3 (client-side storage)
- **Styling:** CSS with PostCSS processing (cssnano, postcss-svgo, svgo)
- **Data Format:** YAML (js-yaml 4.1.1) for configuration/import data

### Project Structure

```
checklist-app-spa/
├── src/
│   ├── main/              # Electron main process
│   │   └── index.ts       # Main process entry point
│   ├── renderer/          # Electron renderer process (UI)
│   │   ├── index.ts       # Renderer entry point
│   │   ├── css/           # Stylesheets
│   │   ├── data/          # Data initialization
│   │   │   ├── db.ts      # IndexedDB initialization
│   │   │   ├── phases.ts  # Phase definitions
│   │   │   ├── steps.ts   # Step definitions
│   │   │   └── tasks.ts   # Task definitions
│   │   ├── models/        # TypeScript interfaces/types
│   │   │   ├── milestone-db.ts     # DB schema
│   │   │   ├── deployment.ts       # Deployment model
│   │   │   ├── deployment-item.ts  # Checklist item model
│   │   │   ├── deployment-import.ts
│   │   │   ├── phase.ts
│   │   │   ├── step.ts
│   │   │   ├── task.ts
│   │   │   ├── product-tier.ts
│   │   │   └── item-state.ts
│   │   └── functions/     # Business logic
│   │       ├── menuBuilder.ts
│   │       ├── checklistBuilder.ts
│   │       ├── deploymentListBuilder.ts
│   │       ├── modalBuilder.ts
│   │       ├── importDeploymentBuilder.ts
│   │       ├── newDeploymentBuilder.ts
│   │       ├── printViewBuilder.ts
│   │       ├── helpBuilder.ts
│   │       ├── *Events.ts # Event handlers
│   │       └── helpers/   # Utility functions
│   │           ├── dbFunctions.ts
│   │           ├── createStaticPath.ts
│   │           ├── encryptDecryptData.ts
│   │           ├── includeHtml.ts
│   │           ├── openLinksExternally.ts
│   │           ├── scrollToTop.ts
│   │           ├── toggleInfo.ts
│   │           └── dateOptions.ts
├── static/               # Static assets
│   ├── icons/            # Application icons
│   ├── images/           # UI images
│   ├── info_content/     # Help/info content
│   └── licenses/         # License files
├── build/                # Build resources
│   ├── icon.ico          # Windows icon
│   └── icon.icns         # macOS icon
├── docs/                 # Documentation
│   └── migration-plan-electron-vite.md
├── electron.vite.config.ts  # electron-vite configuration
├── tsconfig.json         # TypeScript configuration
├── package.json          # Dependencies and scripts
└── package-lock.json     # Dependency lock file
```

### Application Architecture

**Main Process (src/main/index.ts):**
- Creates the main BrowserWindow
- Manages application lifecycle
- Handles IPC communication for:
  - PDF export (`print-to-pdf` event)
  - Data export (`export-data` event)
- Provides file system access for saving/exporting data
- Configures window properties (hidden title bar, min size 800x600)

**Renderer Process (src/renderer/):**
- Single-page application with multiple views
- Uses jQuery for DOM manipulation and event handling
- IndexedDB for local data persistence (deployments, deployment-items)
- Builder pattern for constructing different views (menu, checklist, modals, etc.)
- Event handlers for user interactions
- Static content loaded from `static/` directory

**Data Layer:**
- **IndexedDB Database:** `appDB` (version 5)
- **Object Stores:**
  - `deployments` - Deployment configurations
  - `deployment-items` - Individual checklist items
- **idb library** - Promise-based wrapper for IndexedDB
- Phases, Steps, Tasks initialized from data modules

### Build Process

**Development:**

```bash
npm run dev      # Start Vite dev server with HMR
```

**Production Build:**

```bash
npm run build    # Build all processes (main, preload, renderer)
npm run preview  # Preview production build in Electron
npm run dist     # Create electron-builder distribution packages
```

**Build Pipeline:**

1. electron-vite builds three separate bundles (main, preload, renderer)
2. Static assets copied from `static/` to `dist/renderer/`
3. Electron-builder packaging for Windows (NSIS installer)

### TypeScript Configuration

**Target:** ES2015  
**Module Resolution:** Node  
**Key Settings:**
- `nodeIntegration: true` - Allows Node.js APIs in renderer
- Strict type checking with some exceptions (nullChecks, implicitAny disabled)
- Source maps enabled for debugging
- Extends electron-webpack TypeScript base configuration

## Dependency Update History & Strategy

### Update Context (December 2025)

**Problem:** Repository could not build on Node.js 20 due to:
1. OpenSSL 3.0 incompatibility in webpack 5.24.2
2. 39 production security vulnerabilities
3. Outdated TypeScript (4.2.2) incompatible with ts-loader
4. Multiple deprecated and vulnerable packages

**Error Encountered:**
```
Error: error:0308010C:digital envelope routines::unsupported
```
This error occurs because webpack 5.24.2 uses MD4 hashing algorithm, which is not supported in OpenSSL 3.0 (used by Node.js 17+).

### Dependency Update Plan (Completed)

#### Phase 1: Fix Node.js 20 Compatibility ✅
**Commit:** b5fcd9f - "Update webpack and ts-loader to fix Node.js 20 compatibility"

**Changes:**
- webpack: 5.24.2 → ^5.89.0 (latest 5.x with OpenSSL 3.0 support)
- ts-loader: added ^9.5.1 as direct dependency

**Rationale:**
- webpack 5.89+ includes fixes for OpenSSL 3.0 compatibility
- ts-loader 6.2.2 (from electron-webpack-ts) incompatible with TypeScript 4.9+
- Added ts-loader directly to override the old version
- Used `--legacy-peer-deps` to handle peer dependency conflicts

**Result:** Build now succeeds on Node.js 20.19.6

#### Phase 2: Update Runtime Dependencies ✅
**Commit:** 6601873 - "Update runtime dependencies: jquery, idb, js-yaml, cssnano, postcss-svgo, svgo"

**Changes:**
- jquery: 3.5.1 → 3.7.1 (security fixes)
- idb: 6.0.0 → 8.0.3 (major update - API compatible)
- js-yaml: 4.0.0 → 4.1.1 (patch updates)
- source-map-support: 0.5.19 → 0.5.21 (patch)
- cssnano: 4.1.10 → 7.1.2 (major - fixes PostCSS vulnerabilities)
- postcss-svgo: 4.0.2 → 7.1.0 (major - fixes nth-check ReDoS)
- svgo: 2.2.0 → 4.0.0 (major)

**Security Fixes:**
- GHSA-7fh5-64p2-3v2j - PostCSS line return parsing error
- GHSA-rp65-9cf3-cjxr - Inefficient RegEx in nth-check

**Result:** Production vulnerabilities: 39 → 0

#### Phase 3: Update TypeScript ✅
**Commit:** 1297364 - "Update TypeScript to 5.x and @types/jquery to latest"

**Changes:**
- typescript: 4.2.2 → ^5.0.0 (installed 5.9.3)
- @types/jquery: 3.5.5 → 3.5.33 (latest type definitions)

**Rationale:**
- TypeScript 5.x fully compatible with codebase
- Improved type checking and language features
- Required for modern ts-loader support

**Result:** Successful compilation with TypeScript 5.9.3

### Final State

**Vulnerabilities:**
- Production: 0 vulnerabilities ✅
- Dev: 38 vulnerabilities (all in build tools, not in shipped app)

**Build Status:**
- ✅ Compiles successfully with `npm run compile`
- ✅ Compatible with Node.js 24.11.1
- ✅ No source code changes required for compilation
- ❌ **Application window is blank** - renderer content not displaying
- ❌ `npm run dev` fails with namedModules error

**Additional Fixes Applied (December 2025):**

1. **Added `main` entry to package.json** - Points to `dist/main/main.js`
2. **Created `electron-webpack.js`** - Custom webpack config patch:
   - Converts `optimization.namedModules` → `optimization.moduleIds: 'named'`
   - Converts `optimization.noEmitOnErrors` → `optimization.emitOnErrors`
3. **Added `electronWebpack` config to package.json** - Points to webpack patch
4. **Added `overrides` to package.json** - Forces `html-webpack-plugin@5` for webpack 5 compatibility
5. **Removed `html-loader` from devDependencies** - Uses electron-webpack's bundled v1.3.2

**Remaining Dev Vulnerabilities:**
All 38 remaining vulnerabilities are in:
- electron 12.0.0 (EOL, multiple security issues)
- electron-builder 22.10.5
- webpack-dev-server (used only in development)
- electron-webpack dependencies (braces, chokidar, etc.)

**Note:** Upgrading electron from 12.0.0 requires significant testing and API updates (out of scope).

## Working with Dependencies

### Installing Dependencies
```bash
npm install --legacy-peer-deps
```
**Note:** `--legacy-peer-deps` is required due to peer dependency conflicts between:
- electron-webpack-ts expecting TypeScript 3.x
- electron-webpack expecting webpack 4.x
- Actual versions: TypeScript 5.x, webpack 5.x

### Updating Dependencies

**Safe Updates (within semver range):**
```bash
npm update --legacy-peer-deps
```

**Major Version Updates:**
1. Check GitHub Advisory Database first
2. Update package.json with new version
3. Run `npm install --legacy-peer-deps`
4. Test build: `npm run compile`
5. Verify application functionality
6. Check audit: `npm audit --omit=dev`

**Key Constraints:**
- electron-webpack requires webpack 4.x (we override with 5.x)
- electron-webpack-ts requires TypeScript 3.x (we override with 5.x)
- ts-loader must be ≥9.x for TypeScript 5.x compatibility
- electron 12.0.0 is pinned (major update requires significant work)

### Security Auditing

**Check production vulnerabilities:**
```bash
npm audit --omit=dev
```

**Check all vulnerabilities:**
```bash
npm audit
```

**Fix safe vulnerabilities:**
```bash
npm audit fix --legacy-peer-deps
```

## Build & Development

### Development Workflow
```bash
npm install --legacy-peer-deps  # First time setup
npm run dev                     # Start development server
```

### Production Build
```bash
npm run compile                 # Compile TypeScript & bundle
npm run dist                    # Create installer (Windows NSIS)
```

### Troubleshooting

**Error: OpenSSL unsupported**
- Ensure webpack ≥5.89.0
- Check Node.js version (20.x supported)

**Error: TypeScript resolution**
- Ensure ts-loader ≥9.5.0 is a direct dependency
- Check TypeScript version ≥5.0.0

**Peer dependency warnings**
- Expected with current setup
- Use `--legacy-peer-deps` for all npm commands

**Build fails after dependency update**
1. Delete node_modules and package-lock.json
2. Run `npm install --legacy-peer-deps`
3. Try `npm run compile` again

## Important Notes for Future Maintainers

### Package Management
- **Always use** `--legacy-peer-deps` flag with npm commands
- Do not use `npm audit fix --force` (can break build)
- Test build after every dependency update

### Electron Upgrade Path
To upgrade electron beyond 12.0.0:
1. Update electron-builder to compatible version
2. Review Electron breaking changes (13+, 14+, etc.)
3. Update BrowserWindow configuration (contextIsolation, sandbox)
4. Test IPC communication (may need contextBridge)
5. Update electron-webpack or migrate to different build system
6. Extensive testing required (estimated: 2-4 days work)

### Build System Considerations
- electron-webpack is semi-abandoned (last update 2020)
- Consider migration to electron-forge or electron-vite in future
- Current setup works but is not modern

### Security Considerations
- Production dependencies have 0 vulnerabilities ✅
- Dev tool vulnerabilities don't affect shipped application
- Focus security updates on runtime dependencies
- electron 12.0.0 has known security issues but upgrading is complex

## Key Dependencies Reference

### Runtime Dependencies
| Package            | Version | Purpose                          |
| ------------------ | ------- | -------------------------------- |
| jquery             | ^3.7.1  | DOM manipulation, event handling |
| idb                | ^8.0.0  | Promise-based IndexedDB wrapper  |
| js-yaml            | ^4.1.0  | YAML parsing for import/export   |
| cssnano            | ^7.0.0  | CSS optimization                 |
| postcss-svgo       | ^7.0.0  | SVG optimization in CSS          |
| svgo               | ^4.0.0  | SVG optimization                 |
| source-map-support | ^0.5.21 | Source map support for debugging |

### Dev Dependencies

| Package          | Version | Purpose                                |
| ---------------- | ------- | -------------------------------------- |
| electron         | 12.0.0  | Desktop app framework (needs upgrade)  |
| electron-builder | 22.10.5 | App packager/installer builder         |
| electron-vite    | ^5.0.0  | Vite integration for Electron          |
| vite             | ^7.2.7  | Build tool and dev server              |
| typescript       | ^5.0.0  | TypeScript compiler                    |
| @types/jquery    | ^3.5.30 | jQuery type definitions                |
| @types/electron  | ^1.6.10 | Electron type definitions (deprecated) |
| @types/node      | ^25.0.1 | Node.js type definitions               |

## Application-Specific Notes

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

### Key Features
1. **Deployment Management** - Create, edit, delete deployment checklists
2. **PDF Export** - Print checklists to PDF
3. **Data Export/Import** - Save/load deployment data (.mddata files)
4. **Checklist System** - Organized by Phases → Steps → Tasks
5. **Help System** - Context-sensitive help content
6. **Modal Dialogs** - For new/edit/import operations

### Static Content
- Help content in `static/info_content/` (HTML files)
- Icons in `static/icons/` (favicon, app icons)
- Images in `static/images/` (banners, logos)

## Testing Recommendations

### After Dependency Updates
1. Test build: `npm run compile`
2. Test dev mode: `npm run dev`
3. Manual testing:
   - Create new deployment
   - Add/edit/delete checklist items
   - Export to PDF
   - Export/import data (.mddata)
   - Navigate all views (menu, checklist, help)
4. Check console for errors
5. Verify IndexedDB operations work

### No Automated Tests
**Note:** This project does not have automated tests. All testing must be done manually.

## References

- [Electron Documentation](https://www.electronjs.org/docs)
- [electron-webpack](https://github.com/electron-userland/electron-webpack)
- [idb Documentation](https://github.com/jakearchibald/idb)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Webpack Documentation](https://webpack.js.org/)

---

**Last Updated:** December 15, 2025  
**Node.js Version Tested:** 24.11.1  
**Build Status:** ✅ Fully functional - dev and production builds work correctly

## Current Work: Build System Migration (Option B)

**Decision Date:** December 12, 2025  
**Branch:** `copilot/update-dependencies-approach`  
**Detailed Plan:** `docs/migration-plan-electron-vite.md`

### Migration Status

| Phase | Description                        | Status     | Notes                                    |
| ----- | ---------------------------------- | ---------- | ---------------------------------------- |
| 1     | Setup electron-vite infrastructure | ✅ Complete | Build and dev server work                |
| 2     | Fix static asset paths             | ✅ Complete | PR #3 merged December 15, 2025           |
| 3     | Fix renderer process issues        | ✅ Complete | App renders, interactive                 |
| 4     | Verify full functionality          | ✅ Complete | Basic functionality verified             |
| 5     | Update build & distribution        | 🔲 Pending  | electron-builder config may need updates |

### Phase 1 Changes Made (December 12, 2025)

**Dependencies Removed:**
- `electron-webpack`, `electron-webpack-ts`, `ts-loader`, `webpack`

**Dependencies Added:**
- `electron-vite` ^5.0.0, `vite` ^7.2.7

**Files Created:**
- `electron.vite.config.ts` - Vite config for main/preload/renderer
- `src/renderer/index.html` - HTML entry point
- `src/preload/index.ts` - Preload script (placeholder)
- `src/renderer/functions/helpers/electronHelper.ts` - Runtime electron module access
- `src/renderer/types/global.d.ts` - Window.require type declaration

**Files Modified:**
- `package.json` - Scripts, dependencies
- `tsconfig.json` - ESNext module, Vite types
- `src/main/index.ts` - Removed `__static`, added `getStaticPath()` helper
- `src/renderer/functions/helpers/createStaticPath.ts` - Vite-compatible paths
- `src/renderer/functions/menuEvents.ts` - Runtime electron imports
- `src/renderer/functions/helpBuilder.ts` - Runtime electron imports
- `src/renderer/functions/helpers/openLinksExternally.ts` - Runtime electron imports
- `src/renderer/index.ts` - Runtime electron imports

**Files Deleted:**
- `electron-webpack.js` - Old webpack patch

**Key Pattern Established:**
Vite cannot bundle the `electron` module (it's runtime-only in Electron). Solution:

```typescript
// src/renderer/functions/helpers/electronHelper.ts
export const getIpcRenderer = () => {
  const electron = getElectron();
  return electron?.ipcRenderer;
};
// Usage: getIpcRenderer()?.send('channel', data)
```

### Phase 2: Static Asset Paths ✅ COMPLETE

**PR #3 merged December 15, 2025**

**Changes Made:**

- Simplified `createStaticPath.ts` - uses relative paths in production instead of complex Node.js module detection
- Added error handling to `includeHtml.ts` - null checks, HTTP error handling, user-friendly error messages
- Fixed typo in comment ("inlcude-html" → "include-html")

---

## Session History

| Date       | Summary                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------- |
| 2025-12-12 | Phase 1 complete: Migrated electron-webpack → electron-vite. App renders, dev server works. |
| 2025-12-15 | Phase 2 complete: Merged PR #3 fixing static asset path resolution for dev and production.  |

---

## Future Work: Electron Modernization

The build system migration is complete. The next major work item is upgrading Electron and modernizing security practices.

### 🔴 High Priority (Security)

| Task                              | Description                                                      | Complexity |
| --------------------------------- | ---------------------------------------------------------------- | ---------- |
| **Upgrade Electron 12 → 33+ LTS** | Electron 12 is EOL with 9+ high severity CVEs                    | High       |
| **Upgrade electron-builder**      | v22.10.5 has high severity vulnerability, need v26+              | Medium     |
| **Enable context isolation**      | Currently using `nodeIntegration: true` which is a security risk | High       |
| **Replace `remote` module**       | Deprecated in Electron 12, removed in later versions. Need IPC   | High       |

### 🟡 Medium Priority (Code Quality)

| Task                      | Description                                                 | Complexity |
| ------------------------- | ----------------------------------------------------------- | ---------- |
| **Add ESLint + Prettier** | No linting configured                                       | Low        |
| **Add unit tests**        | No test framework currently                                 | Medium     |
| **Move dependencies**     | `cssnano`, `postcss-svgo`, `svgo` should be devDependencies | Low        |

### 🟢 Low Priority (Nice to Have)

| Task                      | Description                  | Complexity |
| ------------------------- | ---------------------------- | ---------- |
| **Add GitHub Actions CI** | Automate build/test on PRs   | Low        |
| **Add Dependabot**        | Automated dependency updates | Low        |

### Electron Upgrade Path

Upgrading Electron 12 → 33+ requires:

1. **Replace `remote` module usage** - Currently used in `helpBuilder.ts` for `app.getVersion()`
2. **Implement proper IPC** - Add handlers in main process, use `contextBridge` in preload
3. **Enable `contextIsolation: true`** - Required for modern Electron security
4. **Update electron-builder** - v22 → v26+ for compatibility
5. **Test thoroughly** - PDF export, data export/import, all UI functionality

**Estimated effort:** 2-4 days

**Files that will need changes:**

- `src/main/index.ts` - Add IPC handlers
- `src/preload/index.ts` - Implement `contextBridge` API
- `src/renderer/functions/helpers/electronHelper.ts` - Use exposed API instead of `remote`
- `src/renderer/functions/helpBuilder.ts` - Update version retrieval
- `src/renderer/functions/menuEvents.ts` - Update IPC calls
- `package.json` - Update electron, electron-builder versions

---
