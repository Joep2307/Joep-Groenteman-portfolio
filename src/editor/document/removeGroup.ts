import { leadingWs } from './leadingWs';

/** Removes an item's elements from the page, with their indentation. */
export function removeGroup(item: {
    readonly nodes: readonly Element[];
}): void {
    for (const el of item.nodes) {
        leadingWs(el)?.remove();
        el.remove();
    }
}
