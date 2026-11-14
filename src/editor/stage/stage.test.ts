import { describe, expect, it } from 'vitest';
import { createEditorState } from '../createEditorState';
import type { EditorState } from '../EditorState';
import { textField } from '../fields/textField';
import { previewDocument } from '../preview/previewDocument';
import { editTargetOf } from './editTargetOf';
import { editTargets } from './editTargets';
import { fieldFor } from './fieldFor';
import { nodeOf } from './nodeOf';

const PAGE = `<body>
<section id="intro"><h1 class="hero-title">Hi <em>there</em></h1></section>
<section id="work"><div class="cases">
  <div class="case" id="case-01"><h3 class="case-title">One</h3>
    <a data-open="panel-01">Open</a></div>
</div></section>
<section id="about"><div class="about-bio"><a data-open="cv">CV</a></div>
</section>
<div id="panel-01"><h2 class="panel-title">One</h2></div>
<div id="cv"></div>
<section id="contact"></section>
<footer><span>©</span></footer>
</body>`;

function stateFor(html: string): EditorState {
    const state = createEditorState();
    state.doc = new DOMParser().parseFromString(html, 'text/html');
    return state;
}

describe('editTargets', () => {
    it('covers each part of the page, card and case study alike', () => {
        const targets = editTargets(stateFor(PAGE));
        const views = Object.fromEntries(
            targets.map(({ selector, view }) => [selector, view]),
        );
        expect(views).toMatchObject({
            '#intro': 'intro',
            '#work': 'work',
            '#case-01': 'project:panel-01',
            '#panel-01': 'project:panel-01',
            '#about': 'about',
            '#cv': 'cv',
            '#contact': 'contact',
            footer: 'settings',
        });
    });
});

describe('editTargetOf', () => {
    it('takes the innermost target', () => {
        const doc = new DOMParser().parseFromString(
            '<div data-edit="work"><div data-edit="project:p">' +
                '<b id="x">x</b></div></div><i id="y"></i>',
            'text/html',
        );
        expect(editTargetOf(doc.getElementById('x') as Element)).toBe(
            'project:p',
        );
        expect(editTargetOf(doc.getElementById('y') as Element)).toBeNull();
    });
});

describe('nodeOf and fieldFor', () => {
    it('lead from a preview element to the field that edits it', () => {
        const state = stateFor(PAGE);
        const preview = new DOMParser().parseFromString(
            previewDocument(state),
            'text/html',
        );
        const title = state.doc.querySelector('.hero-title') as Element;
        const wrapper = textField(state, 'Title', title);
        document.body.append(wrapper);

        const em = preview.querySelector('.hero-title em') as Element;
        const node = nodeOf(state, em);
        expect(node).toBe(state.doc.querySelector('.hero-title em'));
        expect(fieldFor(state, node)).toBe(wrapper.querySelector('input'));
        wrapper.remove();
        expect(fieldFor(state, node)).toBeNull();
    });
});
