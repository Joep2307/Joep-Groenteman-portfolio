import { customSections } from '../document/customSections';
import { cvPanel } from '../document/cvPanel';

/** The name of the view that edits an element of the page. */
export function viewForNode(doc: Document, el: Element): string {
    const card = el.closest('.case');
    if (card) {
        const link = card.querySelector<HTMLElement>('[data-open]');
        return `project:${link?.dataset.open ?? ''}`;
    }
    const panel = el.closest('.case-panel');
    if (panel) return panel === cvPanel(doc) ? 'cv' : `project:${panel.id}`;
    const section = el.closest('main > section');
    if (!section) return 'settings';
    return customSections(doc).includes(section)
        ? `section:${section.id}`
        : section.id || 'settings';
}
