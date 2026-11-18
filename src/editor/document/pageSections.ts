import { FIXED_SECTION_IDS } from '../constants';
import { clean } from '../util/clean';
import type { PageSection } from './PageSection';

/**
 * The page's sections in order, Intro left out: it stays at the top. The
 * sections every page has are fixed, so they can move but not go.
 */
export function pageSections(doc: Document): PageSection[] {
    const sections = doc.querySelectorAll<HTMLElement>('main > section');
    return [...sections]
        .filter((section) => section.id !== 'intro')
        .map((section) => ({
            section,
            rail: doc.querySelector<HTMLElement>(
                `.rail [data-target="${section.id}"]`,
            ),
            id: section.id,
            title:
                clean(section.querySelector('.section-title')?.textContent) ||
                'Untitled section',
            nodes: [section],
            fixed: FIXED_SECTION_IDS.includes(section.id),
        }));
}
