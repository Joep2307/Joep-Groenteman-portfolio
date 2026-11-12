/** The text an element starts with, added empty if it has none. */
export function leadText(el: Element): Text {
    const existing = [...el.childNodes].find(
        (child): child is Text =>
            child instanceof Text && child.data.trim() !== '',
    );
    if (existing) return existing;
    const node = el.ownerDocument.createTextNode('');
    el.prepend(node);
    return node;
}
