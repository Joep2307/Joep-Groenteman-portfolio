/**
 * Moves an item from one place in a list to another, as a run of swaps
 * between neighbours, so any list that can swap can be dragged.
 */
export function moveItem<T>(
    items: readonly T[],
    from: number,
    to: number,
    swap: (items: readonly T[], a: number, b: number) => void,
): void {
    // The swaps change the page, so keep a copy of the order in step.
    const order = [...items];
    const step = to > from ? 1 : -1;
    for (let i = from; i !== to; i += step) {
        swap(order, i, i + step);
        order.splice(i + step, 0, ...order.splice(i, 1));
    }
}
