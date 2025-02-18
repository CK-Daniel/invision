import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default (props: { mode: string }) => {
  // Load app-level env vars to node-level env vars.
  process.env = { ...process.env, ...loadEnv(props.mode, process.cwd()) };

  return defineConfig({
    plugins: [react(), svgr()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://backend:8080',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
          timeout: 60000,
          proxyTimeout: 60000
        },
        '/static': {
          target: 'http://backend:8080',
          changeOrigin: true,
          secure: false
        },
        '/projects': {
          target: 'http://backend:8080',
          changeOrigin: true,
          secure: false,
          bypass: (req) => {
            if (req.headers.accept?.includes('text/html')) {
              return '/index.html';
            }
          }
        }
      }
    }
  });
};
