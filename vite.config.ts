import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // Express owns the HTTP server in preview and does not provide Vite's
      // WebSocket upgrade path. Keep HMR disabled so @vite/client is not injected.
      hmr: false,
      watch: null,
    },
  };
});
