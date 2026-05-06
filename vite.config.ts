import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import basicSSL from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import commonjs from 'vite-plugin-commonjs'
import wasm from 'vite-plugin-wasm'

// https://vite.dev/config/
export default defineConfig({
  build: {
    target: 'esnext',
    // commonjsOptions: {
    // 	transformMixedEsModules: true
    // }
    chunkSizeWarningLimit: 10_000,
  },
  plugins: [
    commonjs({
      // filter(id) {
      //   // `node_modules` is exclude by default, so we need to include it explicitly
      //   // https://github.com/vite-plugin/vite-plugin-commonjs/blob/v0.7.0/src/index.ts#L125-L127
      //   id = id.replace('./pnpm', '')
      //   if (id.includes('node_modules/d3')) return true
      //   if (id.includes('node_modules/plotly.js')) return true
      //   if (id.includes('node_modules/elementary-circuits-directed-graph')) return true
      // },
    }),
    wasm(),
    react(),
    tailwindcss(),
    basicSSL(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    global: {},
  },
  optimizeDeps: {
    // exclude: ["plotly.js", "react-chart-editor", "plotly.js-dist-min"],
    rolldownOptions: {
      // define: {
      //   global: 'globalThis',
      // },
    },
  },
})
