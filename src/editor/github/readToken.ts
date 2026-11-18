import { TOKEN_KEY } from '../constants';

/** The GitHub token saved in this browser, or `null` if there is none. */
export function readToken(): string | null {
    try {
        return localStorage.getItem(TOKEN_KEY);
    } catch {
        return null;
    }
}
