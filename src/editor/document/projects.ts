import { clean } from '../util/clean';
import type { Project } from './Project';

/** The projects in page order; cards without a panel are left out. */
export function projects(doc: Document): Project[] {
    const cards = doc.querySelectorAll<HTMLElement>('.cases > .case');
    return [...cards].flatMap((card): Project[] => {
        const link = card.querySelector<HTMLElement>('[data-open]');
        const panel = link && doc.getElementById(link.dataset.open ?? '');
        if (!panel) return [];
        const title = clean(card.querySelector('.case-title')?.textContent);
        return [{ card, panel, id: panel.id, title, nodes: [card] }];
    });
}
