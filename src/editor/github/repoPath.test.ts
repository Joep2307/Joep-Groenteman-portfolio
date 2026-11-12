import { describe, expect, it } from 'vitest';
import { repoPath } from './repoPath';

describe('repoPath', () => {
    it('keeps an image beside the page', () => {
        expect(repoPath('img/the-line-hero.jpg')).toBe(
            'exe/img/the-line-hero.jpg',
        );
    });

    it('puts any other file in the public folder', () => {
        expect(repoPath('Joep_Groenteman_CV.pdf')).toBe(
            'exe/public/Joep_Groenteman_CV.pdf',
        );
    });

    it('reads a path from the site root like a relative one', () => {
        expect(repoPath('/img/logo.svg')).toBe('exe/img/logo.svg');
    });
});
