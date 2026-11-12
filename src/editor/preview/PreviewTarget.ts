/**
 * What the preview shows: the page scrolled to the element a selector
 * matches, or the panel with an id opened.
 */
export type PreviewTarget =
    { readonly scroll: string } | { readonly open: string };
