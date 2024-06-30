import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setupTests.js'],
    transformMode: {
      web: [/.[tj]sx?$/],
    },
  },
});