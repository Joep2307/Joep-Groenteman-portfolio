/**
 * Whether a node holds anything other than bold, italic and line breaks,
 * which cannot round-trip through a plain field.
 */
export function hasCustomHtml(node: Element, skip?: string): boolean {
    return [...node.querySelectorAll('*')].some(
        (el) =>
            !/^(STRONG|B|EM|I|BR)$/.test(el.tagName) &&
            !(skip !== undefined && el.matches(skip)),
    );
}
