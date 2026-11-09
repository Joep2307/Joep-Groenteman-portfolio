import { addNode } from '../document/addNode';
import { leadText } from '../document/leadText';
import { need } from '../document/need';
import type { EditorState } from '../EditorState';
import { field } from '../fields/field';
import { textField } from '../fields/textField';
import { listEditor } from '../lists/listEditor';
import { toItems } from '../lists/toItems';
import { clean } from '../util/clean';
import { h } from '../util/h';

/** A list editor for the CV's languages; `key` is unique to the list. */
export function languages(
    state: EditorState,
    list: Element,
    key: string,
): HTMLElement {
    return h(
        'div',
        {},
        h('p', { class: 'field-label' }, 'Languages'),
        listEditor(state, {
            key: `${key}:langs`,
            name: 'language',
            items: toItems(list.children),
            // Each reads "Language <span>Level</span>".
            render: ({ nodes: [li] }) =>
                h(
                    'div',
                    { class: 'two-up' },
                    field(
                        state,
                        'Language',
                        clean(leadText(li).data),
                        (value) => {
                            leadText(li).data = value;
                        },
                    ),
                    textField(state, 'Level', need(li, 'span')),
                ),
            adds: [
                {
                    label: 'Add language',
                    run: () => {
                        addNode(list, '<li><span></span></li>');
                    },
                },
            ],
        }),
    );
}
