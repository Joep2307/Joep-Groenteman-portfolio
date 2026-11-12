/** A number as at least two digits: 3 becomes "03". */
export function pad(n: number): string {
    return String(n).padStart(2, '0');
}
