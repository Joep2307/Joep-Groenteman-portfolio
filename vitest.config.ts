import type { Plugin } from 'vite';
import wasm from 'vite-plugin-wasm';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [wasm() as Plugin],
    test: {
        environment: 'jsdom',
        setupFiles: ['vitest.setup.ts'],
        include: ['src/**/*.test.ts'],
        coverage: {
            provider: 'v8',
            include: ['src/**/*.ts'],
            exclude: ['src/**/*.test.ts', 'src/smoke/**', 'src/geometry/**'],
        },
    },
});
