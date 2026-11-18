/**
 * The element an archived part goes back into, if it is on the page. A
 * selector the page cannot take finds nothing.
 */
export function findHome(doc: Document, part: HTMLElement): Element | null {
    try {
        return doc.querySelector(part.dataset.home ?? '');
    } catch {
        return null;
    }
}
