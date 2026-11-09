import type { EditorState } from '../EditorState';

/** A URL that shows a file of the site, pending uploads included. */
export function assetUrl(state: EditorState, path: string | null): string {
    if (!path) return '';
    return (
        state.previewImages[path] ?? new URL(path, `${location.origin}/`).href
    );
}
