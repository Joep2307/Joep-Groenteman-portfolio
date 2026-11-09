/** The whitespace that indents an element, if it has any before it. */
export function leadingWs(el: Element): Text | null {
    const prev = el.previousSibling;
    return prev instanceof Text && !prev.data.trim() ? prev : null;
}
