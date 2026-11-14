/** What to say on the login screen after a sign-in that did not work. */
export function loginMessage(reason: string | null): string {
    switch (reason) {
        case 'cancelled':
            return 'Sign-in was cancelled on GitHub.';
        case 'denied':
            return (
                "This GitHub account can't edit this site. Sign in with " +
                'the account that owns it.'
            );
        case 'expired':
            return 'The sign-in took too long. Try again.';
        case 'setup':
            return (
                "The login isn't set up yet: add GITHUB_CLIENT_ID, " +
                'GITHUB_CLIENT_SECRET, EDITOR_GITHUB_ID and SESSION_SECRET ' +
                'to the Vercel project and redeploy.'
            );
        case 'error':
            return "GitHub didn't answer as expected. Try again in a moment.";
        default:
            return '';
    }
}
