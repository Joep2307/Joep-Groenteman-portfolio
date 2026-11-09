import { clean } from '../util/clean';
import { pad } from '../util/pad';
import { projects } from './projects';

/** Makes each project's "CASE 01" label follow its position. */
export function renumberCases(doc: Document): void {
    projects(doc).forEach((project, i) => {
        const labels = [
            project.card.querySelector('.case-index'),
            project.panel.querySelector('.panel-index'),
        ];
        for (const el of labels) {
            if (!el) continue;
            el.textContent = clean(el.textContent).replace(
                /^CASE \d+/,
                `CASE ${pad(i + 1)}`,
            );
        }
    });
}
