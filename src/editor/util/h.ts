import type { ElementChild } from './ElementChild';
import type { ElementProps } from './ElementProps';

/** Builds an element for the editor's own interface. */
export function h<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    props: ElementProps = {},
    ...kids: readonly (ElementChild | readonly ElementChild[])[]
): HTMLElementTagNameMap[K] {
    const el = document.createElement(tag);
    for (const [key, value] of Object.entries(props)) {
        if (typeof value === 'function') {
            el.addEventListener(key.slice(2), value);
        } else if (key === 'class') {
            el.className = String(value);
        } else if (value === true) {
            el.setAttribute(key, '');
        } else if (value !== false && value != null) {
            el.setAttribute(key, String(value));
        }
    }
    el.append(
        ...kids
            .flat()
            .filter(
                (kid): kid is Node | string => kid != null && kid !== false,
            ),
    );
    return el;
}
