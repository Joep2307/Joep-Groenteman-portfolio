import type { PreviewTarget } from '../preview/PreviewTarget';
import type { ElementChild } from '../util/ElementChild';
import { h } from '../util/h';

/**
 * A titled group of fields. While focus is inside it, the preview shows
 * `target` instead of the view's own.
 */
export function group(
    title: string,
    kids: ElementChild | readonly ElementChild[],
    target?: PreviewTarget,
): HTMLElement {
    return h(
        'section',
        {
            class: 'group',
            'data-preview-scroll':
                target && 'scroll' in target ? target.scroll : null,
            'data-preview-open':
                target && 'open' in target ? target.open : null,
        },
        h('h2', {}, title),
        kids,
    );
}
