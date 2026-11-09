import type { EditorState } from '../EditorState';
import { textField } from '../fields/textField';
import type { ElementChild } from '../util/ElementChild';

/** The fields every section has: its heading and its navigation label. */
export function sectionFields(state: EditorState, id: string): ElementChild[] {
    const { doc } = state;
    const title = doc.getElementById(id)?.querySelector('.section-title');
    const rail = doc.querySelector(`.rail [data-target="${id}"] .label`);
    return [
        title ? textField(state, 'Section heading', title) : null,
        rail ? textField(state, 'Label in the side navigation', rail) : null,
    ];
}
