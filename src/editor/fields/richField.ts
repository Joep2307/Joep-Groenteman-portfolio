import { PAGE_PATH } from '../constants';
import type { EditorState } from '../EditorState';
import { hasCustomHtml } from '../markup/hasCustomHtml';
import { setMarkup } from '../markup/setMarkup';
import { toMarkup } from '../markup/toMarkup';
import { field } from './field';
import { registerField } from './registerField';
import type { RichFieldOptions } from './RichFieldOptions';

/**
 * A field for text that may hold bold, accent and line breaks. It is
 * read-only when the element holds other HTML, which would be lost.
 */
export function richField(
    state: EditorState,
    label: string,
    node: Element,
    options: RichFieldOptions = {},
): HTMLElement {
    const { skip, multiline = true, hint } = options;
    const custom = hasCustomHtml(node, skip);
    return registerField(
        state,
        node,
        field(
            state,
            label,
            toMarkup(node, skip),
            (value) => {
                setMarkup(node, value, skip);
            },
            {
                multiline,
                disabled: custom,
                hint: custom
                    ? `Contains custom HTML, so edit this one in ${PAGE_PATH}.`
                    : hint,
            },
        ),
    );
}
