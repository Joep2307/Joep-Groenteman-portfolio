import { PASSWORD_KEY } from '../constants';

/** The editor password kept in this browser, if there is one. */
export function getPassword(): string | null {
    return localStorage.getItem(PASSWORD_KEY);
}
