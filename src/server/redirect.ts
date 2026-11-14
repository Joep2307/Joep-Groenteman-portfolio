/** A redirect that also sets cookies. */
export function redirect(
    location: string,
    cookies: readonly string[] = [],
): Response {
    const headers = new Headers({
        Location: location,
        'Cache-Control': 'no-store',
    });
    for (const cookie of cookies) headers.append('Set-Cookie', cookie);
    return new Response(null, { status: 302, headers });
}
