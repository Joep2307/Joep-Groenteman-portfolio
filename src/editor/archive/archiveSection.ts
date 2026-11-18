import type { PageSection } from '../document/PageSection';
import { renumberSections } from '../document/renumberSections';
import type { EditorState } from '../EditorState';
import { archiveRow } from './archiveRow';

/** Archives a section of the page with its item in the navigation. */
export function archiveSection(state: EditorState, item: PageSection): void {
    const { section, rail, title } = item;
    archiveRow(
        state,
        rail ? [section, rail] : [section],
        'Page section',
        title,
        'Sections',
    );
    renumberSections(state.doc);
}
