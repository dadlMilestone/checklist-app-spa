# Migration Plan: electron-webpack → electron-vite

**Created:** December 12, 2025  
**Status:** Planning  
**Target:** Option B - Migrate build system while keeping Electron 12.0.0

---

## Overview

This document details the migration from `electron-webpack` (abandoned 2020) to `electron-vite` (actively maintained). The migration keeps Electron 12.0.0 unchanged to isolate risk—Electron upgrade will be a separate future phase (Option C).

### Why electron-vite?

| Criteria          | electron-webpack  | electron-vite  |
| ----------------- | ----------------- | -------------- |
| Last Update       | 2020              | Active (2024+) |
| Webpack Version   | 4.x (hacked to 5) | N/A (Vite)     |
| Dev Server        | Slow, broken      | Fast HMR       |
| TypeScript        | Via plugin        | Native         |
| Config Complexity | High              | Low            |
| Electron Versions | Up to ~13         | All current    |

---

## Migration Phases

### Phase 1: Setup electron-vite Infrastructure
**Effort:** ~1 hour  
**Risk:** Low  
**Suitable for Coding Agent:** ✅ Yes

**Tasks:**
1. Install electron-vite and dependencies
2. Create `electron.vite.config.ts`
3. Create HTML entry point for renderer (`index.html`)
4. Update `package.json` scripts
5. Remove electron-webpack dependencies and config

**Files to Create:**
- `electron.vite.config.ts`
- `src/renderer/index.html`

**Files to Modify:**
- `package.json`

**Files to Delete:**
- `electron-webpack.js`

**Acceptance Criteria:**
- `npm run dev` starts Vite dev server
- `npm run build` creates production bundles
- No electron-webpack references remain

---

### Phase 2: Fix Static Asset Paths
**Effort:** ~1-2 hours  
**Risk:** Medium  
**Suitable for Coding Agent:** ⚠️ Partially (needs testing)

**Tasks:**
1. Replace `__static` global with Vite's asset handling
2. Update `createStaticPath.ts` helper for Vite
3. Move/configure static assets for Vite (`public/` folder)
4. Update all static asset references in code

**Files Affected:**
- `src/main/index.ts` - Window icon path
- `src/renderer/functions/helpers/createStaticPath.ts` - Complete rewrite
- `src/renderer/index.ts` - Image paths
- `src/renderer/functions/helpBuilder.ts` - Help content paths
- `src/renderer/functions/*.ts` - Any file using `createStaticPath`

**Key Change:**
```typescript
// OLD (electron-webpack)
declare const __static: string;
path.join(__static, "./icons/win/favicon.ico")

// NEW (electron-vite)
// Main process: use app.getAppPath() or import.meta.url
// Renderer: use Vite's asset imports or public folder
```

**Acceptance Criteria:**
- Application icon displays correctly
- All images load in renderer
- Help content HTML files load correctly

---

### Phase 3: Fix Renderer Process Issues
**Effort:** ~2-3 hours  
**Risk:** Medium  
**Suitable for Coding Agent:** ❌ No (requires interactive debugging)

**Tasks:**
1. Verify HTML template loads correctly
2. Fix any Electron `remote` module issues (deprecated in Electron 12+)
3. Ensure jQuery initializes correctly
4. Verify IndexedDB initialization
5. Test all UI views render

**Known Issues:**
- `remote` module is used in `src/renderer/index.ts`:
  ```typescript
  import { remote } from 'electron';
  // Used for: remote.app.getVersion()
  ```
  This will need IPC or preload script (but `remote` still works in Electron 12)

**Acceptance Criteria:**
- Application window shows content (not blank)
- Main menu renders
- Splash screen displays with version

---

### Phase 4: Verify Full Application Functionality
**Effort:** ~1-2 hours  
**Risk:** Low  
**Suitable for Coding Agent:** ❌ No (manual testing)

**Tasks:**
1. Create new deployment
2. Add/edit checklist items
3. Export to PDF
4. Export/import .mddata files
5. Navigate all views
6. Test help system
7. Verify IndexedDB persistence

**Acceptance Criteria:**
- All features work as before
- No console errors
- Data persists across restarts

---

### Phase 5: Update Build & Distribution
**Effort:** ~30 minutes  
**Risk:** Low  
**Suitable for Coding Agent:** ✅ Yes

**Tasks:**
1. Update electron-builder config for new output paths
2. Test `npm run dist` produces working installer
3. Verify installed app works

**Acceptance Criteria:**
- NSIS installer builds successfully
- Installed application runs correctly

---

## Work Assignment Strategy

### Interactive Sessions (This Chat)
- **Phase 1:** Setup infrastructure (quick, low risk)
- **Phase 3:** Debug renderer issues (needs real-time troubleshooting)
- **Phase 4:** Testing (manual verification needed)

### GitHub Coding Agent (Issues)
- **Phase 2:** Static asset migration (well-defined, file-by-file)
- **Phase 5:** Build configuration updates (straightforward)

**Rationale:** 
The Coding Agent works best for well-defined, isolated tasks with clear acceptance criteria. Phases involving debugging or testing require interactive feedback loops.

---

## Detailed Implementation Notes

### electron-vite Configuration

```typescript
// electron.vite.config.ts
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/main/index.ts')
        }
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/preload/index.ts')
        }
      }
    }
  },
  renderer: {
    root: resolve(__dirname, 'src/renderer'),
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/renderer/index.html')
        }
      }
    }
  }
})
```

### Static Assets Strategy

**Option A: Public Folder (Recommended)**
- Create `public/` folder at project root
- Move `static/` contents → `public/`
- Access via absolute paths: `/images/banner.png`

**Option B: Import Assets**
- Import images in TypeScript: `import banner from './images/banner.png'`
- Vite handles bundling and path resolution

**Recommendation:** Use Option A for simplicity since the app has many static HTML files for help content.

### Package.json Scripts (New)

```json
{
  "scripts": {
    "dev": "electron-vite dev",
    "build": "electron-vite build",
    "preview": "electron-vite preview",
    "dist": "npm run build && electron-builder"
  }
}
```

---

## Risk Mitigation

1. **Keep electron-webpack branch** - Current branch preserved for rollback
2. **Incremental commits** - Each phase committed separately
3. **Test after each phase** - Don't proceed until current phase verified
4. **Electron 12 unchanged** - No additional variables introduced

---

## Success Metrics

- [ ] `npm run dev` works with hot reload
- [ ] `npm run build` produces production bundles
- [ ] Application displays content (not blank)
- [ ] All features functional
- [ ] `npm run dist` creates working installer
- [ ] 0 production vulnerabilities maintained
- [ ] Dev vulnerabilities reduced (electron-webpack removed)

---

## Future Work (Option C - Out of Scope)

After this migration succeeds:
1. Upgrade Electron 12 → 28+ LTS
2. Implement `contextIsolation: true`
3. Add preload script with `contextBridge`
4. Replace `remote` module with IPC
5. Enable sandbox

This will be tracked in a separate planning document.
