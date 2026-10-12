import { afterEach, describe, expect, it } from 'vitest';
import { createEditor, destroyEditors, flush } from './helpers.js';

afterEach(destroyEditors);

describe('resize modes', () => {
  it('keeps the aspect ratio by default, following a horizontal drag', async () => {
    const editor = await createEditor();
    editor.click();
    await editor.drag({ x: 40, frames: 1 });

    expect(editor.screenSize()).toBe('140x70');
  });

  it('keeps the aspect ratio by default, following a vertical drag', async () => {
    const editor = await createEditor();
    editor.click();
    await editor.drag({ y: 20, frames: 1 });

    expect(editor.screenSize()).toBe('120x60');
  });

  it('resizes width and height independently with Ctrl', async () => {
    const editor = await createEditor();
    editor.click();
    await editor.drag({ x: 40, y: -10, frames: 1, ctrlKey: true });

    expect(editor.screenSize()).toBe('140x40');
  });

  it('changes only the height with Shift', async () => {
    const editor = await createEditor();
    editor.click();
    await editor.drag({ x: 40, y: 30, frames: 1, shiftKey: true });

    expect(editor.screenSize()).toBe('100x80');
  });

  it('changes only the width with Alt', async () => {
    const editor = await createEditor();
    editor.click();
    await editor.drag({ x: 40, y: 30, frames: 1, altKey: true });

    expect(editor.screenSize()).toBe('140x50');
  });

  it('never makes the image smaller than minWidth / minHeight', async () => {
    const editor = await createEditor({ options: { minWidth: 30, minHeight: 20 } });
    editor.click();
    await editor.drag({ x: -1000, frames: 1 });

    const [width, height] = editor.screenSize().split('x').map(Number);
    expect(width).toBeGreaterThanOrEqual(30);
    expect(width).toBeLessThan(100);
    expect(height).toBeGreaterThanOrEqual(20);
    expect(height).toBeLessThanOrEqual(50);
  });

  it('resizes with touch', async () => {
    const editor = await createEditor();
    editor.click();
    editor.touch('touchstart', editor.bottomRightHandle(), 0);
    editor.touch('touchmove', document, 40);
    editor.touch('touchend', document, 40);
    await flush();

    expect(editor.screenSize()).toBe('140x70');
    expect(editor.modelSize()).toBe('140x70');
  });

  it('stops resizing when the mouse is released', async () => {
    const editor = await createEditor();
    editor.click();
    await editor.drag({ x: 40, frames: 1 });
    editor.moveMouse(200);
    await flush();

    expect(editor.screenSize()).toBe('140x70');
  });
});
