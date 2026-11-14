/**
 * Whether a request that changes something came from the site itself.
 * Browsers always send `Origin` with such requests, so a missing one is
 * refused too.
 */
export function isSameOrigin(request: Request): boolean {
    return request.headers.get('origin') === new URL(request.url).origin;
}
