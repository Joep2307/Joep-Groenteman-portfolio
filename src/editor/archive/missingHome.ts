import { archiveEntries } from './archiveEntries';
import { entryParts } from './entryParts';
import { findHome } from './findHome';

/**
 * Why an archived entry cannot go back, or `null` if it can: the part of
 * the page it came from has to be there.
 */
export function missingHome(doc: Document, entry: HTMLElement): string | null {
    for (const part of entryParts(entry)) {
        if (findHome(doc, part)) continue;
        const selector = part.dataset.home ?? '';
        const holder = archiveEntries(doc).find(
            (other) => other !== entry && other.querySelector(selector),
        );
        return holder
            ? `It was inside “${holder.dataset.title ?? ''}”, which is ` +
                  'archived too. Restore that first.'
            : 'The part of the page it came from is gone.';
    }
    return null;
}
