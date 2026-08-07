# Changelog

All notable changes to this project will be documented in this file.

## [1.0.13] - 07-08-2026
### Changed
- `dist/` removed from version control — package is now built and published via GitHub Actions CI
- Updated publish workflow: trigger changed to `published`, Node bumped to 24, added install/build/typecheck steps
- `CHANGELOG.md` added to npm package files

---

## [1.0.12] - 30-07-2026
### Updated
- Peer dependency range expanded to `>=1.3.7` — compatible with all Quill versions
- Added `react-quill-new` compatibility note in README

---

## [1.0.11] - 24-05-2026
### Updated
- Vite v8.0.14 project build

---

## [1.0.10] - 05-04-2026
### Fixed
- IIFE build now works with Quill 2.x — `Quill.Module` is patched via `Quill.import('core/module')` when not available on the global

### Added
- CDN usage section in README (unpkg / jsDelivr examples)

---

## [1.0.9] - 04-04-2026
### Fixed
- Memory leaks: destroy() now properly removes all event listeners and cleans up DOM references
- Passing partial style options (handleStyles, overlayStyles, displaySizeStyles) no longer wipes out the defaults — they now merge correctly
- displaySizeStyles option was being ignored — custom styles are now applied
- XSS risk: replaced innerHTML with textContent in the size display

### Added
- TypeScript types shipped with the package — import type { ImageResizeOptions, CSSStyles, HandlePosition } from 'resize-quill-image'
- README update
- Vite v8.0.3 project build
---

## [1.0.8] - 02-02-2026
### Updated
- Vite project build
---

## [1.0.7] - 06-11-2025
### Updated
- Docs
- Project build
---
## [1.0.6] - 22-06-2025
### Fixed
- Scroll to top on image selection
---

## [1.0.5] - 22-06-2025
### Updated
- Docs with live demo link
---

## [1.0.4] - 19-06-2025
### Fixed
- Switched from CSS styles to HTML attributes for width and height

---

