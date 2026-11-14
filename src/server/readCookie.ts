/** The value of one cookie the browser sent, or `null`. */
export function readCookie(request: Request, name: string): string | null {
    const header = request.headers.get('cookie') ?? '';
    for (const part of header.split(';')) {
        const [key = '', ...value] = part.trim().split('=');
        if (key === name) return decodeURIComponent(value.join('='));
    }
    return null;
}
