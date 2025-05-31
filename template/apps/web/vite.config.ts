import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  server: {
    port: process.env.PORT ? Number.parseInt(process.env.PORT) : 8080,
    host: true, // Allow external connections
  },
});
