import { addNode } from '../document/addNode';
import { need } from '../document/need';
import type { EditorState } from '../EditorState';
import { group } from '../fields/group';
import { richField } from '../fields/richField';
import { textField } from '../fields/textField';
import { listEditor } from '../lists/listEditor';
import { toItems } from '../lists/toItems';
import { h } from '../util/h';
import type { ViewContent } from './ViewContent';

export function viewIntro(state: EditorState): ViewContent {
    const { doc } = state;
    const meta = need(doc, '.hero-meta');
    const hero = group('Hero', [
        textField(
            state,
            'Label above the introduction',
            need(doc, '#intro .eyebrow'),
        ),
        richField(state, 'Title', need(doc, '.hero-title'), {
            hint:
                'Enter starts a new line. Wrap a word in *asterisks* to ' +
                'underline it with a coral bar.',
        }),
        richField(state, 'Introduction', need(doc, '.hero-sub')),
        textField(
            state,
            'Label in the side navigation',
            need(doc, '.rail [data-target="intro"] .label'),
        ),
    ]);
    const facts = group(
        'Facts under the introduction',
        listEditor(state, {
            key: 'meta',
            name: 'fact',
            items: toItems(meta.children),
            render: ({ nodes: [fact] }) =>
                h(
                    'div',
                    { class: 'two-up' },
                    textField(state, 'Label', need(fact, 'span')),
                    richField(state, 'Value', fact, {
                        skip: 'span',
                        multiline: false,
                    }),
                ),
            adds: [
                {
                    label: 'Add fact',
                    run: () => {
                        addNode(meta, '<div><span></span></div>');
                    },
                },
            ],
        }),
    );
    return { title: 'Intro', content: [hero, facts] };
}
