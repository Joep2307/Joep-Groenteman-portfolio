import type { EditorState } from '../EditorState';
import { clean } from '../util/clean';
import { field } from './field';
import type { FieldOptions } from './FieldOptions';

/** A field for an element's plain text. */
export function textField(
    state: EditorState,
    label: string,
    node: Element,
    options?: FieldOptions,
): HTMLElement {
    return field(
        state,
        label,
        clean(node.textContent),
        (value) => {
            node.textContent = value;
        },
        options,
    );
}
