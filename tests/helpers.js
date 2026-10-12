import Quill from 'quill';
import ImageResize from '../src/ImageResize.js';

Quill.register('modules/imageResize', ImageResize, true);

export const IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';
const editors = [];

export const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

export async function createEditor({ readOnly = false, paragraphs = 0, options = true } = {}) {
  const host = document.body.appendChild(document.createElement('div'));
  const quill = new Quill(host, {
    readOnly,
    modules: { imageResize: options, history: { delay: 0 } },
  });

  const ops = [
    { insert: 'Hi ' },
    { insert: { image: IMAGE }, attributes: { width: '100', height: '50' } },
    { insert: ' there\n' },
  ];
  for (let i = 0; i < paragraphs; i++) ops.push({ insert: `Paragraph ${i} with some text.\n` });
  quill.setContents(ops, 'api');
  quill.history.clear();
  await flush();

  const imageResize = quill.getModule('imageResize');
  const img = quill.root.querySelector('img');
  const overlayChildren = () => [...(editor.overlay()?.children ?? [])];

  const editor = {
    quill,
    imageResize,
    img,
    host,
    imageIndex: 'Hi '.length,

    isShown: (image = img) => imageResize.uiController?.img === image,
    hasNoSelectionClass: (name = 'no-selection') => quill.root.classList.contains(name),
    screenSize: () => `${img.getAttribute('width')}x${img.getAttribute('height')}`,
    modelSize() {
      const op = quill.getContents().ops.find((o) => typeof o.insert === 'object');
      return `${op.attributes?.width}x${op.attributes?.height}`;
    },

    overlays: () => [...host.children].filter((el) => el !== quill.root && el.style.position === 'absolute'),
    overlay: () => editor.overlays()[0] ?? null,
    handles: () => overlayChildren().filter((el) => el.style.cursor.endsWith('-resize')),
    bottomRightHandle: () => editor.handles()[3],
    badge: () => overlayChildren().find((el) => el.textContent.includes('×')),
    helpIcon: () => overlayChildren().find((el) => el.textContent === '?'),
    tooltip: () => overlayChildren().find((el) => el.textContent.includes('Shift for vertical')),

    click: (image = img) => image.dispatchEvent(new MouseEvent('click', { bubbles: true })),
    pressHandle: () =>
      editor.bottomRightHandle()?.dispatchEvent(
        new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: 0, clientY: 0 }),
      ),
    moveMouse: (clientX, clientY = 0, modifiers = {}) =>
      document.dispatchEvent(new MouseEvent('mousemove', { clientX, clientY, ...modifiers })),
    release: () => document.dispatchEvent(new MouseEvent('mouseup')),

    async startDrag({ x = 0, y = 0, frames = 10, ...modifiers } = {}) {
      editor.pressHandle();
      for (let i = 1; i <= frames; i++) {
        editor.moveMouse((x * i) / frames, (y * i) / frames, modifiers);
        await flush();
      }
    },

    async drag(movement) {
      await editor.startDrag(movement);
      editor.release();
      await flush();
    },

    touch(type, target, clientX) {
      const event = new Event(type, { bubbles: true, cancelable: true });
      Object.defineProperty(event, 'changedTouches', { value: [{ clientX, clientY: 0 }] });
      target.dispatchEvent(event);
    },
  };

  editors.push(editor);
  return editor;
}

export function destroyEditors() {
  for (const { imageResize, host } of editors.splice(0)) {
    imageResize.destroy();
    host.remove();
  }
}
