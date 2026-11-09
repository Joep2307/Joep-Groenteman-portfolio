import type { EditorState } from '../EditorState';
import { clean } from '../util/clean';
import { field } from './field';

/** A comma-separated field for a row of tags. */
export function tagsField(
    state: EditorState,
    label: string,
    container: Element,
): HTMLElement {
    const tags = [...container.children]
        .map((tag) => clean(tag.textContent))
        .join(', ');
    return field(
        state,
        label,
        tags,
        (value) => {
            const names = value.split(',').map(clean).filter(Boolean);
            container.replaceChildren(
                ...names.map((name) => {
                    const span = container.ownerDocument.createElement('span');
                    span.textContent = name;
                    return span;
                }),
            );
        },
        { hint: 'Separate tags with commas.' },
    );
}
