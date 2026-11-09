import { describe, expect, it } from 'vitest';
import { createEditorState } from '../createEditorState';
import type { EditorState } from '../EditorState';
import { previewDocument } from './previewDocument';

function stateFor(html: string): EditorState {
    const state = createEditorState();
    state.doc = new DOMParser().parseFromString(html, 'text/html');
    return state;
}

function preview(state: EditorState): Document {
    return new DOMParser().parseFromString(
        previewDocument(state),
        'text/html',
    );
}

describe('previewDocument', () => {
    it('takes out scripts and forbids any others, first thing', () => {
        const page = preview(
            stateFor(
                '<head><title>t</title><script src="/main.ts"></script>' +
                    '</head><body><script>alert(1)</script></body>',
            ),
        );
        expect(page.querySelectorAll('script')).toHaveLength(0);
        const first = page.head.firstElementChild;
        expect(first?.getAttribute('http-equiv')).toBe(
            'Content-Security-Policy',
        );
        expect(first?.getAttribute('content')).toBe("script-src 'none'");
    });

    it('drops source stylesheets but keeps remote ones', () => {
        const page = preview(
            stateFor(
                '<head>' +
                    '<link rel="stylesheet" href="../src/styles/site.scss">' +
                    '<link rel="stylesheet" href="https://fonts.test/a.css">' +
                    '</head><body></body>',
            ),
        );
        const links = [...page.querySelectorAll('link[rel="stylesheet"]')];
        expect(links.map((link) => link.getAttribute('href'))).toEqual([
            'https://fonts.test/a.css',
        ]);
        expect(page.querySelectorAll('head style')).toHaveLength(1);
    });

    it('shows pending uploads and loads every image at once', () => {
        const state = stateFor(
            '<body><img src="img/new.png" loading="lazy" alt="">' +
                '<img src="img/old.jpg" alt=""></body>',
        );
        state.previewImages['img/new.png'] = 'data:image/png;base64,AAAA';
        const [pending, published] = preview(state).querySelectorAll('img');
        expect(pending?.getAttribute('src')).toBe(
            'data:image/png;base64,AAAA',
        );
        expect(pending?.hasAttribute('loading')).toBe(false);
        expect(published?.getAttribute('src')).toBe(
            `${location.origin}/img/old.jpg`,
        );
    });

    it('leaves the page being edited as it was', () => {
        const state = stateFor(
            '<head><script src="/main.ts"></script></head>' +
                '<body><img src="img/a.jpg" loading="lazy" alt=""></body>',
        );
        const before = state.doc.documentElement.outerHTML;
        previewDocument(state);
        expect(state.doc.documentElement.outerHTML).toBe(before);
    });
});
