/** The element a selector matches, where the page is expected to have one. */
export function need(root: ParentNode, selector: string): HTMLElement {
    const el = root.querySelector<HTMLElement>(selector);
    if (!el) throw new Error(`The page has no ${selector}.`);
    return el;
}
