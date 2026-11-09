import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loadGeometry } from './loadGeometry';
import { mountSite } from './mountSite';

vi.mock('./loadGeometry', { spy: true });

const PAGE = `
    <div id="progress"></div>
    <a class="contact-link" href="#"></a>
    <button id="outside"></button>
    <div class="case"></div>
    <div id="overlay" hidden>
        <div class="case-panel" id="panel-01" tabindex="-1"></div>
        <div class="case-panel" id="panel-02" tabindex="-1"></div>
    </div>
`;

describe('mountSite', () => {
    beforeEach(() => {
        // jsdom implements neither, and mountSite reads them off doc's window.
        Object.assign(document.defaultView ?? {}, {
            matchMedia: () => ({ matches: false }),
            IntersectionObserver: vi.fn(function () {
                return { observe: vi.fn(), unobserve: vi.fn() };
            }),
        });
        document.body.className = '';
        document.body.innerHTML = PAGE;
    });

    it('mounts on a document without options', () => {
        expect(() => {
            mountSite(document);
        }).not.toThrow();
        expect(document.getElementById('overlay')?.hidden).toBe(true);
    });

    it('shows initialPanel and leaves keyboard focus where it is', () => {
        const outside = document.getElementById('outside');
        outside?.focus();

        mountSite(document, { initialPanel: 'panel-02' });

        expect(document.getElementById('overlay')?.hidden).toBe(false);
        expect(document.getElementById('panel-01')?.hidden).toBe(true);
        expect(document.getElementById('panel-02')?.hidden).toBe(false);
        expect(document.activeElement).toBe(outside);
    });

    it('shows every case at once with revealCases', () => {
        mountSite(document, { revealCases: true });

        const item = document.querySelector('.case');
        expect(item?.classList.contains('in-view')).toBe(true);
    });

    it('marks magnetic elements before the wasm has loaded', () => {
        mountSite(document);

        const link = document.querySelector('.contact-link');
        expect(link?.classList.contains('magnetic')).toBe(true);
    });

    it('attaches the effects once the wasm has loaded', async () => {
        const progress = document.getElementById('progress');

        mountSite(document);

        expect(progress?.style.width).toBe('');
        await vi.waitFor(() => {
            expect(progress?.style.width).toBe('0%');
        });
    });

    it('keeps the page working when the wasm cannot load', async () => {
        vi.mocked(loadGeometry).mockResolvedValueOnce(null);

        mountSite(document, { initialPanel: 'panel-01' });
        await new Promise((resolve) => setTimeout(resolve));

        expect(document.getElementById('progress')?.style.width).toBe('');
        expect(document.getElementById('panel-01')?.hidden).toBe(false);
    });
});
