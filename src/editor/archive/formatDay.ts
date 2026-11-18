/** A date such as 2026-11-18 as "18 Nov 2026". */
export function formatDay(iso: string | undefined): string {
    const date = new Date(`${iso ?? ''}T00:00:00`);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}
