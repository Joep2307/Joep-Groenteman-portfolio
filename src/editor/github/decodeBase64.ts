/** Decodes the base64 the contents API returns into UTF-8 text. */
export function decodeBase64(b64: string): string {
    const bytes = Uint8Array.from(atob(b64.replace(/\n/g, '')), (c) =>
        c.charCodeAt(0),
    );
    return new TextDecoder().decode(bytes);
}
