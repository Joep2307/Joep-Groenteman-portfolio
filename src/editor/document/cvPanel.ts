/** The panel the "view CV" button in the bio opens. */
export function cvPanel(doc: Document): HTMLElement | null {
    const link = doc.querySelector<HTMLElement>('.about-bio [data-open]');
    return doc.getElementById(link?.dataset.open ?? '');
}
