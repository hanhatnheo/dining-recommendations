import { defineConfig } from 'vitest/config'

export default defineConfig({
 test: {
   coverage: {
    provider: 'istanbul',
    reporter: ['text', 'json', 'html'],
    reportsDirectory: './tests/coverage',
    thresholds: {
        lines: 80,
      },
      exclude: [
        '**/node_modules/**',
        '**/.eslintrc.cjs/**',
        '**/dist/**',
        '**/main.jsx/**',
        './src/config/**',
      ],
   },
   environment: 'jsdom',
   globals: true,
   setupFiles: './tests/setup.js',
 },
})