import { leadingWs } from '../document/leadingWs';
import type { ArchiveMeta } from './ArchiveMeta';
import { archiveTemplate } from './archiveTemplate';
import { homeOf } from './homeOf';

/**
 * Moves elements of the page into the archive as one entry. Each keeps
 * its indentation and remembers its parent and position, so restoring it
 * gives back the page as it was.
 */
export function archiveNodes(
    doc: Document,
    nodes: readonly Element[],
    meta: ArchiveMeta,
): HTMLElement {
    // Read every place before anything moves: an image and its caption
    // share a parent, and the caption's position counts the image.
    const places = nodes.map((el) => {
        const parent = el.parentElement;
        if (!parent) throw new Error('Only a part of the page can go.');
        const at = [...parent.children].indexOf(el);
        return { el, home: homeOf(parent), at };
    });

    const template = archiveTemplate(doc, true);
    if (!template) throw new Error('The archive could not be added.');
    const entry = doc.createElement('div');
    entry.className = 'archived';
    entry.dataset.kind = meta.kind;
    entry.dataset.title = meta.title;
    entry.dataset.from = meta.from;
    entry.dataset.date = new Date().toISOString().slice(0, 10);
    for (const { el, home, at } of places) {
        const part = doc.createElement('div');
        part.dataset.home = home;
        part.dataset.at = String(at);
        const ws = leadingWs(el);
        part.append(...(ws ? [ws, el] : [el]));
        entry.append('\n', part);
    }
    template.content.append('\n', entry);
    return entry;
}
