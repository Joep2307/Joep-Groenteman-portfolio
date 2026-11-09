import type { PanelState } from './PanelState';

/** Closes the overlay and returns focus to what opened it. */
export function closePanel(state: PanelState): void {
    state.overlay.classList.remove('active');
    state.overlay.setAttribute('aria-hidden', 'true');
    state.overlay.hidden = true;
    state.doc.body.classList.remove('panel-open');
    for (const el of state.pageContent) el.removeAttribute('inert');
    for (const panel of state.panels) {
        panel.setAttribute('aria-hidden', 'true');
    }
    state.activePanel = null;
    state.lastFocused?.focus();
}
