import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadEnv, type Plugin } from 'vite';
import { readBody } from './readBody';

/**
 * Serves the functions in `api/` from `pnpm dev`, as Vercel does once
 * deployed, with the variables from `.env.local` in the repository root.
 */
export function apiDevServer(repoRoot: string): Plugin {
    return {
        name: 'api-dev-server',
        apply: 'serve',
        configureServer(server) {
            const env = loadEnv('development', repoRoot, '');
            for (const [key, value] of Object.entries(env)) {
                process.env[key] ??= value;
            }
            server.middlewares.use((req, res, next) => {
                const url = new URL(
                    req.url ?? '/',
                    `http://${req.headers.host ?? 'localhost'}`,
                );
                const file = resolve(repoRoot, `.${url.pathname}.ts`);
                if (
                    !url.pathname.startsWith('/api/') ||
                    !file.startsWith(resolve(repoRoot, 'api')) ||
                    !existsSync(file)
                ) {
                    next();
                    return;
                }
                void (async () => {
                    const handlers = await server.ssrLoadModule(file);
                    const handler: unknown = handlers[req.method ?? 'GET'];
                    if (typeof handler !== 'function') {
                        res.statusCode = 405;
                        res.end();
                        return;
                    }
                    const headers = new Headers();
                    for (const [key, value] of Object.entries(req.headers)) {
                        if (typeof value === 'string') {
                            headers.set(key, value);
                        }
                    }
                    const request = new Request(url, {
                        method: req.method ?? 'GET',
                        headers,
                        body: await readBody(req),
                    });
                    const response = await (
                        handler as (r: Request) => Promise<Response>
                    )(request);
                    res.statusCode = response.status;
                    response.headers.forEach((value, key) => {
                        if (key !== 'set-cookie') res.setHeader(key, value);
                    });
                    const cookies = response.headers.getSetCookie();
                    if (cookies.length) res.setHeader('Set-Cookie', cookies);
                    res.end(Buffer.from(await response.arrayBuffer()));
                })().catch(next);
            });
        },
    };
}
