'use strict';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
// import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

const __dirname = import.meta.dirname;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  /*optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true
        })
      ]
    }
  },*/
  // resolve: {
  //   alias: {
  //     process: "process/browser",
  //     util: "util",
  //     web3: path.resolve(__dirname, "./node_modules/web3/dist/web3.min.js"),
  //     pg: path.resolve(__dirname, "./node_modules/pg"),
  //   },
  // },
  })
