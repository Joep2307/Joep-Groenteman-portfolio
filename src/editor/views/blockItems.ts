import type { BlockItem } from './BlockItem';

/** The pieces of a section, each caption grouped with its image. */
export function blockItems(block: Element): BlockItem[] {
    const items: BlockItem[] = [];
    for (const el of block.children) {
        if (el.tagName === 'H4') continue;
        const previous = items.at(-1);
        if (
            el.classList.contains('panel-caption') &&
            previous?.type === 'image'
        ) {
            previous.nodes.push(el);
        } else if (el.tagName === 'IMG') {
            items.push({ type: 'image', nodes: [el] });
        } else if (el.tagName === 'P') {
            items.push({ type: 'text', nodes: [el] });
        } else if (el.classList.contains('cv-item')) {
            items.push({ type: 'entry', nodes: [el] });
        } else if (el.classList.contains('cv-langs')) {
            items.push({ type: 'languages', nodes: [el], fixed: true });
        } else {
            items.push({ type: 'other', nodes: [el], fixed: true });
        }
    }
    return items;
}
