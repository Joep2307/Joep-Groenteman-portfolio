import { addNode } from '../document/addNode';
import { removeGroup } from '../document/removeGroup';
import type { EditorState } from '../EditorState';
import { field } from '../fields/field';
import { clean } from '../util/clean';
import type { BlockItem } from './BlockItem';

/** A field for an image's caption, which only exists while it has text. */
export function captionField(
    state: EditorState,
    item: BlockItem,
): HTMLElement {
    const { nodes } = item;
    const [image] = nodes;
    return field(
        state,
        'Caption',
        clean(nodes[1]?.textContent),
        (value) => {
            if (!value.trim()) {
                if (nodes[1]) removeGroup({ nodes: nodes.splice(1) });
                return;
            }
            const block = image.parentElement;
            if (!block) return;
            let caption = nodes[1];
            if (!caption) {
                caption = addNode(
                    block,
                    '<p class="panel-caption"></p>',
                    image.nextElementSibling,
                );
                nodes[1] = caption;
            }
            caption.textContent = value;
        },
        { multiline: true },
    );
}
