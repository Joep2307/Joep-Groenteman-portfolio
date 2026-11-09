import { beforeEach, describe, expect, it } from 'vitest';
import type { PanelState } from './PanelState';
import { showPanel } from './showPanel';
import { stepPanel } from './stepPanel';

describe('stepPanel', () => {
    let state: PanelState;

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="overlay" hidden>
                <div class="case-panel" id="a" tabindex="-1"></div>
                <div class="case-panel" id="b" tabindex="-1"></div>
                <div class="case-panel" id="c" tabindex="-1"></div>
            </div>
        `;
        window.requestAnimationFrame = (callback) => {
            callback(0);
            return 0;
        };
        const overlay = document.getElementById('overlay');
        if (!overlay) throw new Error('fixture is missing the overlay');
        state = {
            doc: document,
            view: window,
            overlay,
            panels: [...document.querySelectorAll<HTMLElement>('.case-panel')],
            pageContent: [],
            lastFocused: null,
            activePanel: null,
        };
    });

    function stepFrom(id: string, direction: 1 | -1): string | undefined {
        const panel = document.getElementById(id);
        if (panel) showPanel(state, panel);
        stepPanel(state, direction);
        return state.activePanel?.id;
    }

    it('moves to the next and previous panel', () => {
        expect(stepFrom('a', 1)).toBe('b');
        expect(stepFrom('b', -1)).toBe('a');
    });

    it('wraps from the last panel to the first', () => {
        expect(stepFrom('c', 1)).toBe('a');
    });

    it('wraps from the first panel to the last', () => {
        expect(stepFrom('a', -1)).toBe('c');
    });

    it('moves focus to the new panel', () => {
        stepFrom('a', 1);

        expect(document.activeElement?.id).toBe('b');
    });

    it('does nothing while no panel is open', () => {
        stepPanel(state, 1);

        expect(state.activePanel).toBeNull();
    });
});
