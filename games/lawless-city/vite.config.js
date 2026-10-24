import { defineConfig } from 'vite';

// play/ é a versão estática que o Studio abre; os assets continuam em public/.
export default defineConfig({
  base: './',
  build: {
    outDir: 'play',
    emptyOutDir: true,
    copyPublicDir: false,
    chunkSizeWarningLimit: 1000,
  },
});
