// @vitest-environment node
import { RuleTester } from 'eslint';
import tseslint from 'typescript-eslint';
import { describe, it } from 'vitest';
import { oneSymbolPerFile } from './oneSymbolPerFile';

RuleTester.describe = describe;
RuleTester.it = it;

const tester = new RuleTester({
    languageOptions: { parser: tseslint.parser },
});

const inFile = (filename: string, code: string) => ({ filename, code });

tester.run('one-symbol-per-file', oneSymbolPerFile, {
    valid: [
        inFile('src/a/openPanel.ts', 'export function openPanel() {}'),
        inFile('src/a/limit.ts', 'export const limit = 3;'),
        inFile('src/a/Panel.ts', 'export interface Panel { id: string }'),
        inFile('src/a/Kind.ts', 'export type Kind = 1;'),
        inFile('src/a/run.ts', 'function run() {}\nexport { run };'),
        inFile('src/a/run.ts', 'export default function run() {}'),
        inFile('src/a/run.ts', 'function run() {}\nexport default run;'),
        inFile(
            'src/a/run.ts',
            'export function run(a: 1): void;\n' +
                'export function run(a: 2): void;\n' +
                'export function run(a: number) {}',
        ),
        inFile(
            'src/a/run.ts',
            "import { x } from './x';\nexport const run = x;",
        ),
        inFile('src/a/constants.ts', 'export const A = 1, B = 2;'),
        inFile('src/a/setup.ts', "import './x';"),
    ],
    invalid: [
        {
            ...inFile(
                'src/a/open.ts',
                'export function open() {}\nexport function close() {}',
            ),
            errors: [{ messageId: 'tooMany' }],
        },
        {
            ...inFile(
                'src/a/open.ts',
                'function helper() {}\nexport function open() {}',
            ),
            errors: [{ messageId: 'tooMany' }],
        },
        {
            ...inFile('src/a/open.ts', 'export const A = 1, B = 2;'),
            errors: [{ messageId: 'tooMany' }],
        },
        {
            ...inFile('src/a/open.ts', 'export function close() {}'),
            errors: [{ messageId: 'wrongName' }],
        },
        {
            ...inFile('src/a/open.ts', 'export default () => {};'),
            errors: [{ messageId: 'wrongName' }],
        },
        {
            ...inFile('src/a/open.ts', "export * from './x';"),
            errors: [{ messageId: 'wrongName' }],
        },
    ],
});
