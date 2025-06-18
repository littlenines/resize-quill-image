import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/ImageResize.js',
      name: 'ImageResize',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'cjs', "iife"],
    },
    rollupOptions: {
      external: ['quill'],
      output: {
        globals: {
          quill: 'Quill',
        },
      },
    },
  },
});
