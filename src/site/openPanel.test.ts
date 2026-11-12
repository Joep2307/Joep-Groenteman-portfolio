import { beforeEach, describe, expect, it } from 'vitest';
import { closePanel } from './closePanel';
import { openPanel } from './openPanel';
import type { PanelState } from './PanelState';

function buildState(): PanelState {
    document.body.innerHTML = `
        <main id="main-content"><button id="opener"></button></main>
        <div id="overlay" hidden>
            <div class="case-panel" id="a" tabindex="-1"></div>
            <div class="case-panel" id="b" tabindex="-1"></div>
        </div>
    `;
    const overlay = document.getElementById('overlay');
    const main = document.getElementById('main-content');
    if (!overlay || !main) throw new Error('fixture is missing parts');
    return {
        doc: document,
        view: window,
        overlay,
        panels: [...document.querySelectorAll<HTMLElement>('.case-panel')],
        pageContent: [main],
        lastFocused: null,
        activePanel: null,
    };
}

describe('openPanel and closePanel', () => {
    let state: PanelState;

    beforeEach(() => {
        state = buildState();
        window.requestAnimationFrame = (callback) => {
            callback(0);
            return 0;
        };
        document.getElementById('opener')?.focus();
    });

    it('opens the panel, hides the others and moves focus in', () => {
        openPanel(state, 'b');

        expect(state.overlay.hidden).toBe(false);
        expect(state.activePanel?.id).toBe('b');
        expect(document.getElementById('a')?.hidden).toBe(true);
        expect(document.activeElement?.id).toBe('b');
        expect(document.body.classList.contains('panel-open')).toBe(true);
        expect(
            document.getElementById('main-content')?.hasAttribute('inert'),
        ).toBe(true);
    });

    it('ignores an id that matches no panel', () => {
        openPanel(state, 'nope');

        expect(state.activePanel).toBeNull();
        expect(state.overlay.hidden).toBe(true);
    });

    it('returns focus to the opener when it closes', () => {
        openPanel(state, 'a');
        closePanel(state);

        expect(state.overlay.hidden).toBe(true);
        expect(state.activePanel).toBeNull();
        expect(document.activeElement?.id).toBe('opener');
        expect(document.body.classList.contains('panel-open')).toBe(false);
        expect(
            document.getElementById('main-content')?.hasAttribute('inert'),
        ).toBe(false);
    });
});
