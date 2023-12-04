import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: false,
    lib: {
      entry: path.resolve(__dirname, 'src/LipSync.jsx'),
      name: "lip-sync",
      fileName: 'lip-sync',
      formats: ['es']
    },
    rollupOptions: {
      input: {
        'lip-sync': 'src/LipSync.jsx',
      },
      output: {
        preserveModules: true,
        dir: 'ejs',
        format: 'es',
        inlineDynamicImports: false
      },
      external: Object.keys(pkg.dependencies)
    }
  },
})
