import { beforeEach, describe, expect, it } from 'vitest';
import type { PanelState } from './PanelState';
import { trapFocus } from './trapFocus';

function press(state: PanelState, shiftKey: boolean): KeyboardEvent {
    const event = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey,
        cancelable: true,
    });
    trapFocus(state, event);
    return event;
}

describe('trapFocus', () => {
    let state: PanelState;

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="overlay">
                <div class="case-panel" id="panel" tabindex="-1">
                    <button id="first"></button>
                    <button id="last"></button>
                </div>
            </div>
        `;
        // jsdom has no layout, so every element would count as hidden.
        for (const el of document.querySelectorAll('button')) {
            el.getClientRects = () =>
                [new DOMRect()] as unknown as DOMRectList;
        }
        const overlay = document.getElementById('overlay');
        const panel = document.getElementById('panel');
        if (!overlay || !panel) throw new Error('fixture is incomplete');
        state = {
            doc: document,
            view: window,
            overlay,
            panels: [panel],
            pageContent: [],
            lastFocused: null,
            activePanel: panel,
        };
    });

    it('wraps Tab from the last control to the first', () => {
        document.getElementById('last')?.focus();

        expect(press(state, false).defaultPrevented).toBe(true);
        expect(document.activeElement?.id).toBe('first');
    });

    it('wraps Shift+Tab from the first control to the last', () => {
        document.getElementById('first')?.focus();

        expect(press(state, true).defaultPrevented).toBe(true);
        expect(document.activeElement?.id).toBe('last');
    });

    it('leaves Tab alone between the ends', () => {
        document.getElementById('first')?.focus();

        expect(press(state, false).defaultPrevented).toBe(false);
        expect(document.activeElement?.id).toBe('first');
    });

    it('keeps focus on the panel when nothing in it can take focus', () => {
        document.querySelectorAll('button').forEach((el) => {
            el.remove();
        });

        expect(press(state, false).defaultPrevented).toBe(true);
        expect(document.activeElement?.id).toBe('panel');
    });
});
