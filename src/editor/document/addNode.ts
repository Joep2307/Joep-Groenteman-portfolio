import { leadingWs } from './leadingWs';

/**
 * Adds the element in `html` to `parent`, before `before` or at the end,
 * indented the way its new siblings are.
 */
export function addNode(
    parent: Element,
    html: string,
    before: Element | null = null,
): Element {
    const doc = parent.ownerDocument;
    const holder = doc.createElement('div');
    holder.innerHTML = html.trim();
    const el = holder.firstElementChild;
    if (!el) throw new Error('addNode needs the HTML of one element.');

    const sample = [...parent.children]
        .map(leadingWs)
        .find((ws) => ws !== null);
    const last = parent.lastChild;
    const trailing = last instanceof Text && !last.data.trim() ? last : null;
    const ref = before ? (leadingWs(before) ?? before) : trailing;
    const indent = sample ? sample.data.replace(/\n+/, '\n') : '\n';
    parent.insertBefore(doc.createTextNode(indent), ref);
    parent.insertBefore(el, ref);
    return el;
}
