import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/ImageResize.js',
      name: 'ImageResize',
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['quill'],
      output: [
        { format: 'es', entryFileNames: 'index.es.js', globals: { quill: 'Quill' } },
        { format: 'cjs', entryFileNames: 'index.cjs.js', globals: { quill: 'Quill' } },
        {
          format: 'iife',
          name: 'ImageResize',
          entryFileNames: 'index.iife.js',
          globals: { quill: 'Quill' },
          banner: '(function(){if(typeof Quill!=="undefined"&&!Quill.Module)try{Quill.Module=Quill.import("core/module");}catch(e){}})();',
        },
      ],
    },
  },
});
