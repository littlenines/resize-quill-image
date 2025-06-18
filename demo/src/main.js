
import javascriptLogo from './javascript.svg';
import viteLogo from '/vite.svg';

import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import ImageResize from '../../src/ImageResize';

document.querySelector('#app').innerHTML = `
  <div>
    <img src="${viteLogo}" class="logo" alt="Vite logo" />
    <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />

    <div id="editor"></div>

    <p>Delta Testing: Save the image after resizing ( locale storage ) -> Delete the image -> Click Load and it should be the same size and image you resized </p>
    <button id="save">💾 Save</button>
    <button id="load">🔄 Load</button>

  </div>
`;

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

Quill.register('modules/imageResize', ImageResize);

const quill = new Quill('#editor', {
  modules: {
    syntax: true,
    toolbar: toolbarOptions,
    imageResize: true,
  },
  placeholder: 'Compose an epic...',
  theme: 'snow',
});

// Quick testing for Delta 
document.getElementById('save').addEventListener('click', () => {
  const delta = quill.getContents();
  localStorage.setItem('quill-article', JSON.stringify(delta));
  alert('Saved!');
});

document.getElementById('load').addEventListener('click', () => {
  const data = localStorage.getItem('quill-article');
  if (data) quill.setContents(JSON.parse(data));
});

