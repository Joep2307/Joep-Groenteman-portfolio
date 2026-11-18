import { leadingWs } from './leadingWs';

/** Puts the side navigation in the order of the sections it points to. */
export function syncRail(doc: Document): void {
    const rail = doc.querySelector('.rail');
    if (!rail) return;
    const items = [...doc.querySelectorAll('main > section')]
        .map((section) =>
            rail.querySelector(`:scope > [data-target="${section.id}"]`),
        )
        .filter((item) => item !== null);
    const last = rail.lastChild;
    const end = last instanceof Text && !last.data.trim() ? last : null;
    for (const item of items) {
        const ws = leadingWs(item);
        if (ws) rail.insertBefore(ws, end);
        rail.insertBefore(item, end);
    }
}
