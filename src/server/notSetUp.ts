import { reply } from './reply.js';

/**
 * A 503 naming the environment variables that are missing, or `null` when
 * all of them are set.
 */
export function notSetUp(names: readonly string[]): Response | null {
    const missing = names.filter((name) => !process.env[name]);
    if (!missing.length) return null;
    return reply(
        503,
        `The editor login is not set up yet: add ${missing.join(', ')} ` +
            'to the Vercel project and redeploy.',
    );
}
