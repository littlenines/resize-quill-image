# How resize-quill-image works

This doc walks through the `src/` folder and explains what each piece does and why it exists.

---

When a user clicks an image inside Quill, we need to draw a dashed border around it, put draggable handles on the corners, and resize the image as they drag. When they click somewhere else, everything disappears cleanly.

The code is split into a main entry point (`ImageResize.js`) and a set of focused manager classes, each owning one piece of the UI.

```
src/
├── constants.js               — all default styles live here
├── ImageResize.js             — the Quill module, handles events
└── managers/
    ├── ResizeUIController.js  — creates and coordinates all the managers
    ├── OverlayManager.js      — the dashed border that wraps the image
    ├── HandleManager.js       — the 4 corner triangles you drag
    ├── DragController.js      — the actual resize math on drag
    ├── DisplaySizeManager.js  — the W × H badge
    └── TooltipInfoManager.js  — the ? icon and keyboard shortcut popup
```

---

## `ImageResize.js` — the entry point

This is what Quill sees. It extends Quill's `Module` class and gets instantiated automatically when you add `imageResize` to the modules config.

The constructor does three things:
1. Merges your options with the defaults. Each style sub-object (`handleStyles`, `overlayStyles`, `displaySizeStyles`) is merged independently, so passing `handleStyles: { backgroundColor: 'red' }` keeps all the other handle defaults instead of wiping them out.
2. Injects a `<style>` tag into `<head>` with a `.no-selection::selection` rule. This is how we suppress the blue text highlight when an image is selected — you can't do `::selection` with inline styles, it has to be a real stylesheet.
3. Creates a `ResizeUIController` and wires up three event listeners.

The three events it listens to:

- **`click` on `quill.root`** — if you clicked an `<img>`, show the resize UI.
- **Quill `selection-change`** — handles keyboard navigation and programmatic selection. If the selection is exactly one image (`range.length === 1`), show the UI; otherwise hide it. A collapsed cursor just before an image doesn't count, even though Quill finds the image at that index.
- **Quill `text-change`** — if content changes while an image is active (e.g. someone pastes text), we check if that image still exists in the editor. If it was deleted, hide the UI. If it's still there, reposition the overlay in case the layout shifted.

In read-only mode (`readOnly: true` or `quill.disable()`), the click and `selection-change` handlers hide the UI instead of showing it. `DragController` also refuses to start a drag, which covers an image that was already selected when the editor was disabled. Quill has no event for `disable()`.

While an image is selected, the `no-selection` class (`noSelectionClass`) is on `quill.root`; it comes off again when the selection moves away. `enableTextSelection()` / `disableTextSelection()` use `classList.toggle(name, force)` rather than `add()` / `remove()` on purpose. `add()` and `remove()` always rewrite the `class` attribute, even when nothing changes. Quill watches `quill.root` for attribute changes and treats each one as an edit, rebuilding its copy of the whole document. `selection-change` fires on every cursor move, so that made typing and navigation slow in large documents. `toggle()` with a force argument doesn't touch the attribute when the class is already in the right state.

`destroy()` is the cleanup method. It removes all three listeners, removes the `no-selection` class, calls `uiController.destroy()`, and nulls its own references so nothing gets held in memory. You need to call this yourself when unmounting — see the Lifecycle section at the bottom.

---

## `constants.js` — all the defaults

One big `DEFAULT_OPTIONS` export. This is the source of truth for every default style and configuration value. Keeping it here means `ImageResize.js` and the managers don't have scattered magic values.

Worth knowing: `positions` is the array of 4 corner objects that drives where the handles are placed. Each object has `top`/`bottom` + `left`/`right` coordinates and a `clipPath` that cuts the square `<div>` into a triangle shape visually pointing into the corner.

---

## `ResizeUIController.js` — the coordinator

`ImageResize` doesn't talk to the managers directly — it goes through `ResizeUIController`. This keeps the Quill event code separate from the UI lifecycle code.

The controller creates `OverlayManager` and `DragController` once, on construction — these are persistent. The other managers (`HandleManager`, `DisplaySizeManager`, `TooltipInfoManager`) are created fresh every time an image is selected and torn down when it's deselected.

