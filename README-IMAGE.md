To enable Astro image integration locally or in CI:

1. Run locally: npm install @astrojs/image sharp
2. Ensure your environment (Linux/Mac/Windows) has required build tools for sharp (CI images usually do).
3. Keep astro.config.mjs integrations: [image({ service: 'sharp' })]
4. Use the Image component: import { Image } from 'astro:assets' and <Image src="/assets/img/header-bg.jpg" widths={[800,1200,1800]} formats={["avif","webp","jpeg"]} />

If you prefer not to install, use an offline script to generate webp/avif and resized images into public/assets/img and reference them with <picture> or srcset.
