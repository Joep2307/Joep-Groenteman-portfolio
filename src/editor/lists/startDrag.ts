import { DRAG_EDGE_PX, DRAG_MAX_SCROLL_PX } from '../constants';

/**
 * Drags a row of a list by its handle: the row follows the pointer, the
 * others slide out of its way and the panel scrolls near its edges. On
 * release `onDrop` gets where it came from and where it goes; Escape or
 * a cancelled pointer puts everything back.
 */
export function startDrag(
    event: PointerEvent,
    onDrop: (from: number, to: number) => void,
): void {
    const grip = event.currentTarget;
    if (event.button !== 0 || !(grip instanceof HTMLElement)) return;
    const row = grip.closest<HTMLElement>('.row');
    const list = row?.parentElement;
    if (!row || !list) return;
    const rows = [...list.children].filter(
        (el): el is HTMLElement =>
            el instanceof HTMLElement && el.classList.contains('row'),
    );
    const from = rows.indexOf(row);
    if (rows.length < 2 || from < 0) return;
    event.preventDefault();

    const scroller = list.closest<HTMLElement>('.editor');
    // Positions are kept relative to the list, which scrolls as a whole.
    const listTop = (): number => list.getBoundingClientRect().top;
    const top0 = listTop();
    const boxes = rows.map((el) => {
        const box = el.getBoundingClientRect();
        return { mid: box.top - top0 + box.height / 2 };
    });
    const style = getComputedStyle(row);
    const slot =
        row.getBoundingClientRect().height +
        parseFloat(style.marginTop) +
        parseFloat(style.marginBottom);
    const start = event.clientY - top0;
    let pointerY = event.clientY;
    let to = from;

    const update = (): void => {
        const dy = pointerY - listTop() - start;
        row.style.transform = `translateY(${String(dy)}px)`;
        const centre = (boxes[from]?.mid ?? 0) + dy;
        to = boxes.filter((box, i) => i !== from && box.mid < centre).length;
        rows.forEach((el, i) => {
            if (i === from) return;
            let shift = 0;
            if (from < to && i > from && i <= to) shift = -slot;
            if (to < from && i >= to && i < from) shift = slot;
            el.style.transform = shift ? `translateY(${String(shift)}px)` : '';
        });
    };

    let frame = 0;
    const scroll = (): void => {
        if (scroller) {
            const box = scroller.getBoundingClientRect();
            const above = box.top + DRAG_EDGE_PX - pointerY;
            const below = pointerY - (box.bottom - DRAG_EDGE_PX);
            const by = above > 0 ? -above : below > 0 ? below : 0;
            const step = Math.max(
                -DRAG_MAX_SCROLL_PX,
                Math.min(DRAG_MAX_SCROLL_PX, Math.round(by / 3)),
            );
            if (step !== 0) {
                scroller.scrollTop += step;
                update();
            }
        }
        frame = requestAnimationFrame(scroll);
    };

    const done = new AbortController();
    const { signal } = done;
    const finish = (drop: boolean): void => {
        done.abort();
        cancelAnimationFrame(frame);
        for (const el of rows) el.style.transform = '';
        row.classList.remove('is-dragging');
        list.classList.remove('is-sorting');
        if (drop && to !== from) onDrop(from, to);
    };

    grip.setPointerCapture(event.pointerId);
    row.classList.add('is-dragging');
    list.classList.add('is-sorting');
    grip.addEventListener(
        'pointermove',
        (move) => {
            pointerY = move.clientY;
            update();
        },
        { signal },
    );
    grip.addEventListener(
        'pointerup',
        () => {
            finish(true);
        },
        { signal },
    );
    grip.addEventListener(
        'pointercancel',
        () => {
            finish(false);
        },
        { signal },
    );
    document.addEventListener(
        'keydown',
        (key) => {
            if (key.key !== 'Escape') return;
            key.preventDefault();
            key.stopPropagation();
            finish(false);
        },
        { signal, capture: true },
    );
    frame = requestAnimationFrame(scroll);
}
