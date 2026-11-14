// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { signSession } from './signSession';
import { verifySession } from './verifySession';

const NOW = 1_800_000_000;
const session = { id: 42, login: 'joep', exp: NOW + 60 };

describe('signSession and verifySession', () => {
    it('reads back a session it signed', () => {
        const value = signSession(session, 'secret');
        expect(verifySession(value, 'secret', NOW)).toEqual(session);
    });

    it('refuses another secret', () => {
        const value = signSession(session, 'secret');
        expect(verifySession(value, 'other', NOW)).toBeNull();
    });

    it('refuses a changed payload', () => {
        const [, signature] = signSession(session, 'secret').split('.');
        const forged = Buffer.from(
            JSON.stringify({ ...session, id: 1 }),
        ).toString('base64url');
        expect(
            verifySession(`${forged}.${signature ?? ''}`, 'secret', NOW),
        ).toBeNull();
    });

    it('refuses a changed signature', () => {
        const value = signSession(session, 'secret');
        expect(verifySession(`${value}x`, 'secret', NOW)).toBeNull();
    });

    it('refuses an expired session', () => {
        const value = signSession(session, 'secret');
        expect(verifySession(value, 'secret', NOW + 60)).toBeNull();
    });

    it('refuses rubbish', () => {
        for (const value of ['', '.', 'a.b.c', 'abc']) {
            expect(verifySession(value, 'secret', NOW)).toBeNull();
        }
    });
});
