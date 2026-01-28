import { defineConfig } from 'astro/config';
import image from '@astrojs/image';

export default defineConfig({
  integrations: [image({ serviceEntryPoint: '@astrojs/image/sharp' })],
  vite: {
    build: {
      minify: 'terser'
    }
  },
  experimental: {
    viewTransitions: true,
  },
});
