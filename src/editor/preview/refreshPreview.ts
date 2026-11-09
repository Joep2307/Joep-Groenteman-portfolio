import { mountSite } from '../../site/mountSite';
import { PREVIEW_SANDBOX } from '../constants';
import type { EditorState } from '../EditorState';
import { h } from '../util/h';
import { query } from '../util/query';
import { holdScroll } from './holdScroll';
import { previewDocument } from './previewDocument';

/** Redraws the preview from the page as it is being edited. */
export function refreshPreview(state: EditorState): void {
    if (!state.previewOn) return;
    // A new frame each time: the observers and timers the site set up on
    // the previous page go away with that frame's window.
    const frame = h('iframe', {
        id: 'preview-frame',
        title: 'Live preview of your portfolio',
        sandbox: PREVIEW_SANDBOX,
    });
    query('#preview').replaceChildren(frame);
    const page = frame.contentDocument;
    const view = page?.defaultView;
    if (!page || !view) return;

    // A problem in the page must not stop the editor, which saves the
    // draft right after this.
    try {
        // Written rather than loaded, so the page is all there, and can be
        // mounted and scrolled, before the frame is first painted.
        page.open();
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        page.write(previewDocument(state));
        page.close();

        const { previewTarget: target, previewScroll: restore } = state;
        const panel =
            'open' in target ? page.getElementById(target.open) : null;
        mountSite(
            page,
            panel
                ? { revealCases: true, initialPanel: panel.id }
                : { revealCases: true },
        );
        const place = (): void => {
            if (restore) {
                view.scrollTo(0, restore.y);
                if (panel) panel.scrollTop = restore.panelY;
            } else if ('scroll' in target) {
                page.querySelector(target.scroll)?.scrollIntoView();
            }
        };
        // From then on, remember where the preview is scrolled to, so the
        // next redraw can put it back.
        const remember = (): void => {
            state.previewScroll = {
                y: view.scrollY,
                panelY: panel?.scrollTop ?? 0,
            };
        };
        holdScroll(page, view, place, () => {
            page.addEventListener('scroll', remember, {
                capture: true,
                passive: true,
            });
        });
    } catch (error) {
        console.error('The preview could not be drawn.', error);
    }
}
