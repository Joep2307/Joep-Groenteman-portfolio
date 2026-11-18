import { insertNode } from './insertNode';

/**
 * Adds the element in `html` to `parent`, before `before` or at the end,
 * indented the way its new siblings are.
 */
export function addNode(
    parent: Element,
    html: string,
    before: Element | null = null,
): Element {
    const holder = parent.ownerDocument.createElement('div');
    holder.innerHTML = html.trim();
    const el = holder.firstElementChild;
    if (!el) throw new Error('addNode needs the HTML of one element.');
    return insertNode(parent, el, before);
}
