import { STACKED_MAX_WIDTH_PX } from './constants';
import type { EditorState } from './EditorState';

export function createEditorState(): EditorState {
    return {
        // Stands in until `start` has loaded the page.
        doc: document.implementation.createHTMLDocument(),
        cleanHtml: '',
        baseBlobSha: null,
        conflict: null,
        pending: {},
        previewImages: {},
        knownImages: [],
        currentView: 'intro',
        previewOn: window.innerWidth > STACKED_MAX_WIDTH_PX,
        previewTarget: { scroll: '#intro' },
        previewScroll: null,
        flushTimer: undefined,
        noticeTimer: undefined,
        fieldSeq: 0,
    };
}
