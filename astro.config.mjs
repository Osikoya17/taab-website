// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // React only for the interactive app previews; everything else ships as plain HTML.
  integrations: [react()],
});
