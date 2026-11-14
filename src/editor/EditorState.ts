import type { LatestSite } from './github/LatestSite';
import type { PendingFile } from './fields/PendingFile';
import type { PreviewScroll } from './preview/PreviewScroll';
import type { PreviewTarget } from './preview/PreviewTarget';

/** Everything the editor remembers while it is open. */
export interface EditorState {
    /**
     * The parsed page and the only copy of the content: forms edit its
     * nodes directly, and publishing serializes it again, so hand edits
     * to the markup are never touched.
     */
    doc: Document;
    /** The page as last published, to tell whether anything changed. */
    cleanHtml: string;
    /** The published page these edits started from. */
    baseBlobSha: string | null;
    /** Set when the page changed on GitHub under unpublished edits. */
    conflict: LatestSite | null;
    /** Files to upload on publish, keyed by their path beside the page. */
    pending: Record<string, PendingFile>;
    /** Data URLs for pending images, so they show before they exist. */
    previewImages: Record<string, string>;
    /** Image paths the page can refer to, pending uploads included. */
    knownImages: string[];
    currentView: string;
    previewTarget: PreviewTarget;
    /** Where the preview was scrolled to; cleared when its target moves. */
    previewScroll: PreviewScroll | null;
    /**
     * The elements of `doc` in document order, as the preview last drew
     * them. A preview element's `data-node` is its index here.
     */
    previewNodes: Element[];
    /** The input that edits each element of `doc`, once it is drawn. */
    fieldNodes: WeakMap<Element, HTMLElement>;
    /** What opened the edit panel, so closing it can go back there. */
    drawerFrom: 'page' | 'bar';
    flushTimer: number | undefined;
    noticeTimer: number | undefined;
    /** Counts form fields, to give each one a unique id. */
    fieldSeq: number;
}
