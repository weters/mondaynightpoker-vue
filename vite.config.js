import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(process.env.VITE_APP_VERSION || 'dev'),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        // every component style block gets the design tokens/mixins injected;
        // variables.scss itself must not import itself
        additionalData(source, filename) {
          if (filename.endsWith('variables.scss')) {
            return source
          }
          return '@use "@/variables" as *;\n' + source
        },
      },
    },
  },
  server: {
    port: 8080,
    cors: false,
    host: 'localhost',
    strictPort: true,
  },
  build: {
    sourcemap: false,
  },
  test: {
    environment: 'jsdom',
    globals: false,
    include: ['src/**/*.spec.js'],
  },
})
