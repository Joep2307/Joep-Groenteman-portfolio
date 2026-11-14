import { TOKEN_URL, USER_AGENT } from './constants.js';

/**
 * Swaps the code GitHub sent back for a token. The token has no scopes:
 * it can only say who you are, and is dropped right after.
 */
export async function exchangeCode(
    code: string,
    redirectUri: string,
): Promise<string> {
    const res = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': USER_AGENT,
        },
        body: JSON.stringify({
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
            redirect_uri: redirectUri,
        }),
    });
    const data = (await res.json().catch(() => ({}))) as {
        access_token?: unknown;
    };
    if (!res.ok || typeof data.access_token !== 'string') {
        throw new Error(`GitHub refused the code (${String(res.status)}).`);
    }
    return data.access_token;
}
