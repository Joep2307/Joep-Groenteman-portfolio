import { TOKEN_KEY } from '../constants';

/** Removes the GitHub token from this browser. */
export function forgetToken(): void {
    try {
        localStorage.removeItem(TOKEN_KEY);
    } catch {
        // Nothing was saved, so there is nothing to forget.
    }
}
