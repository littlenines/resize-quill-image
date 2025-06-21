import { forwardRef, useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import ImageResize from 'resize-quill-image';

if (!Quill.imports['modules/imageResize']) {
  Quill.register('modules/imageResize', ImageResize);
}

const Editor = forwardRef(
  ({ defaultValue }, ref) => {
    const toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video', 'formula'],

      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],

      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],

      ['clean']
    ];
    const containerRef = useRef(null);
    const defaultValueRef = useRef(defaultValue);

    useEffect(() => {
      const container = containerRef.current;
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement('div'),
      );
      const quill = new Quill(editorContainer, {
        modules: {
          syntax: true,
          toolbar: toolbarOptions,
          imageResize: true,
        },
        placeholder: 'Compose an epic...',
        theme: 'snow',
      });

      ref.current = quill;

      if (defaultValueRef.current) {
        quill.setContents(defaultValueRef.current);
      }

      // quill.on(Quill.events.TEXT_CHANGE, (...args) => {
      //   onTextChangeRef.current?.(...args);
      // });

      // quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
      //   onSelectionChangeRef.current?.(...args);
      // });

      return () => {
        ref.current = null;
        container.innerHTML = '';
        quill.disable();
        quill.root.innerHTML = '';
        const imageResize = quill.getModule('imageResize');
        if (imageResize && typeof imageResize.destroy === 'function') imageResize.destroy();
      };
    }, [ref]);

    return <div ref={containerRef}></div>;
  }
);

Editor.displayName = 'Editor';

export default Editor;