/** An element of the editor's own interface that is known to be there. */
export function query(selector: string): HTMLElement {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) throw new Error(`The editor has no ${selector}.`);
    return el;
}
