import { clean } from '../util/clean';

/** An element's text, with a space between the texts it is made of. */
export function textOf(el: Element): string {
    const walker = el.ownerDocument.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const parts: string[] = [];
    while (walker.nextNode()) parts.push(walker.currentNode.nodeValue ?? '');
    return clean(parts.join(' '));
}
