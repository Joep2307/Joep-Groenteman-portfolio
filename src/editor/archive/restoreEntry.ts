import { alignPanels } from '../document/alignPanels';
import { insertNode } from '../document/insertNode';
import { leadingWs } from '../document/leadingWs';
import { renumberCases } from '../document/renumberCases';
import { renumberSections } from '../document/renumberSections';
import { syncRail } from '../document/syncRail';
import { dropEntry } from './dropEntry';
import { entryParts } from './entryParts';
import { findHome } from './findHome';
import { missingHome } from './missingHome';

/**
 * Puts an archived entry back where it was. Returns false, changing
 * nothing, when the part of the page it came from is not there.
 */
export function restoreEntry(doc: Document, entry: HTMLElement): boolean {
    if (missingHome(doc, entry)) return false;
    for (const part of entryParts(entry)) {
        const home = findHome(doc, part);
        const el = part.lastElementChild;
        if (!home || !el) continue;
        const before = home.children[Number(part.dataset.at)] ?? null;
        const ws = el.previousSibling;
        if (!(ws instanceof Text)) {
            insertNode(home, el, before);
            continue;
        }
        const last = home.lastChild;
        const end = last instanceof Text && !last.data.trim() ? last : null;
        const ref = before ? (leadingWs(before) ?? before) : end;
        home.insertBefore(ws, ref);
        home.insertBefore(el, ref);
    }
    dropEntry(doc, entry);
    // Whatever came back takes its number from where it is now.
    renumberCases(doc);
    renumberSections(doc);
    alignPanels(doc);
    syncRail(doc);
    return true;
}
