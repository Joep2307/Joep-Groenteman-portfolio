import { leadingWs } from './leadingWs';

/** Moves elements, with their indentation, to just before `target`. */
export function moveBefore(group: readonly Element[], target: Element): void {
    const anchor = leadingWs(target) ?? target;
    for (const el of group) {
        const ws = leadingWs(el);
        if (ws) anchor.before(ws);
        anchor.before(el);
    }
}
