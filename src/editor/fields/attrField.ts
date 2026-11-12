import type { EditorState } from '../EditorState';
import { field } from './field';
import type { FieldOptions } from './FieldOptions';

/** A field for one attribute of an element. */
export function attrField(
    state: EditorState,
    label: string,
    node: Element,
    name: string,
    options?: FieldOptions,
): HTMLElement {
    return field(
        state,
        label,
        node.getAttribute(name) ?? '',
        (value) => {
            node.setAttribute(name, value);
        },
        options,
    );
}
