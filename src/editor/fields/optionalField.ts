import { addNode } from '../document/addNode';
import { removeGroup } from '../document/removeGroup';
import type { EditorState } from '../EditorState';
import { setMarkup } from '../markup/setMarkup';
import { toMarkup } from '../markup/toMarkup';
import { field } from './field';
import type { FieldOptions } from './FieldOptions';

/**
 * A field for an element that only exists while it has text: typing adds
 * it from `html`, ahead of whatever `before` returns, and clearing the
 * field removes it.
 */
export function optionalField(
    state: EditorState,
    label: string,
    parent: Element,
    selector: string,
    html: string,
    before: () => Element | null,
    options?: FieldOptions,
): HTMLElement {
    const find = (): Element | null => parent.querySelector(selector);
    const current = find();
    return field(
        state,
        label,
        current ? toMarkup(current) : '',
        (value) => {
            const existing = find();
            if (value.trim()) {
                setMarkup(existing ?? addNode(parent, html, before()), value);
            } else if (existing) {
                removeGroup({ nodes: [existing] });
            }
        },
        options,
    );
}
