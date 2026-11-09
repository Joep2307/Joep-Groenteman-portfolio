import { PANEL_BLOCK_HTML } from '../constants';
import { addNode } from '../document/addNode';
import { need } from '../document/need';
import type { EditorState } from '../EditorState';
import { textField } from '../fields/textField';
import type { ListAdd } from '../lists/ListAdd';
import { listEditor } from '../lists/listEditor';
import { toItems } from '../lists/toItems';
import { clean } from '../util/clean';
import { h } from '../util/h';
import { blockItems } from './blockItems';
import { renderBlockItem } from './renderBlockItem';

/**
 * A list editor for a panel's headed sections and what is in them. New
 * sections go in ahead of `before`; `adds` says what a section can gain.
 */
export function blocksEditor(
    state: EditorState,
    key: string,
    panel: Element,
    before: Element | null,
    adds: (block: Element) => readonly ListAdd[],
): HTMLElement {
    const blocks = [...panel.querySelectorAll(':scope > .panel-block')].filter(
        (block) => block.querySelector(':scope > h4'),
    );
    const headingOf = (block: Element): HTMLElement =>
        need(block, ':scope > h4');
    return listEditor(state, {
        key,
        name: 'section',
        items: toItems(blocks),
        confirmRemove: ({ nodes: [block] }) =>
            `Remove the “${clean(headingOf(block).textContent)}” section?`,
        render: ({ nodes: [block] }, i) => {
            const itemsKey = `${key}:${String(i)}:items`;
            return h(
                'div',
                {},
                textField(state, 'Section heading', headingOf(block)),
                listEditor(state, {
                    key: itemsKey,
                    name: 'item',
                    items: blockItems(block),
                    render: (item, j) =>
                        renderBlockItem(
                            state,
                            item,
                            `${itemsKey}:${String(j)}`,
                        ),
                    adds: adds(block),
                }),
            );
        },
        adds: [
            {
                label: 'Add section',
                run: () => {
                    addNode(panel, PANEL_BLOCK_HTML, before);
                },
            },
        ],
    });
}
