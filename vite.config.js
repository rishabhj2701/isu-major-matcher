import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// The React plugin enables Fast Refresh and the automatic JSX runtime, so JSX
// files don't need an explicit `import React`.
// Tailwind v4 runs through its Vite plugin; we import only the theme + utility
// layers (no preflight) so the existing component CSS in styles.css is untouched.
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
