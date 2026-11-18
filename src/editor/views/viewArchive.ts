import { archiveEntries } from '../archive/archiveEntries';
import type { EditorState } from '../EditorState';
import { group } from '../fields/group';
import { h } from '../util/h';
import { archiveRowView } from './archiveRowView';
import type { ViewContent } from './ViewContent';

/** Everything archived, newest first, to restore or delete. */
export function viewArchive(state: EditorState): ViewContent {
    const entries = archiveEntries(state.doc).reverse();
    const intro = h(
        'p',
        { class: 'hint before-list' },
        'Archived parts are hidden from visitors but kept, so you can ' +
            'bring them back where they were. They are still in the ' +
            "page's source code, like the rest of the site.",
    );
    if (!entries.length) {
        return {
            title: 'Archive',
            content: [
                intro,
                h(
                    'p',
                    { class: 'archive-empty' },
                    'Nothing is archived. To put something away without ' +
                        'deleting it, use the archive button beside a ' +
                        'project, section, paragraph or other row.',
                ),
            ],
        };
    }
    const count = String(entries.length);
    return {
        title: 'Archive',
        content: [
            intro,
            group(
                `${count} archived, newest first`,
                h(
                    'div',
                    { class: 'rows' },
                    entries.map((entry, i) => archiveRowView(state, entry, i)),
                ),
            ),
        ],
    };
}
