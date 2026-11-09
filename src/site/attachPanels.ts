import { closePanel } from './closePanel';
import { PAGE_CONTENT_SELECTORS } from './constants';
import { openPanel } from './openPanel';
import type { PanelState } from './PanelState';
import { showPanel } from './showPanel';
import { stepPanel } from './stepPanel';
import { trapFocus } from './trapFocus';

/** Wires the case study overlay: open, close, step and keyboard. */
export function attachPanels(
    doc: Document,
    view: Window & typeof globalThis,
    initialPanel?: string,
): void {
    const overlay = doc.getElementById('overlay');
    if (!overlay) return;

    const state: PanelState = {
        doc,
        view,
        overlay,
        panels: [...doc.querySelectorAll<HTMLElement>('.case-panel')],
        pageContent: PAGE_CONTENT_SELECTORS.flatMap(
            (selector) => doc.querySelector(selector) ?? [],
        ),
        lastFocused: null,
        activePanel: null,
    };

    for (const panel of state.panels) {
        panel.hidden = true;
        panel.setAttribute('aria-hidden', 'true');
    }

    doc.querySelectorAll<HTMLElement>('[data-open]').forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            openPanel(state, link.dataset.open ?? '');
        });
    });

    overlay.querySelectorAll('[data-close]').forEach((el) => {
        el.addEventListener('click', () => {
            closePanel(state);
        });
    });

    overlay.querySelectorAll<HTMLElement>('[data-nav]').forEach((button) => {
        button.addEventListener('click', () => {
            stepPanel(state, button.dataset.nav === 'next' ? 1 : -1);
        });
    });

    doc.addEventListener('keydown', (event) => {
        if (!state.activePanel) return;
        if (event.key === 'Escape') {
            event.preventDefault();
            closePanel(state);
        } else if (event.key === 'Tab') {
            trapFocus(state, event);
        }
    });

    const panel = state.panels.find(({ id }) => id === initialPanel);
    if (panel) showPanel(state, panel);
}
