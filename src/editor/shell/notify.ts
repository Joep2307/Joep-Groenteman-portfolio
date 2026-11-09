import { NOTICE_DURATION_MS } from '../constants';
import type { EditorState } from '../EditorState';
import { h } from '../util/h';
import { query } from '../util/query';
import type { NoticeLink } from './NoticeLink';

/** Shows a short message at the bottom of the screen for a few seconds. */
export function notify(
    state: EditorState,
    message: string,
    link?: NoticeLink,
): void {
    const notice = query('#notice');
    notice.replaceChildren(message);
    if (link) {
        const { href, label } = link;
        const rel = 'noopener noreferrer';
        notice.append(' ', h('a', { href, target: '_blank', rel }, label));
    }
    notice.hidden = false;
    window.clearTimeout(state.noticeTimer);
    state.noticeTimer = window.setTimeout(() => {
        notice.hidden = true;
    }, NOTICE_DURATION_MS);
}
