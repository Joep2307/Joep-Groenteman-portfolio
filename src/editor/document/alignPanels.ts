import { cvPanel } from './cvPanel';
import { moveBefore } from './moveBefore';
import { projects } from './projects';

/**
 * Puts the case studies in the order of their cards, ahead of the CV, so
 * Previous and Next step through them as the page lists them.
 */
export function alignPanels(doc: Document): void {
    const anchor = cvPanel(doc) ?? doc.querySelector('#overlay .panel-close');
    if (!anchor) return;
    moveBefore(
        projects(doc).map((project) => project.panel),
        anchor,
    );
}
