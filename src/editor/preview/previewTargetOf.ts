import type { PreviewTarget } from './PreviewTarget';

/** The preview target of the group of fields an element is in, if any. */
export function previewTargetOf(el: Element): PreviewTarget | null {
    const scoped = el.closest<HTMLElement>(
        '[data-preview-scroll], [data-preview-open]',
    );
    const { previewScroll, previewOpen } = scoped?.dataset ?? {};
    if (previewOpen !== undefined) return { open: previewOpen };
    if (previewScroll !== undefined) return { scroll: previewScroll };
    return null;
}
