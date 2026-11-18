import { describe, expect, it } from 'vitest';
import { swapGroups } from '../document/swapGroups';
import { toItems } from './toItems';
import { moveItem } from './moveItem';

function list(): HTMLElement {
    const ul = document.createElement('ul');
    ul.innerHTML = '<li>a</li><li>b</li><li>c</li><li>d</li>';
    return ul;
}

const order = (ul: HTMLElement): string =>
    [...ul.children].map((li) => li.textContent).join('');

describe('moveItem', () => {
    it('moves an item down past several others', () => {
        const ul = list();
        moveItem(toItems(ul.children), 0, 2, swapGroups);
        expect(order(ul)).toBe('bcad');
    });

    it('moves an item up to the top', () => {
        const ul = list();
        moveItem(toItems(ul.children), 3, 0, swapGroups);
        expect(order(ul)).toBe('dabc');
    });

    it('leaves the list alone when it stays put', () => {
        const ul = list();
        moveItem(toItems(ul.children), 1, 1, swapGroups);
        expect(order(ul)).toBe('abcd');
    });
});
