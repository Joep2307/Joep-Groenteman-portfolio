import type { IncomingMessage } from 'node:http';

/** The body of a Node request as text, for the methods that have one. */
export async function readBody(req: IncomingMessage): Promise<string | null> {
    if (req.method === 'GET' || req.method === 'HEAD') return null;
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(chunk as Buffer);
    return Buffer.concat(chunks).toString();
}
