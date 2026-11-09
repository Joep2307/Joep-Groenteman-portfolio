import { addNode } from '../document/addNode';
import { need } from '../document/need';
import { nextNumber } from '../document/nextNumber';
import { renumberSections } from '../document/renumberSections';
import type { EditorState } from '../EditorState';
import { changed } from '../shell/changed';
import { go } from '../shell/go';
import { railItemHtml } from '../templates/railItemHtml';
import { sectionHtml } from '../templates/sectionHtml';

/** Adds an empty section ahead of Contact and opens it for editing. */
export function addSection(state: EditorState): void {
    const { doc } = state;
    const id = `section-${nextNumber(doc, 'section-')}`;
    addNode(need(doc, 'main'), sectionHtml(id), doc.getElementById('contact'));
    addNode(
        need(doc, '.rail'),
        railItemHtml(id),
        doc.querySelector('.rail [data-target="contact"]'),
    );
    renumberSections(doc);
    changed(state);
    go(state, `section:${id}`);
    document.querySelector<HTMLInputElement>('#editor input')?.select();
}
