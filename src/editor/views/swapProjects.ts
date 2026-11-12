import { moveBefore } from '../document/moveBefore';
import type { Project } from '../document/Project';
import { renumberCases } from '../document/renumberCases';

/** Swaps two neighbouring projects: their cards and their panels. */
export function swapProjects(
    doc: Document,
    items: readonly Project[],
    a: number,
    b: number,
): void {
    const first = items[Math.min(a, b)];
    const second = items[Math.max(a, b)];
    if (!first || !second) return;
    moveBefore([second.card], first.card);
    moveBefore([second.panel], first.panel);
    renumberCases(doc);
}
