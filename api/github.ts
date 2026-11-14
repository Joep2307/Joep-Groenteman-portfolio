// Vercel serves each file in api/ at its path. The code is in src/server.
import { handleGithub } from '../src/server/handleGithub.js';

export const GET = handleGithub;
export const POST = handleGithub;
export const PATCH = handleGithub;
