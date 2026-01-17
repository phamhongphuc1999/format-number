import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      rollupTypes: true,
      insertTypesEntry: true,
    }),
  ],
  build: {
    minify: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'FormatNumber',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [],
    },
  },
});
