import { SESSION_ENV } from './constants.js';
import { currentSession } from './currentSession.js';
import { notSetUp } from './notSetUp.js';
import { reply } from './reply.js';

/** `GET /api/auth/me`: who is logged in, or 401. */
export function handleMe(request: Request): Response {
    const problem = notSetUp(SESSION_ENV);
    if (problem) return problem;
    const session = currentSession(request);
    if (!session) return reply(401, 'Not logged in.');
    return Response.json(
        { login: session.login },
        { headers: { 'Cache-Control': 'no-store' } },
    );
}
