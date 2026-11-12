import { attachCaseTilt } from './attachCaseTilt';
import { attachHeroGlow } from './attachHeroGlow';
import { attachMagneticHover } from './attachMagneticHover';
import { attachPanels } from './attachPanels';
import { attachScrollProgress } from './attachScrollProgress';
import { attachTopnavScroll } from './attachTopnavScroll';
import { loadGeometry } from './loadGeometry';
import { markMagnetic } from './markMagnetic';
import type { MountSiteOptions } from './MountSiteOptions';
import { observeCaseReveal } from './observeCaseReveal';
import { observeRail } from './observeRail';
import { prefersReducedMotion } from './prefersReducedMotion';

/**
 * Wires the site's behaviour into a document. The editor preview calls this
 * on the document in its frame, so it only touches `doc`. Everything needed
 * to read and navigate the page is in place when it returns; the effects
 * that need the wasm geometry follow once that has loaded, if it does.
 */
export function mountSite(
    doc: Document,
    options: MountSiteOptions = {},
): void {
    const view = doc.defaultView;
    if (!view) return;

    const motion = !prefersReducedMotion(view);
    if (motion) markMagnetic(doc);
    attachTopnavScroll(doc);
    observeRail(doc, view);
    if (options.revealCases) {
        doc.querySelectorAll('.case').forEach((item) => {
            item.classList.add('in-view');
        });
    } else {
        observeCaseReveal(doc, view);
    }
    attachPanels(doc, view, options.initialPanel);

    void loadGeometry().then((geometry) => {
        // The editor may have replaced the preview frame by now.
        if (!geometry || !doc.defaultView) return;
        attachScrollProgress(doc, geometry);
        if (motion) {
            attachCaseTilt(doc, geometry);
            attachMagneticHover(doc, geometry);
            attachHeroGlow(doc, view, geometry);
        }
    });
}
