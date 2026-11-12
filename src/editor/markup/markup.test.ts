import { describe, expect, it } from 'vitest';
import { fromMarkup } from './fromMarkup';
import { toMarkup } from './toMarkup';

function html(markup: string): HTMLElement {
    const el = document.createElement('div');
    el.innerHTML = fromMarkup(markup);
    return el;
}

describe('fromMarkup', () => {
    it('turns markers into elements', () => {
        expect(fromMarkup('a **b** and *c*')).toBe(
            'a <strong>b</strong> and <em>c</em>',
        );
    });

    it('turns new lines into breaks', () => {
        expect(fromMarkup('one\ntwo')).toBe('one<br>two');
    });

    it('escapes markup typed into a field', () => {
        expect(fromMarkup('<b>&')).toBe('&lt;b&gt;&amp;');
    });
});

describe('toMarkup', () => {
    it('reads elements back as markers', () => {
        const el = document.createElement('p');
        el.innerHTML = 'a <b>b</b> and <i>c</i><br>d';

        expect(toMarkup(el)).toBe('a **b** and *c*\nd');
    });

    it('leaves out elements matching skip', () => {
        const el = document.createElement('p');
        el.innerHTML = 'a<span class="sr-only"> hidden</span>';

        expect(toMarkup(el, '.sr-only')).toBe('a');
    });

    it('collapses the page indentation', () => {
        const el = document.createElement('p');
        el.textContent = '\n    one\n       two\n';

        expect(toMarkup(el)).toBe('one two');
    });
});

describe('round trip', () => {
    it.each([
        'plain',
        'with **bold** and *accent*',
        'two\nlines',
        'a < b & c',
    ])('keeps %j', (text) => {
        expect(toMarkup(html(text))).toBe(text);
    });
});
