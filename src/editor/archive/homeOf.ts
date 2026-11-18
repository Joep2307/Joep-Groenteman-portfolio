import { ARCHIVE_HOME_ATTR } from '../constants';

/**
 * A selector that finds `el` again later: its id, or a marker added to
 * it when it has none.
 */
export function homeOf(el: Element): string {
    if (/^[A-Za-z][\w-]*$/.test(el.id)) return `#${el.id}`;
    let marker = el.getAttribute(ARCHIVE_HOME_ATTR);
    if (!marker) {
        const doc = el.ownerDocument;
        const selector = `[${ARCHIVE_HOME_ATTR}]`;
        const marked = [
            ...doc.querySelectorAll(selector),
            ...[...doc.querySelectorAll('template')].flatMap((template) => [
                ...template.content.querySelectorAll(selector),
            ]),
        ];
        const used = marked.map((other) =>
            Number(other.getAttribute(ARCHIVE_HOME_ATTR)),
        );
        marker = String(Math.max(0, ...used.filter(Number.isFinite)) + 1);
        el.setAttribute(ARCHIVE_HOME_ATTR, marker);
    }
    return `[${ARCHIVE_HOME_ATTR}="${marker}"]`;
}
