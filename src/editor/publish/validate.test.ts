import { describe, expect, it } from 'vitest';
import { createEditorState } from '../createEditorState';
import { validate } from './validate';

function problemsFor(body: string, knownImages: string[] = []): string[] {
    const state = createEditorState();
    state.doc.body.innerHTML = body;
    state.knownImages = knownImages;
    return validate(state).map(({ text }) => text);
}

const CARD = (title: string, desc: string): string => `
    <div class="cases">
        <div class="case">
            <h3 class="case-title">${title}</h3>
            <p class="case-desc">${desc}</p>
            <a data-open="panel-01"></a>
        </div>
    </div>
    <div class="case-panel" id="panel-01"></div>
`;

describe('validate', () => {
    it('accepts a complete page', () => {
        const body = `<main>${CARD('Atlas', 'A map.')}
            <img src="img/a.jpg" alt="A map"></main>`;

        expect(problemsFor(body, ['img/a.jpg'])).toEqual([]);
    });

    it('asks for a file, alt text and an existing path', () => {
        const body = `<main>
            <img alt="x">
            <img src="img/a.jpg" alt="">
            <img src="img/gone.jpg" alt="x">
        </main>`;

        expect(problemsFor(body, ['img/a.jpg'])).toEqual([
            'Settings: an image still needs a file.',
            'Settings: an image still needs alt text.',
            "Settings: img/gone.jpg doesn't exist.",
        ]);
    });

    it('asks for a real project title and a description', () => {
        expect(
            problemsFor(`<main>${CARD('New project', ' ')}</main>`),
        ).toEqual([
            'New project: give the project a title.',
            'New project: add a short description.',
        ]);
    });

    it('flags empty paragraphs and headings in panels', () => {
        const body = `<main></main><div class="panel-block">
            <h4> </h4><p></p></div>`;

        expect(problemsFor(body)).toHaveLength(2);
    });
});
