import { afterEach, describe, expect, it, vi } from 'vitest';
import { createEditor, destroyEditors, flush } from './helpers.js';

afterEach(destroyEditors);

describe('recording a resize', () => {
  it('records the final size as one edit', async () => {
    const editor = await createEditor();
    const onTextChange = vi.fn();
    editor.quill.on('text-change', onTextChange);

    editor.click();
    await editor.drag({ x: 40 });

    expect(editor.screenSize()).not.toBe('100x50');
    expect(editor.modelSize()).toBe(editor.screenSize());
    expect(onTextChange).toHaveBeenCalledTimes(1);
    expect(editor.quill.history.stack.undo).toHaveLength(1);
  });

  it('keeps the old size in Quill until the mouse is released', async () => {
    const editor = await createEditor();
    editor.click();
    await editor.startDrag({ x: 40, frames: 3 });

    expect(editor.screenSize()).not.toBe('100x50');
    expect(editor.modelSize()).toBe('100x50');

    editor.release();
    await flush();
    expect(editor.modelSize()).toBe(editor.screenSize());
  });

  it('restores the original size with a single undo', async () => {
    const editor = await createEditor();
    editor.click();
    await editor.drag({ x: 40 });

    editor.quill.history.undo();
    await flush();

    expect(editor.modelSize()).toBe('100x50');
    expect(editor.screenSize()).toBe('100x50');
  });
});

describe('a drag that ends early', () => {
  it('records the size when the window loses focus, and keeps recording edits afterwards', async () => {
    const editor = await createEditor();
    editor.click();
    editor.pressHandle();
    editor.moveMouse(40);
    window.dispatchEvent(new window.FocusEvent('blur'));
    await flush();
    expect(editor.modelSize()).toBe(editor.screenSize());

    const onTextChange = vi.fn();
    editor.quill.on('text-change', onTextChange);
    editor.quill.insertText(0, 'X', 'user');
    expect(onTextChange).toHaveBeenCalledTimes(1);
    expect(editor.quill.getText()).toMatch(/^XHi/);
  });

  it('records the size when the module is destroyed, and keeps recording edits afterwards', async () => {
    const editor = await createEditor();
    editor.click();
    editor.pressHandle();
    editor.moveMouse(40);
    editor.imageResize.destroy();
    await flush();
    expect(editor.modelSize()).toBe(editor.screenSize());

    const onTextChange = vi.fn();
    editor.quill.on('text-change', onTextChange);
    editor.quill.insertText(0, 'X', 'user');
    expect(onTextChange).toHaveBeenCalledTimes(1);
  });

  it('records the size when a touch is cancelled', async () => {
    const editor = await createEditor();
    editor.click();
    editor.touch('touchstart', editor.bottomRightHandle(), 0);
    editor.touch('touchmove', document, 40);
    editor.touch('touchcancel', document, 40);
    await flush();

    expect(editor.modelSize()).toBe('140x70');
  });
});
