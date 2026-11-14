/**
 * Why a sign-in did not work, as it goes back to the editor in
 * `/dev/?login=`.
 */
export type LoginFailure =
    'cancelled' | 'denied' | 'expired' | 'error' | 'setup';
