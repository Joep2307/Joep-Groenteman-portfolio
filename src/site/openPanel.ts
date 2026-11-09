import type { PanelState } from './PanelState';
import { showPanel } from './showPanel';

/** Opens a panel and moves focus into it, remembering where focus was. */
export function openPanel(state: PanelState, id: string): void {
    const panel = state.panels.find((candidate) => candidate.id === id);
    if (!panel) return;
    const active = state.doc.activeElement;
    state.lastFocused =
        active instanceof state.view.HTMLElement ? active : null;
    showPanel(state, panel);
    state.view.requestAnimationFrame(() => {
        panel.focus();
    });
}
