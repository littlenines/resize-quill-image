import { afterEach, describe, expect, it } from 'vitest';
import { createEditor, destroyEditors } from './helpers.js';

afterEach(destroyEditors);

describe('destroy()', () => {
  it('removes the no-selection class if an image is selected', async () => {
    const editor = await createEditor();
    editor.click();
    editor.imageResize.destroy();

    expect(editor.hasNoSelectionClass()).toBe(false);
  });

  it('removes the resize UI and stops responding to clicks', async () => {
    const editor = await createEditor();
    const children = editor.host.childElementCount;
    editor.click();
    editor.imageResize.destroy();

    expect(editor.host.childElementCount).toBe(children);
    editor.click();
    expect(editor.host.childElementCount).toBe(children);
  });

  it('can be called more than once', async () => {
    const editor = await createEditor();
    editor.imageResize.destroy();

    expect(() => editor.imageResize.destroy()).not.toThrow();
  });
});
