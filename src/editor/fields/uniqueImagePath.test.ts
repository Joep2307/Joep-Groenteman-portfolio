import { describe, expect, it } from 'vitest';
import { uniqueImagePath } from './uniqueImagePath';

describe('uniqueImagePath', () => {
    it('makes a tidy slug and lowercases the extension', () => {
        expect(uniqueImagePath([], 'My Photo (1).JPG')).toBe(
            'img/my-photo-1.jpg',
        );
    });

    it('numbers the name when the path is taken', () => {
        const known = ['img/photo.png', 'img/photo-2.png'];

        expect(uniqueImagePath(known, 'photo.png')).toBe('img/photo-3.png');
    });

    it('falls back to a name and extension when there are none', () => {
        expect(uniqueImagePath([], '###')).toBe('img/image.jpg');
        expect(uniqueImagePath([], 'sketch')).toBe('img/sketch.jpg');
    });
});
