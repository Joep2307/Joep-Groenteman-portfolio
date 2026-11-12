import { describe, expect, it } from 'vitest';
import { renumberCases } from './renumberCases';
import { renumberSections } from './renumberSections';

function page(html: string): Document {
    const doc = document.implementation.createHTMLDocument();
    doc.body.innerHTML = html;
    return doc;
}

describe('renumberCases', () => {
    it('makes the labels follow page order on cards and panels', () => {
        const card = (id: string, n: string): string => `
            <div class="case"><span class="case-index">CASE ${n}</span>
            <a data-open="${id}"></a></div>`;
        const panel = (id: string, n: string): string =>
            `<div id="${id}"><span class="panel-index">CASE ${n} / x
            </span></div>`;
        const doc = page(`
            <div class="cases">${card('p2', '02')}${card('p1', '01')}</div>
            ${panel('p1', '01')}${panel('p2', '02')}
        `);

        renumberCases(doc);

        const cards = [...doc.querySelectorAll('.case-index')];
        expect(cards.map((el) => el.textContent)).toEqual([
            'CASE 01',
            'CASE 02',
        ]);
        expect(doc.querySelector('#p2 .panel-index')?.textContent).toBe(
            'CASE 01 / x',
        );
        expect(doc.querySelector('#p1 .panel-index')?.textContent).toBe(
            'CASE 02 / x',
        );
    });
});

describe('renumberSections', () => {
    it('numbers sections by position with two digits', () => {
        const doc = page(`<main>
            <section><span class="section-num">05</span></section>
            <section><span class="section-num">09</span></section>
        </main>`);

        renumberSections(doc);

        expect(
            [...doc.querySelectorAll('.section-num')].map(
                (el) => el.textContent,
            ),
        ).toEqual(['01', '02']);
    });
});
