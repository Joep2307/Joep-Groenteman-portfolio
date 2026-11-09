import { pad } from '../util/pad';

/** The next free two-digit number for ids starting with `prefix`. */
export function nextNumber(doc: Document, prefix: string): string {
    const used = [...doc.querySelectorAll(`[id^="${prefix}"]`)]
        .map((el) => parseInt(el.id.slice(prefix.length), 10))
        .filter((n) => Number.isFinite(n));
    return pad(Math.max(0, ...used) + 1);
}
