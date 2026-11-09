import { addNode } from '../document/addNode';
import type { EditorState } from '../EditorState';
import { richField } from '../fields/richField';
import { h } from '../util/h';
import { listEditor } from './listEditor';
import { toItems } from './toItems';

/** A list editor for the paragraphs directly inside `parent`. */
export function paragraphList(
    state: EditorState,
    key: string,
    parent: Element,
    before: Element | null,
    intro: string,
): HTMLElement {
    const paragraphs = [...parent.children].filter((el) => el.tagName === 'P');
    return h(
        'div',
        {},
        h('p', { class: 'field-label' }, 'Paragraphs'),
        h('p', { class: 'hint before-list' }, intro),
        listEditor(state, {
            key,
            name: 'paragraph',
            items: toItems(paragraphs),
            render: (item, i) =>
                richField(state, `Paragraph ${String(i + 1)}`, item.nodes[0]),
            adds: [
                {
                    label: 'Add paragraph',
                    run: () => {
                        addNode(parent, '<p></p>', before);
                    },
                },
            ],
        }),
    );
}
