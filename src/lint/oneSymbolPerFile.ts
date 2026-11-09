import { basename } from 'node:path';
import { ESLintUtils } from '@typescript-eslint/utils';
import type { Rule } from 'eslint';
import { symbolNames } from './symbolNames';

/** One symbol in each file, named after the file. constants.ts is exempt. */
export const oneSymbolPerFile = ESLintUtils.RuleCreator.withoutDocs({
    meta: {
        type: 'problem',
        schema: [],
        defaultOptions: [],
        messages: {
            tooMany: 'One symbol per file, but this one has: {{names}}.',
            wrongName: "'{{name}}' must be in a file called {{name}}.ts.",
        },
    },
    create(context) {
        const [fileName = ''] = basename(context.filename).split('.');
        if (fileName === 'constants') return {};
        return {
            Program(program) {
                const names = [...new Set(program.body.flatMap(symbolNames))];
                const [name] = names;
                if (names.length > 1) {
                    context.report({
                        node: program,
                        messageId: 'tooMany',
                        data: { names: names.join(', ') },
                    });
                } else if (name !== undefined && name !== fileName) {
                    context.report({
                        node: program,
                        messageId: 'wrongName',
                        data: { name },
                    });
                }
            },
        };
    },
}) as unknown as Rule.RuleModule;
