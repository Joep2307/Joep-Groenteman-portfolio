import type { Project } from '../document/Project';
import { renumberCases } from '../document/renumberCases';
import type { EditorState } from '../EditorState';
import { archiveRow } from './archiveRow';

/** Archives a project: its card and its case study together. */
export function archiveProject(state: EditorState, project: Project): void {
    archiveRow(
        state,
        [project.card, project.panel],
        'Project',
        project.title || 'Untitled project',
        'Projects',
    );
    renumberCases(state.doc);
}
