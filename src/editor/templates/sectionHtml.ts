/** A new section. Indented the way the page indents its sections. */
export function sectionHtml(id: string): string {
    return `<section id="${id}">
            <div class="section-head">
                <span class="section-num"></span>
                <h2 class="section-title">New section</h2>
                <div class="section-rule"></div>
            </div>
            <div class="about-bio">
                <p></p>
            </div>
        </section>`;
}
