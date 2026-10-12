import Quill from 'quill';
import { afterEach, describe, expect, it } from 'vitest';
import ImageResize from '../src/ImageResize.js';
import { createEditor, destroyEditors } from './helpers.js';

afterEach(destroyEditors);

describe('the module', () => {
  it('adds the stylesheet that hides the selection highlight', () => {
    const styles = [...document.head.querySelectorAll('style')].map((style) => style.textContent);

    expect(styles.some((css) => css.includes('.no-selection::selection'))).toBe(true);
  });

  it('throws a clear error when the editor is not in the page', () => {
    const host = document.body.appendChild(document.createElement('div'));
    const quill = new Quill(host);
    quill.root.remove();

    expect(() => new ImageResize(quill, {})).toThrow('ImageResize: quill.root has no parentNode');
    host.remove();
  });

  it('can show and hide the resize UI with show() and hide()', async () => {
    const editor = await createEditor();

    editor.imageResize.show(editor.img);
    expect(editor.isShown()).toBe(true);

    editor.imageResize.hide();
    expect(editor.isShown()).toBe(false);
    expect(editor.overlays()).toHaveLength(0);
  });
});
