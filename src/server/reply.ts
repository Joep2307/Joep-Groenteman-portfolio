/** A JSON answer with a message, never cached. */
export function reply(status: number, message: string): Response {
    return Response.json(
        { message },
        { status, headers: { 'Cache-Control': 'no-store' } },
    );
}
