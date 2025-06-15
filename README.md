<p align="center"> <h1 align="center">resize-quill-image</h1> </p>

*`resize-quill-image` is a lightweight Quill module that enables image resizing inside the editor.

This module was originally created because we needed a working image resize solution for our own project.  
Most existing Quill modules were either deprecated or not updated for the latest Quill versions.  
While there are a few small issues, they’re usually project-specific and not caused by the module itself.  
You can find these cases and their solutions in the [Problems](#problems) section.*

---
- [Installation](#installation)
- [Usage](#usage)
  - [Import the module](#1-import-the-module)
  - [Register the module with Quill](#2-register-the-module-with-quill)
  - [Configure the Quill editor](#3-configure-the-quill-editor)
- [Options](#options)
  - [Option Descriptions](#option-descriptions)
- [Cleanup / Destroy](#cleanup--destroy)
  - [Usage](#usage-1)
  - [When to use](#when-to-use)
  - [Example with unmount](#example-with-unmount)
- [Problems](#problems)
  - [Resize overlay goes outside the editor](#problem-resize-overlay-goes-outside-the-editor)
  - [Image resize handles and border do not appear](#problem-image-resize-handles-and-border-do-not-appear)
- [License](#license)

---

## 📦 [Installation](#installation)

```bash
npm install resize-quill-image
```

---

## [Usage](#usage)

### 1. Import the module

```js
import ImageResize from 'resize-quill-image';
```

### 2. Register the module with Quill

```js
Quill.register('modules/imageResize', ImageResize);
```

### 3. Configure the Quill editor

```js
const quill = new Quill(editorContainer, {
  modules: {
    syntax: true,
    toolbar: toolbarOptions,
    imageResize: true
  },
  placeholder: 'Compose an epic...',
  theme: 'snow'
});
```

---

## [Options](#options)

You can configure the behavior of `resize-quill-image` by passing options inside your Quill config:

```js
imageResize: {
  helpIcon: true,
  displaySize: true,
  styleSelection: true
}
```

### [Option Descriptions](#option-descriptions)

| Option           | Default | Description                                                                                                      |
|------------------|---------|------------------------------------------------------------------------------------------------------------------|
| `helpIcon`       | `true`  | Shows a `?` icon on the image overlay. Describes keyboard shortcuts:<br>• `Shift` → vertical<br>• `Alt` → horizontal<br>• `Ctrl` → custom/free resize |
| `displaySize`    | `true`  | Displays current image width and height as a badge while resizing.                                              |
| `styleSelection` | `true`  | Disables the blue selection overlay. To keep default behavior: `imageResize: { styleSelection: false }` |

---

## [Cleanup / Destroy](#cleanup--destroy)

If you're dynamically mounting and unmounting the Quill editor (for example in a Single Page Application or during route changes), it's important to properly **clean up** the `resize-quill-image` module to avoid memory leaks or event duplication.

This module provides a `destroy()` method that you can call when tearing down your Quill instance.

### [Usage](#usage-1)

Call the `destroy()` method on the `imageResize` module instance:

```js
const imageResizeModule = quill.getModule('imageResize');

if (imageResizeModule?.destroy) {
  imageResizeModule.destroy();
}
```

This will:

- Remove all event listeners (`click`, `selection-change`, `text-change`)
- Remove any visible resize overlays or handles
- Clean up drag and tooltip controllers
- Reset internal references for garbage collection

### [When to use](#when-to-use)

- If you're unmounting your editor component
- If you're switching pages in an SPA
- If you're reinitializing Quill manually

### [Example with unmount](#example-with-unmount)

```js
useEffect(() => {
  const quill = new Quill(editorRef.current, { ... });

  return () => {
    const module = quill.getModule('imageResize');
    if (module?.destroy) module.destroy();
  };
}, []);
```

This helps ensure your editor stays clean and efficient across mounts.

---

## [Problems](#problems)

### <ins>Problem: Resize overlay goes outside the editor</ins>

If your `.ql-container` has a fixed height like this:

```css
.ql-container {
  height: 500px;
}
```

Then the resize overlay may appear cut off or outside the bounds of the editor when the image goes beyond the height.

**Solution:**

Instead of a fixed height, use `min-height` and `max-height`:

```css
.ql-container {
  min-height: 500px;
  max-height: 500px;
}
```

This keeps the resize functionality working correctly and fully visible.

### <ins>Problem: Image resize handles and border do not appear</ins>

If you don't see the image resize handles or overlay border, make sure you’ve included `highlight.js`.  
Quill’s `syntax` module depends on it, and without it, modules like `imageResize` may silently fail to render overlays.

Add this to your HTML:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
```

More info in the Quill docs for newer highlight.js cdn version:  
https://quilljs.com/docs/modules/syntax#syntax-highlighter-module

## [License](#license)

MIT License  
Free for personal and commercial use.

---
> [!NOTE]
> If you encounter any bugs, memory leaks, or unexpected behavior, feel free to open an issue on the [GitHub repository](https://github.com/littlenines/resize-quill-image/issues).  
> Your feedback helps make the module better for everyone.
> If you want to contribute to the project — whether it's fixing a bug or improving performance — your contributions are welcome and appreciated.
