import { fromMarkup } from './fromMarkup';

/** Replaces a node's content, keeping the elements matching `skip`. */
export function setMarkup(node: Element, value: string, skip?: string): void {
    for (const child of [...node.childNodes]) {
        const kept =
            skip !== undefined &&
            child instanceof Element &&
            child.matches(skip);
        if (!kept) child.remove();
    }
    node.insertAdjacentHTML('beforeend', fromMarkup(value));
}
