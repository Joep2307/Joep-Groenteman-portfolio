import type { ListItem } from '../lists/ListItem';
import { moveBefore } from './moveBefore';

/** Swaps two neighbouring items on the page. */
export function swapGroups(
    items: readonly ListItem[],
    a: number,
    b: number,
): void {
    const first = items[Math.min(a, b)];
    const second = items[Math.max(a, b)];
    if (first && second) moveBefore(second.nodes, first.nodes[0]);
}
