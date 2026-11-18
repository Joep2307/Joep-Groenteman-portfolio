import { ARCHIVE_HOME_ATTR } from '../constants';
import { archiveEntries } from './archiveEntries';
import { entryParts } from './entryParts';

/** Takes the markers off parents that no archived part points to. */
export function pruneHomes(doc: Document): void {
    const used = new Set(
        archiveEntries(doc).flatMap((entry) =>
            entryParts(entry).map((part) => part.dataset.home),
        ),
    );
    doc.querySelectorAll(`[${ARCHIVE_HOME_ATTR}]`).forEach((el) => {
        const marker = el.getAttribute(ARCHIVE_HOME_ATTR) ?? '';
        if (!used.has(`[${ARCHIVE_HOME_ATTR}="${marker}"]`)) {
            el.removeAttribute(ARCHIVE_HOME_ATTR);
        }
    });
}
