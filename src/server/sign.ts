import { createHmac } from 'node:crypto';

/** The HMAC-SHA256 of `text` under `secret`, as base64url. */
export function sign(text: string, secret: string): string {
    return createHmac('sha256', secret).update(text).digest('base64url');
}
