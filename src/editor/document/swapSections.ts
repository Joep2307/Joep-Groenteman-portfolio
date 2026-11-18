import { moveBefore } from './moveBefore';
import type { PageSection } from './PageSection';
import { renumberSections } from './renumberSections';
import { syncRail } from './syncRail';

/** Swaps two neighbouring sections, their navigation items following. */
export function swapSections(
    doc: Document,
    items: readonly PageSection[],
    a: number,
    b: number,
): void {
    const first = items[Math.min(a, b)];
    const second = items[Math.max(a, b)];
    if (!first || !second) return;
    moveBefore([second.section], first.section);
    syncRail(doc);
    renumberSections(doc);
}
