# Copilot Instructions for Checklist App SPA

## ⚠️ CRITICAL: Current Project Status (December 2025)

### Background
This application has not been touched for 4 years and we are attempting to modernize it to release a new version with updated content. The alternative would be building a new application from scratch, but reusing this existing codebase is preferred if feasible.

### Current State: PARTIALLY WORKING - MAJOR ISSUES REMAIN

**What Works:**
- ✅ `npm run compile` - TypeScript compiles and webpack bundles successfully
- ✅ Application window launches with correct title "Milestone Deployment Assistant"
- ✅ Window displays at correct size with proper Electron chrome

**What Does NOT Work:**
- ❌ **Application content does not render** - Window appears completely blank/white
- ❌ No UI interaction possible - the renderer process is not displaying content
- ❌ `npm run dev` - Development mode fails with webpack configuration errors

### Root Cause Analysis Needed
The blank window indicates the renderer process is failing to load. Possible causes:
1. Static assets not being found (path resolution issues with `__static`)
2. HTML template not loading properly
3. JavaScript errors in renderer process preventing DOM rendering
4. CSS not loading
5. electron-webpack's renderer configuration incompatible with webpack 5

### Priority Issues to Resolve
1. **CRITICAL:** Fix blank window - renderer content must display
2. **CRITICAL:** Electron 12.0.0 is EOL with security vulnerabilities - must upgrade
3. **HIGH:** Fix `npm run dev` for development workflow
4. **MEDIUM:** Resolve remaining 38 dev dependency vulnerabilities if possible

### Decision Point
If fixing the renderer issues proves too complex due to electron-webpack incompatibilities, consider:
- Migrating to electron-forge or electron-vite (modern build systems)
- Upgrading Electron at the same time
- This would be a larger effort but may be cleaner than patching old tooling

---

## Application Overview

**Application Name:** Milestone Deployment Assistant 2020 R3  
**Type:** Electron Desktop Application  
**Purpose:** A deployment checklist application for Milestone Systems VMS installations  
**Repository:** https://github.com/dadlMilestone/checklist-app-spa

## Architecture

### Technology Stack
- **Framework:** Electron 12.0.0 (desktop application framework)
- **Build System:** electron-webpack (webpack-based build system for Electron)
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
npm run dev  # Start electron-webpack dev server with hot reload
```

**Production Build:**
```bash
npm run compile  # Compile TypeScript & webpack bundles
npm run dist     # Create electron-builder distribution packages
```

**Build Pipeline:**
1. TypeScript compilation via ts-loader
2. Webpack bundling (separate for main & renderer)
3. CSS processing with PostCSS (cssnano, svgo optimizations)
4. Electron-builder packaging for Windows (NSIS installer)

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
| Package             | Version | Purpose                                 |
| ------------------- | ------- | --------------------------------------- |
| electron            | 12.0.0  | Desktop app framework                   |
| electron-builder    | 22.10.5 | App packager/installer builder          |
| electron-webpack    | ^2.8.2  | Webpack integration for Electron        |
| electron-webpack-ts | ^4.0.1  | TypeScript support for electron-webpack |
| webpack             | ^5.89.0 | Module bundler                          |
| typescript          | ^5.0.0  | TypeScript compiler                     |
| ts-loader           | ^9.5.1  | TypeScript loader for webpack           |
| @types/jquery       | ^3.5.30 | jQuery type definitions                 |
| @types/electron     | ^1.6.10 | Electron type definitions (deprecated)  |
| html-loader         | ^2.1.1  | HTML loader for webpack                 |

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

**Last Updated:** December 12, 2025  
**Node.js Version Tested:** 24.11.1  
**Build Status:** ⚠️ Compiles but app window is blank - renderer issues

## Next Steps for Future Sessions

1. **Debug blank window issue:**
   - Check browser dev tools for JavaScript errors
   - Verify static assets are being served
   - Check if index.html template is loading
   - Inspect network tab for failed resource loads

2. **Consider build system migration:**
   - electron-webpack is abandoned (last update 2020)
   - electron-forge or electron-vite are modern alternatives
   - Would allow cleaner Electron upgrade path

3. **Upgrade Electron (required for security):**
   - Current: 12.0.0 (EOL, multiple CVEs)
   - Target: Latest LTS (e.g., 28.x or 33.x)
   - Will require code changes for contextIsolation, sandbox, etc.
