import { PAGE_PATH } from '../constants';
import type { EditorState } from '../EditorState';
import { imageField } from '../fields/imageField';
import { richField } from '../fields/richField';
import { h } from '../util/h';
import type { BlockItem } from './BlockItem';
import { captionField } from './captionField';
import { cvEntry } from './cvEntry';
import { languages } from './languages';

/** The fields for one piece of a section; `key` is unique to the piece. */
export function renderBlockItem(
    state: EditorState,
    item: BlockItem,
    key: string,
): HTMLElement {
    const [el] = item.nodes;
    switch (item.type) {
        case 'text':
            return richField(state, 'Paragraph', el);
        case 'image':
            return h(
                'div',
                {},
                imageField(state, 'Image', el),
                captionField(state, item),
            );
        case 'entry':
            return cvEntry(state, el, key, true);
        case 'languages':
            return languages(state, el, key);
        case 'other':
            return h(
                'p',
                { class: 'hint' },
                `Custom HTML. Edit this part in ${PAGE_PATH}.`,
            );
    }
}
