import { leadingWs } from '../document/leadingWs';
import { archiveEntries } from './archiveEntries';
import { archiveTemplate } from './archiveTemplate';
import { pruneHomes } from './pruneHomes';

/**
 * Takes an entry out of the archive, and the archive out of the page once
 * it is empty, so archiving and restoring leaves no trace.
 */
export function dropEntry(doc: Document, entry: Element): void {
    leadingWs(entry)?.remove();
    entry.remove();
    const template = archiveTemplate(doc);
    if (template && archiveEntries(doc).length === 0) {
        leadingWs(template)?.remove();
        template.remove();
    }
    pruneHomes(doc);
}
