import type { ListItem } from './ListItem';

/** One list item for each element. */
export function toItems(elements: Iterable<Element>): ListItem[] {
    return [...elements].map((el) => ({ nodes: [el] }));
}
