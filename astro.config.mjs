import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV || 'production', process.cwd(), '');

export default defineConfig({
  output: 'static',
  site: process.env.SITE_URL || env.SITE_URL || 'https://omnidev.example',
  base: process.env.BASE_PATH || env.BASE_PATH || '/',
});
