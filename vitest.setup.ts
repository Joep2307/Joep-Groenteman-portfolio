import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// The wasm loader fetches the module by URL, which Node cannot do for a
// root-relative path. Serve `.wasm` requests from disk instead.
const realFetch = globalThis.fetch;

globalThis.fetch = async (input, init) => {
    const url = input instanceof Request ? input.url : String(input);
    if (!url.endsWith('.wasm')) return realFetch(input, init);
    const file = resolve(
        import.meta.dirname,
        `.${new URL(url, 'http://x').pathname}`,
    );
    return new Response(await readFile(file), {
        headers: { 'Content-Type': 'application/wasm' },
    });
};
