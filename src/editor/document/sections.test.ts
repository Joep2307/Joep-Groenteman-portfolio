import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { moveItem } from '../lists/moveItem';
import { pageSections } from './pageSections';
import { serialize } from './serialize';
import { swapSections } from './swapSections';

function load(): Document {
    const page = readFileSync('exe/index.html', 'utf8');
    return new DOMParser().parseFromString(page, 'text/html');
}

const ids = (doc: Document, selector: string, attr: string): string[] =>
    [...doc.querySelectorAll(selector)].map(
        (el) => el.getAttribute(attr) ?? '',
    );

describe('moving sections', () => {
    it('leaves Intro out and marks the built-in sections fixed', () => {
        const sections = pageSections(load());
        expect(sections.map((s) => [s.id, s.fixed])).toEqual([
            ['work', true],
            ['about', true],
            ['contact', true],
        ]);
    });

    it('takes the navigation and the numbers along', () => {
        const doc = load();
        const before = serialize(doc);
        const swap = (
            items: readonly ReturnType<typeof pageSections>[number][],
            a: number,
            b: number,
        ): void => {
            swapSections(doc, items, a, b);
        };
        moveItem(pageSections(doc), 2, 0, swap);

        expect(ids(doc, 'main > section', 'id')).toEqual([
            'intro',
            'contact',
            'work',
            'about',
        ]);
        expect(ids(doc, '.rail-item', 'data-target')).toEqual([
            'intro',
            'contact',
            'work',
            'about',
        ]);
        const num = (id: string): string | null | undefined =>
            doc.querySelector(`#${id} .section-num`)?.textContent;
        expect([num('contact'), num('work'), num('about')]).toEqual([
            '01',
            '02',
            '03',
        ]);

        moveItem(pageSections(doc), 0, 2, swap);
        expect(serialize(doc)).toBe(before);
    });
});
