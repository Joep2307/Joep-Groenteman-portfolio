import { createHash, timingSafeEqual } from 'node:crypto';

/** Compares in constant time, so timing gives nothing away. */
export function safeEqual(given: string, expected: string): boolean {
    const digest = (text: string): Buffer =>
        createHash('sha256').update(text).digest();
    return timingSafeEqual(digest(given), digest(expected));
}