**`show(img)`** — called when an image is clicked. Has a `_showing` guard to prevent re-entrancy. Calls `hide()` first to reset any previous state, then builds the full UI: overlay, handles, size badge (if `displaySize: true`), tooltip icon (if `helpIcon: true`). It also hands the size and tooltip managers to `DragController` so they can be updated on every drag frame.

**`hide()`** — tears everything down. Removes handles, removes the overlay, removes the badge and tooltip, clears references. After this runs the DOM is clean.

**`update()`** — repositions the overlay and refreshes the badge/tooltip without fully rebuilding. Called when the editor content changes but the selected image is still there.

---

## `OverlayManager.js` — the dashed border

Creates a single `<div>` with `position: absolute` that sits on top of the selected image.

The tricky part is `reposition()`. We can't just use `img.offsetTop` because that's relative to the image's own offset parent, which might not be the same element our overlay is positioned against. Instead we use `getBoundingClientRect()` on both the image and the overlay's `offsetParent` (falling back to the container if `offsetParent` is null). This gives us viewport-relative coordinates for both, and subtracting them gives the correct pixel offset. We also add `scrollLeft`/`scrollTop` to compensate for any scroll inside the editor container.

---

## `HandleManager.js` — the corner handles

Creates 4 `<div>` elements inside the overlay, one per corner. Each gets styled with the merged `handleStyles` plus the position coordinates from `constants.js`.

Cursor assignment is based on which corner it is: top-left and bottom-right get `nwse-resize`, top-right and bottom-left get `nesw-resize`. We derive this from the actual position keys (`top + left` = NW, `bottom + right` = SE) rather than array index — that way it still works if someone passes a custom `positions` array.

`removeHandles()` cleans up event listeners and removes all the elements from the DOM.

---

## `DragController.js` — the resize logic

This is where the actual resizing happens. When a handle is pressed, `startDragging()` records the starting mouse/touch coordinates and the image's current dimensions, then registers global `mousemove`/`touchmove` listeners on `document` (not the handle itself — you'd lose the drag if you moved the mouse too fast).

Every move event fires `handleDrag()`, which calculates how far the cursor moved and applies one of four resize modes:

- **Default** — proportional resize. Uses whichever axis moved more and maintains the aspect ratio.
- **Ctrl held** — free resize. Width and height change independently.
- **Shift held** — height only.
- **Alt held** — width only.

After updating the image dimensions, it calls `reposition()` on the overlay and `update()` on the badge and tooltip so everything stays in sync visually.

One detail: at the end of each frame, `startX/Y/Width/Height` are updated to the current values. This means deltas are incremental (frame-to-frame), not cumulative from the drag start. This avoids drift and makes the resize feel direct.

`handleMouseup()` removes the global listeners and clears state. A window `blur` also ends the drag, in case the mouse release never arrives, for example when you alt-tab mid-drag.

**Batching.** Every width/height change on the `<img>` is a change Quill's observer sees, and Quill treats each one as a separate edit. Left alone, one resize would rebuild Quill's copy of the whole document on every frame and create several undo steps. So `startDragging()` calls `quill.scroll.batchStart()` and the end of the drag calls `batchEnd()`. The image still resizes live, but Quill processes the whole resize as one edit: one rebuild, one `text-change`, one undo step. Two details matter:
- The batch must always be closed, or Quill stops processing edits. That's why mouse release, touch end/cancel, window blur and `destroy()` all call `endBatch()`.
- Before `batchEnd()`, `endBatch()` adds any changes the observer hasn't delivered yet (`scroll.observer.takeRecords()`) to the batch. Otherwise `batchEnd()` consumes them without recording an edit, and the screen and Quill's model end up showing different sizes.

**Read-only.** `startDragging()` does nothing when `quill.isEnabled()` is false. Quill ignores user changes made directly to the page while disabled, so a resize would show on screen but never reach Quill's model. It would then be saved silently with the next edit once the editor is re-enabled.

---

## `DisplaySizeManager.js` — the W × H badge

