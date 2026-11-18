import type { PageSection } from '../document/PageSection';

/** The name of the view that edits a section of the page. */
export function sectionView(item: PageSection): string {
    return item.fixed ? item.id : `section:${item.id}`;
}
