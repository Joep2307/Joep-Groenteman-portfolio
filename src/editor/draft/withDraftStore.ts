import { DRAFT_DATABASE, DRAFT_STORE } from '../constants';

/** Runs one request against the draft store and resolves to its result. */
export function withDraftStore<T>(
    mode: IDBTransactionMode,
    run: (kv: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
    return new Promise((resolve, reject) => {
        const open = indexedDB.open(DRAFT_DATABASE, 1);
        open.onupgradeneeded = () => {
            open.result.createObjectStore(DRAFT_STORE);
        };
        open.onerror = () => {
            reject(open.error ?? new Error('The draft store did not open.'));
        };
        open.onsuccess = () => {
            const tx = open.result.transaction(DRAFT_STORE, mode);
            const req = run(tx.objectStore(DRAFT_STORE));
            tx.oncomplete = () => {
                open.result.close();
                resolve(req.result);
            };
            tx.onerror = () => {
                open.result.close();
                reject(tx.error ?? new Error('The draft store failed.'));
            };
        };
    });
}
