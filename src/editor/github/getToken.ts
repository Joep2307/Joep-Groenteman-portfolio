import { TOKEN_KEY } from '../constants';

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}
