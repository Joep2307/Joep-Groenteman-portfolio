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
        previewTarget: { scroll: '#intro' },
        previewScroll: null,
        previewNodes: [],
        fieldNodes: new WeakMap(),
        drawerFrom: 'bar',
        flushTimer: undefined,
        noticeTimer: undefined,
        fieldSeq: 0,
    };
}
