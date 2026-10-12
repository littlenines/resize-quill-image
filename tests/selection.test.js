import { afterEach, describe, expect, it, vi } from 'vitest';
import { IMAGE, createEditor, destroyEditors, flush } from './helpers.js';

afterEach(destroyEditors);

describe('selecting an image', () => {
  it('shows the resize UI when the image is clicked', async () => {
    const editor = await createEditor();
    editor.click();

    expect(editor.isShown()).toBe(true);
    expect(editor.handles()).toHaveLength(4);
    expect(editor.hasNoSelectionClass()).toBe(true);
  });

  it('shows the resize UI when exactly the image is selected', async () => {
    const editor = await createEditor();
    editor.quill.setSelection(editor.imageIndex, 1, 'user');
    await flush();

    expect(editor.isShown()).toBe(true);
    expect(editor.hasNoSelectionClass()).toBe(true);
  });

  it('does not show the resize UI for a cursor just before the image', async () => {
    const editor = await createEditor();
    editor.quill.setSelection(editor.imageIndex, 0, 'user');
    await flush();

    expect(editor.isShown()).toBe(false);
    expect(editor.hasNoSelectionClass()).toBe(false);
  });

  it('does not show the resize UI for a selection that runs past the image', async () => {
    const editor = await createEditor();
    editor.quill.setSelection(editor.imageIndex, 3, 'user');
    await flush();

    expect(editor.isShown()).toBe(false);
  });

  it('ignores clicks on text', async () => {
    const editor = await createEditor();
    editor.quill.root.firstChild.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(editor.isShown()).toBe(false);
    expect(editor.overlays()).toHaveLength(0);
    expect(editor.hasNoSelectionClass()).toBe(false);
  });

  it('shows one overlay when the same image is clicked twice', async () => {
    const editor = await createEditor();
    editor.click();
    editor.click();

    expect(editor.overlays()).toHaveLength(1);
  });

  it('moves the resize UI to another image when it is clicked', async () => {
    const editor = await createEditor();
    editor.quill.insertEmbed(editor.quill.getLength() - 1, 'image', IMAGE, 'api');
    const second = editor.quill.root.querySelectorAll('img')[1];

    editor.click();
    editor.click(second);

    expect(editor.isShown(second)).toBe(true);
    expect(editor.overlays()).toHaveLength(1);
  });
});

describe('deselecting an image', () => {
  it('hides the UI and restores the text selection highlight when the cursor moves to text', async () => {
    const editor = await createEditor();
    editor.click();
    editor.quill.setSelection(0, 0, 'user');
    await flush();

    expect(editor.isShown()).toBe(false);
    expect(editor.hasNoSelectionClass()).toBe(false);
  });

  it('hides the UI when the editor loses the selection', async () => {
    const editor = await createEditor();
    editor.click();
    editor.quill.setSelection(null);
    await flush();

    expect(editor.isShown()).toBe(false);
  });

  it('hides the UI when the selected image is deleted', async () => {
    const editor = await createEditor();
    editor.click();
    editor.quill.deleteText(editor.imageIndex, 1, 'user');
    await flush();

    expect(editor.isShown()).toBe(false);
    expect(editor.hasNoSelectionClass()).toBe(false);
  });

  it('keeps the UI when other content changes', async () => {
    const editor = await createEditor();
    editor.click();
    editor.quill.insertText(editor.quill.getLength() - 1, '!', 'api');
    await flush();

    expect(editor.isShown()).toBe(true);
  });
});

describe('moving the cursor through text', () => {
  it('does not make Quill rebuild its copy of the document', async () => {
    const editor = await createEditor({ paragraphs: 50 });
    const rebuild = vi.spyOn(editor.quill.editor, 'update');

    for (let i = 0; i < 20; i++) {
      editor.quill.setSelection(20 + i * 5, 0, 'user');
      await flush();
    }

    expect(rebuild).not.toHaveBeenCalled();
  });
});
