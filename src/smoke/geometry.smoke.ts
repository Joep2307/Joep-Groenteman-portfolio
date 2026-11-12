import { expect, test } from '@playwright/test';

// A wasm build that fails to load only switches these effects off, with no
// error to see, so these look for the effects themselves.
test('the progress bar follows the page scroll', async ({ page }) => {
    const progress = page.locator('#progress');
    await page.goto('/');
    await expect(progress).toHaveAttribute('style', /width: 0%/);

    await page.evaluate(() => {
        window.scrollTo(0, document.documentElement.scrollHeight);
    });
    await expect(progress).toHaveAttribute('style', /width: 100%/);
});

test('a case image tilts toward the pointer', async ({ page }) => {
    const media = page.locator('.case-media').first();
    await page.goto('/');
    await expect(page.locator('#progress')).toHaveAttribute('style', /width/);

    await media.hover({ position: { x: 1, y: 1 } });
    await expect(media).toHaveAttribute('style', /rotateX\(1\.\d+deg\)/);
    await expect(media).toHaveAttribute('style', /rotateY\(-1\.\d+deg\)/);
});
