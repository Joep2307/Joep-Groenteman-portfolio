import { leadingWs } from './leadingWs';

/**
 * Puts an element in `parent`, before `before` or at the end, indented
 * the way its new siblings are.
 */
export function insertNode<T extends Element>(
    parent: Element,
    el: T,
    before: Element | null = null,
): T {
    const doc = parent.ownerDocument;
    const sample = [...parent.children]
        .filter((child) => child !== el)
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
