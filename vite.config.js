import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The React plugin enables Fast Refresh and the automatic JSX runtime, so JSX
// files don't need an explicit `import React`. Without it, Vite's default
// esbuild uses the classic runtime and JSX fails at runtime with
// "React is not defined".
export default defineConfig({
  plugins: [react()],
});
