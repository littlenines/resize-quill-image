import { afterEach, describe, expect, it } from 'vitest';
import { createEditor, destroyEditors } from './helpers.js';

afterEach(destroyEditors);

describe('read-only mode', () => {
  it('does not show the resize UI', async () => {
    const editor = await createEditor({ readOnly: true });
    editor.click();

    expect(editor.isShown()).toBe(false);
    expect(editor.bottomRightHandle()).toBeUndefined();
  });

  it('does not resize an image that was selected before the editor was disabled', async () => {
    const editor = await createEditor();
    editor.click();
    editor.quill.disable();

    await editor.drag({ x: 40 });

    expect(editor.screenSize()).toBe('100x50');
    expect(editor.modelSize()).toBe('100x50');
  });

  it('hides the resize UI when the image is clicked after the editor was disabled', async () => {
    const editor = await createEditor();
    editor.click();
    editor.quill.disable();
    editor.click();

    expect(editor.isShown()).toBe(false);
    expect(editor.hasNoSelectionClass()).toBe(false);
  });
});
