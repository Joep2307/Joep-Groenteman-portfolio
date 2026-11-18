import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import wasm from 'vite-plugin-wasm';

const exe = resolve(import.meta.dirname, 'exe');

export default defineConfig({
    root: exe,
    appType: 'mpa',
    plugins: [wasm() as Plugin],
    // The apps live in exe/ but import their modules from ../src.
    server: { fs: { allow: [import.meta.dirname] } },
    build: {
        outDir: resolve(import.meta.dirname, 'dist'),
        emptyOutDir: true,
        // Images keep the URLs they have today: /img/name.jpg.
        assetsInlineLimit: 0,
        rolldownOptions: {
            input: {
                site: resolve(exe, 'index.html'),
                editor: resolve(exe, 'dev/index.html'),
            },
            output: {
                assetFileNames: ({ originalFileNames }) =>
                    originalFileNames[0]?.startsWith('img/')
                        ? 'img/[name][extname]'
                        : 'assets/[name]-[hash][extname]',
            },
        },
    },
});
