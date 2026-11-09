import { MAGNETIC_SELECTOR } from './constants';

/**
 * Gives the elements `attachMagneticHover` moves their layout and easing.
 * Separate from it because this affects layout, so it cannot wait for the
 * wasm without the page shifting once it arrives.
 */
export function markMagnetic(doc: Document): void {
    doc.querySelectorAll(MAGNETIC_SELECTOR).forEach((el) => {
        el.classList.add('magnetic');
    });
}
