import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 8080,
    host: true // Allow external connections
  }
});
