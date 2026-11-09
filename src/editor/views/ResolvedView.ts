import type { PreviewTarget } from '../preview/PreviewTarget';
import type { ViewContent } from './ViewContent';

export interface ResolvedView {
    readonly render: () => ViewContent;
    /** What the preview shows while this view is open. */
    readonly target: PreviewTarget;
}
