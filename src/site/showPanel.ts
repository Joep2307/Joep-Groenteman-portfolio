import type { PanelState } from './PanelState';

/** Shows one panel in the overlay, leaving keyboard focus alone. */
export function showPanel(state: PanelState, panel: HTMLElement): void {
    for (const other of state.panels) {
        other.hidden = other !== panel;
        other.setAttribute('aria-hidden', String(other !== panel));
    }
    state.activePanel = panel;
    state.overlay.hidden = false;
    state.overlay.setAttribute('aria-hidden', 'false');
    state.overlay.classList.add('active');
    state.doc.body.classList.add('panel-open');
    for (const el of state.pageContent) el.setAttribute('inert', '');
}
