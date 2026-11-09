import type { PanelState } from './PanelState';
import { showPanel } from './showPanel';

/** Moves to the next or previous panel, wrapping at either end. */
export function stepPanel(state: PanelState, direction: 1 | -1): void {
    const { activePanel, panels } = state;
    if (!activePanel) return;
    const index = panels.indexOf(activePanel) + direction + panels.length;
    const panel = panels[index % panels.length];
    if (!panel) return;
    showPanel(state, panel);
    state.view.requestAnimationFrame(() => {
        panel.focus();
    });
}
