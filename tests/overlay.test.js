import { afterEach, describe, expect, it } from 'vitest';
import { createEditor, destroyEditors, flush } from './helpers.js';

afterEach(destroyEditors);

describe('the overlay', () => {
  it('has four corner handles with matching resize cursors', async () => {
    const editor = await createEditor();
    editor.click();

    expect(editor.handles().map((handle) => handle.style.cursor)).toEqual([
      'nwse-resize',
      'nesw-resize',
      'nesw-resize',
      'nwse-resize',
    ]);
  });

  it('is removed with its handles when the image is deselected', async () => {
    const editor = await createEditor();
    editor.click();
    editor.quill.setSelection(0, 0, 'user');
    await flush();

    expect(editor.overlays()).toHaveLength(0);
  });

  it('sits over the image', async () => {
    const editor = await createEditor();
    editor.img.getBoundingClientRect = () => ({ left: 50, top: 30, width: 100, height: 50 });
    editor.host.getBoundingClientRect = () => ({ left: 10, top: 10, width: 500, height: 300 });
    editor.click();

    const { left, top, width, height } = editor.overlay().style;
    expect({ left, top, width, height }).toEqual({ left: '39px', top: '20px', width: '100px', height: '50px' });
  });

  it('moves with the image when the content changes', async () => {
    const editor = await createEditor();
    editor.host.getBoundingClientRect = () => ({ left: 10, top: 10, width: 500, height: 300 });
    editor.img.getBoundingClientRect = () => ({ left: 50, top: 30, width: 100, height: 50 });
    editor.click();

    editor.img.getBoundingClientRect = () => ({ left: 60, top: 80, width: 100, height: 50 });
    editor.quill.insertText(editor.quill.getLength() - 1, '!', 'api');
    await flush();

    expect(editor.overlay().style.left).toBe('49px');
    expect(editor.overlay().style.top).toBe('70px');
  });
});

describe('the size badge', () => {
  it('shows the image size', async () => {
    const editor = await createEditor();
    editor.click();

    expect(editor.badge().textContent).toBe('100 × 50');
  });

  it('updates while resizing', async () => {
    const editor = await createEditor();
    editor.click();
    await editor.startDrag({ x: 40, frames: 1 });

    expect(editor.badge().textContent).toBe('140 × 70');
  });

  it('sits outside small images and inside large ones', async () => {
    const editor = await createEditor();
    editor.click();
    expect(editor.badge().style.right).toMatch(/^-/);

    await editor.drag({ x: 100, frames: 1 });
    expect(editor.badge().style.right).toBe('20px');
  });
});

describe('the help icon', () => {
  it('shows the keyboard shortcuts on hover', async () => {
    const editor = await createEditor();
    editor.click();
    const tooltip = editor.tooltip();

    expect(tooltip.style.display).toBe('none');
    expect([...tooltip.children].map((line) => line.textContent)).toEqual([
      'Shift for vertical',
      'Ctrl for custom',
      'Alt for horizontal',
    ]);

    editor.helpIcon().dispatchEvent(new MouseEvent('mouseenter'));
    expect(tooltip.style.display).toBe('block');

    editor.helpIcon().dispatchEvent(new MouseEvent('mouseleave'));
    expect(tooltip.style.display).toBe('none');
  });
});
