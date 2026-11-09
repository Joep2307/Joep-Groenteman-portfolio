import { pad } from '../util/pad';

/** Makes each section's number follow its position. */
export function renumberSections(doc: Document): void {
    doc.querySelectorAll('main > section .section-num').forEach((num, i) => {
        num.textContent = pad(i + 1);
    });
}