A small `<div>` appended to the overlay that shows the image's current pixel dimensions.

`update()` reads `img.offsetWidth` and `img.offsetHeight` (rendered size, not natural size) and sets the text. It also repositions the badge: if the image is large enough (wider than 120px and taller than 30px) the badge sits inside the image at the bottom-right corner. If the image is too small, the badge floats outside to the right so it doesn't cover the image.

---

## `TooltipInfoManager.js` — the ? help icon

Creates a `?` button in the top-right corner of the overlay. Hovering it shows a small popup with the three keyboard shortcuts (Shift, Ctrl, Alt).

The tooltip text is built as three separate `<span style="display:block">` elements rather than a single string with `\n`. The reason: `white-space: pre` to render newlines can be overridden by the page's CSS, but `display: block` on a span is harder to accidentally break.

`update()` repositions the popup relative to the icon using `offsetLeft`/`offsetTop`, which are coordinates relative to the overlay — which is already positioned correctly.

---

## How it all flows

```
User clicks image
       │
       ▼
ImageResize.handleClick()
  → sets Quill selection on the image blot
       │
       ▼
ResizeUIController.show(img)
  → OverlayManager: create + reposition
  → HandleManager: create 4 corner handles
  → DisplaySizeManager: create badge        (if displaySize: true)
  → TooltipInfoManager: create ? icon       (if helpIcon: true)

User drags a corner handle
       │
       ▼
ResizeUIController.handleMousedown()
       │
       ▼
DragController.startDragging()
  → registers mousemove + touchmove on document
       │
       ▼ (every frame)
DragController.handleDrag()
  → resizes img.width / img.height
  → OverlayManager.reposition()
  → DisplaySizeManager.update()
  → TooltipInfoManager.update()

User clicks elsewhere
       │
       ▼
ImageResize.hide() → ResizeUIController.hide()
  → HandleManager.removeHandles()
  → OverlayManager.remove()
  → DisplaySizeManager.remove()
  → TooltipInfoManager.remove()
```

---

## Cleanup / memory leaks

`DragController` registers listeners on `document`, not on any element inside the editor. If those listeners aren't removed they'll keep running even after the Quill instance is gone — which in React means every remount leaks another set.

`ImageResize.destroy()` handles this. The chain is:

```
ImageResize.destroy()   (does nothing if already destroyed)
  → removes click / selection-change / text-change listeners
  → removes the no-selection class from quill.root
  → ResizeUIController.destroy()
      → hide() (removes all DOM elements)
      → DragController.destroy() (removes document listeners, closes any open batch)
      → nulls overlayManager and dragController
  → nulls uiController and quill
```

In React, call it in the `useEffect` cleanup:

```js
return () => {
  const imageResize = quill.getModule('imageResize');
  if (imageResize?.destroy) imageResize.destroy();
  container.innerHTML = '';
};
```

---

## Tests

`npm test` runs the tests in `tests/` with Vitest, using a real Quill editor in jsdom. The publish workflow runs them before building. There's one file per area, and `tests/helpers.js` creates the editors and simulates clicks, drags and touches.

| File | Covers |
|---|---|
| `selection.test.js` | Showing and hiding the UI, the selection check, switching images, cursor moves not rebuilding the document |
| `resize-modes.test.js` | Default, Ctrl, Shift and Alt resizing, min size, touch, releasing the mouse |
| `resize-history.test.js` | One resize = one edit and one undo step, drags that end early (blur, destroy, touch cancel) |
| `overlay.test.js` | Handles and cursors, overlay position, size badge, help tooltip |
| `options.test.js` | Every option, including style merging and custom `positions` |
| `read-only.test.js` | No resizing when the editor is disabled |
| `destroy.test.js` | Cleanup, and calling `destroy()` twice |
| `module.test.js` | The injected CSS, the constructor error, `show()` / `hide()` |

jsdom has no layout engine, so `tests/setup.js` stubs the few layout values Quill and the module read, and the overlay position test supplies its own element positions. The tests check the maths and the DOM, not how things look in a real browser, so still check the demo before releasing.
