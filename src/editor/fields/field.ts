import type { EditorState } from '../EditorState';
import { changed } from '../shell/changed';
import { h } from '../util/h';
import { autosize } from './autosize';
import type { FieldOptions } from './FieldOptions';
import { nextFieldId } from './nextFieldId';

/** A labelled input that hands each change to `onChange`. */
export function field(
    state: EditorState,
    label: string,
    value: string,
    onChange: (value: string) => void,
    options: FieldOptions = {},
): HTMLElement {
    const { multiline = false, hint, type = 'text' } = options;
    const id = nextFieldId(state);
    const input = h(multiline ? 'textarea' : 'input', {
        id,
        placeholder: options.placeholder,
        list: options.list,
        disabled: options.disabled,
        rows: multiline ? 2 : null,
        type: multiline ? null : type,
        'aria-describedby': hint ? `${id}-hint` : null,
    });
    input.value = value;
    input.addEventListener('input', () => {
        onChange(input.value);
        if (input instanceof HTMLTextAreaElement) autosize(input);
        changed(state);
    });
    return h(
        'div',
        { class: 'field' },
        h('label', { for: id }, label),
        input,
        hint ? h('p', { class: 'hint', id: `${id}-hint` }, hint) : null,
    );
}
