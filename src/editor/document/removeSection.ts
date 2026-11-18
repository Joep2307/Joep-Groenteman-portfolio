import type { PageSection } from './PageSection';
import { removeGroup } from './removeGroup';
import { renumberSections } from './renumberSections';

/** Removes a section and its item in the navigation. */
export function removeSection(doc: Document, item: PageSection): void {
    const { section, rail } = item;
    removeGroup({ nodes: rail ? [section, rail] : [section] });
    renumberSections(doc);
}
