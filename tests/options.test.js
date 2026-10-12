import { afterEach, describe, expect, it } from 'vitest';
import { createEditor, destroyEditors } from './helpers.js';

afterEach(destroyEditors);

describe('options', () => {
  it('shows the size badge and help icon by default', async () => {
    const editor = await createEditor();
    editor.click();

    expect(editor.overlay().textContent).toContain('100 × 50');
    expect(editor.overlay().textContent).toContain('?');
  });

  it('hides the size badge with displaySize: false', async () => {
    const editor = await createEditor({ options: { displaySize: false } });
    editor.click();

    expect(editor.overlay().textContent).not.toContain('×');
  });

  it('hides the help icon with helpIcon: false', async () => {
    const editor = await createEditor({ options: { helpIcon: false } });
    editor.click();

    expect(editor.overlay().textContent).not.toContain('?');
  });

  it('leaves the text selection highlight alone with styleSelection: false', async () => {
    const editor = await createEditor({ options: { styleSelection: false } });
    editor.click();

    expect(editor.isShown()).toBe(true);
    expect(editor.hasNoSelectionClass()).toBe(false);
  });

  it('uses a custom noSelectionClass', async () => {
    const editor = await createEditor({ options: { noSelectionClass: 'my-no-selection' } });
    editor.click();

    expect(editor.hasNoSelectionClass('my-no-selection')).toBe(true);
    expect(editor.hasNoSelectionClass()).toBe(false);
  });

  it('merges handleStyles with the defaults', async () => {
    const editor = await createEditor({ options: { handleStyles: { backgroundColor: 'red' } } });
    editor.click();

    const handle = editor.bottomRightHandle();
    expect(handle.style.backgroundColor).toBe('red');
    expect(handle.style.width).toBe('15px');
  });

  it('merges overlayStyles with the defaults', async () => {
    const editor = await createEditor({ options: { overlayStyles: { border: '2px solid red' } } });
    editor.click();

    expect(editor.overlay().style.border).toBe('2px solid red');
    expect(editor.overlay().style.boxSizing).toBe('border-box');
  });

  it('merges displaySizeStyles with the defaults', async () => {
    const editor = await createEditor({ options: { displaySizeStyles: { color: 'red' } } });
    editor.click();

    expect(editor.badge().style.color).toBe('red');
    expect(editor.badge().style.fontSize).toBe('12px');
  });

  it('places handles where positions says', async () => {
    const positions = [{ top: 0, left: 0 }, { bottom: 0, right: 0 }];
    const editor = await createEditor({ options: { positions } });
    editor.click();

    const handles = editor.handles();
    expect(handles).toHaveLength(2);
    expect([handles[0].style.top, handles[0].style.left]).toEqual(['0px', '0px']);
    expect([handles[1].style.bottom, handles[1].style.right]).toEqual(['0px', '0px']);
  });
});
