import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@emotion/styled'],
  },
  server: {
    port: 80,
    host: '0.0.0.0',
  },
});
