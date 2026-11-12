import type { EditorState } from '../EditorState';
import { clean } from '../util/clean';
import { field } from './field';
import { textField } from './textField';

/**
 * A field for a project's label. Its "CASE 01" prefix follows the
 * project's position, so only the rest is editable.
 */
export function caseLabelField(
    state: EditorState,
    label: string,
    node: Element,
): HTMLElement {
    const numberOf = (): string | undefined =>
        /^CASE \d+/.exec(clean(node.textContent))?.[0];
    const prefix = numberOf();
    if (prefix === undefined) return textField(state, label, node);
    const rest = clean(node.textContent)
        .slice(prefix.length)
        .replace(/^\s*[—-]\s*/, '');
    return field(
        state,
        label,
        rest,
        (value) => {
            const current = numberOf() ?? prefix;
            const text = value.trim();
            node.textContent = text ? `${current} — ${text}` : current;
        },
        {
            hint:
                `Shown after “${prefix} —”. The number follows the ` +
                "project's position.",
        },
    );
}
