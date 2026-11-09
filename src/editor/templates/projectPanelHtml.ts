import { escapeHtml } from '../util/escapeHtml';

/**
 * A new project's case study. Indented the way the page indents its
 * panels; `prev` and `next` are the labels the other panels use.
 */
export function projectPanelHtml(
    n: string,
    caseNum: string,
    prev: string,
    next: string,
): string {
    return `<div class="case-panel" id="panel-${n}" role="dialog"
            aria-modal="true" aria-labelledby="panel-${n}-title"
            tabindex="-1">
            <span class="panel-index">${caseNum}</span>
            <h3 class="panel-title" id="panel-${n}-title">New project</h3>
            <div class="panel-tags"></div>
            <div class="panel-media"><img src="" loading="lazy" alt=""></div>
            <div class="panel-block">
                <h4>Overview</h4>
                <p></p>
            </div>
            <div class="panel-block">
                <h4>Process</h4>
                <p></p>
            </div>
            <div class="panel-block">
                <h4>Outcome</h4>
                <p></p>
            </div>
            <div class="panel-nav">
                <button data-nav="prev">${escapeHtml(prev)}</button>
                <button data-nav="next">${escapeHtml(next)}</button>
            </div>
        </div>`;
}
