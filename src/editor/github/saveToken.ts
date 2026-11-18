import { TOKEN_KEY } from '../constants';

/**
 * Keeps the GitHub token in this browser until you log out. Returns
 * whether it could, since a private window may not allow it.
 */
export function saveToken(token: string): boolean {
    try {
        localStorage.setItem(TOKEN_KEY, token);
        return true;
    } catch {
        return false;
    }
}
