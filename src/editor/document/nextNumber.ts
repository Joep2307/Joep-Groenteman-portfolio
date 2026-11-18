import { pad } from '../util/pad';

/**
 * The next free two-digit number for ids starting with `prefix`. Ids in
 * the archive count too, so a restored part never clashes.
 */
export function nextNumber(doc: Document, prefix: string): string {
    const selector = `[id^="${prefix}"]`;
    const archived = [...doc.querySelectorAll('template')].flatMap(
        (template) => [...template.content.querySelectorAll(selector)],
    );
    const used = [...doc.querySelectorAll(selector), ...archived]
        .map((el) => parseInt(el.id.slice(prefix.length), 10))
        .filter((n) => Number.isFinite(n));
    return pad(Math.max(0, ...used) + 1);
}
