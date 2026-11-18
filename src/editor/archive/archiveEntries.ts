import { archiveTemplate } from './archiveTemplate';

/** Everything archived, oldest first. */
export function archiveEntries(doc: Document): HTMLElement[] {
    const template = archiveTemplate(doc);
    if (!template) return [];
    return [...template.content.children].filter(
        (el): el is HTMLElement =>
            el.classList.contains('archived') && 'dataset' in el,
    );
}
