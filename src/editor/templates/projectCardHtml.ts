/** A new project's card. Indented the way the page indents its cards. */
export function projectCardHtml(n: string, caseNum: string): string {
    return `<div class="case" id="case-${n}">
                <div class="case-media">
                    <div class="glow"></div><img src="" loading="lazy" alt="">
                </div>
                <div>
                    <span class="case-index">${caseNum}</span>
                    <h3 class="case-title">New project</h3>
                    <p class="case-desc"></p>
                    <div class="case-tags"></div>
                    <a href="#panel-${n}" class="case-link"
                        data-open="panel-${n}">View case study →</a>
                </div>
            </div>`;
}
