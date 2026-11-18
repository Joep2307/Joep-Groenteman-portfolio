import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ARCHIVE_HOME_ATTR } from '../constants';
import { nextNumber } from '../document/nextNumber';
import { projects } from '../document/projects';
import { serialize } from '../document/serialize';
import { archiveEntries } from './archiveEntries';
import { archiveNodes } from './archiveNodes';
import { archiveTemplate } from './archiveTemplate';
import { dropEntry } from './dropEntry';
import { missingHome } from './missingHome';
import { restoreEntry } from './restoreEntry';

const PAGE = readFileSync('exe/index.html', 'utf8');

function load(): Document {
    return new DOMParser().parseFromString(PAGE, 'text/html');
}

function only(doc: Document): HTMLElement {
    const [entry] = archiveEntries(doc);
    if (!entry) throw new Error('Nothing was archived.');
    return entry;
}

const meta = { kind: 'Test', title: 'Test', from: 'Tests' };

describe('the archive', () => {
    it('takes a project off the page and gives it back unchanged', () => {
        const doc = load();
        const before = serialize(doc);
        const [, second] = projects(doc);
        if (!second) throw new Error('The page needs two projects.');
        archiveNodes(doc, [second.card, second.panel], meta);

        expect(projects(doc).map((p) => p.id)).not.toContain(second.id);
        expect(doc.getElementById(second.id)).toBeNull();
        const template = archiveTemplate(doc);
        expect(template?.content.getElementById(second.id)).not.toBeNull();
        // A new project does not take the archived one's number.
        expect(nextNumber(doc, 'panel-')).toBe('06');

        expect(restoreEntry(doc, only(doc))).toBe(true);
        expect(archiveTemplate(doc)).toBeNull();
        expect(serialize(doc)).toBe(before);
    });

    it('brings back a paragraph from a parent without an id', () => {
        const doc = load();
        const before = serialize(doc);
        const paragraph = doc.querySelector('.about-bio p:nth-of-type(2)');
        if (!paragraph) throw new Error('The bio needs paragraphs.');
        archiveNodes(doc, [paragraph], meta);

        const bio = doc.querySelector('.about-bio');
        expect(bio?.hasAttribute(ARCHIVE_HOME_ATTR)).toBe(true);
        expect(bio?.contains(paragraph)).toBe(false);

        restoreEntry(doc, only(doc));
        expect(serialize(doc)).toBe(before);
    });

    it('keeps an image with its caption, in place', () => {
        const doc = load();
        const before = serialize(doc);
        const img = doc.querySelector('#panel-02 .panel-block img');
        const caption = img?.nextElementSibling;
        if (!img || !caption) throw new Error('Panel 2 needs an image.');
        archiveNodes(doc, [img, caption], meta);
        expect(doc.querySelector('#panel-02 .panel-block img')).not.toBe(img);

        restoreEntry(doc, only(doc));
        expect(serialize(doc)).toBe(before);
    });

    it('waits for the part a piece came from to come back first', () => {
        const doc = load();
        const before = serialize(doc);
        const paragraph = doc.querySelector('#panel-03 .panel-block p');
        const project = projects(doc).find((p) => p.id === 'panel-03');
        if (!paragraph || !project) throw new Error('Panel 3 is missing.');
        archiveNodes(doc, [paragraph], { ...meta, title: 'Paragraph' });
        archiveNodes(doc, [project.card, project.panel], {
            ...meta,
            title: 'EAA',
        });
        const [piece, whole] = archiveEntries(doc);
        if (!piece || !whole) throw new Error('Both should be archived.');

        expect(missingHome(doc, piece)).toContain('“EAA”');
        expect(restoreEntry(doc, piece)).toBe(false);
        expect(missingHome(doc, whole)).toBeNull();

        restoreEntry(doc, whole);
        restoreEntry(doc, piece);
        expect(serialize(doc)).toBe(before);
    });

    it('says when the place a piece came from is gone', () => {
        const doc = load();
        const block = doc.querySelector('#panel-04 .panel-block');
        const paragraph = block?.querySelector('p');
        if (!block || !paragraph) throw new Error('Panel 4 is missing.');
        archiveNodes(doc, [paragraph], meta);
        block.remove();
        expect(missingHome(doc, only(doc))).toMatch(/gone/);
    });

    it('deletes for good, leaving no marker or empty archive', () => {
        const doc = load();
        const paragraph = doc.querySelector('.about-bio p');
        if (!paragraph) throw new Error('The bio needs paragraphs.');
        const text = paragraph.textContent;
        archiveNodes(doc, [paragraph], meta);
        dropEntry(doc, only(doc));

        expect(archiveTemplate(doc)).toBeNull();
        expect(doc.querySelector(`[${ARCHIVE_HOME_ATTR}]`)).toBeNull();
        expect(serialize(doc)).not.toContain(text);
    });
});
