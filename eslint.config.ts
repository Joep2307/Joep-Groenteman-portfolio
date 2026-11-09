import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import { oneSymbolPerFile } from './src/lint/oneSymbolPerFile';

export default defineConfig(
    globalIgnores([
        'dist/',
        'coverage/',
        'test-results/',
        'playwright-report/',
        'src/geometry/pkg/',
        'src/geometry/target/',
    ]),
    tseslint.configs.strictTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            'max-len': ['error', { code: 79, tabWidth: 4, ignoreUrls: true }],
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_' },
            ],
        },
    },
    {
        files: ['src/**/*.ts'],
        ignores: [
            '**/*.d.ts',
            '**/*.test.ts',
            '**/*.smoke.ts',
            '**/*.visual.ts',
        ],
        plugins: {
            standards: { rules: { 'one-symbol-per-file': oneSymbolPerFile } },
        },
        rules: { 'standards/one-symbol-per-file': 'error' },
    },
);
