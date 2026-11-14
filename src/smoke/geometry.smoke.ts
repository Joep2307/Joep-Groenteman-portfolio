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

test("a shape moves out of the pointer's way", async ({ page }) => {
    const pills = page.locator('.hero-shapes .shape-pills');
    await page.goto('/');
    await expect(page.locator('#progress')).toHaveAttribute('style', /width/);
    // The shapes slide in on load; measure where they come to rest.
    await page.evaluate(() =>
        Promise.all(document.getAnimations().map((item) => item.finished)),
    );
    const box = await pills.boundingBox();
    if (!box) throw new Error('the hero shape is not on the page');

    // Just left of the shape's centre, so it is pushed to the right.
    await page.mouse.move(box.x + box.width / 2 - 40, box.y + box.height / 2);
    await expect
        .poll(async () => (await pills.boundingBox())?.x ?? 0)
        .toBeGreaterThan(box.x + 10);
});

test('a case image tilts toward the pointer', async ({ page }) => {
    const media = page.locator('.case-media').first();
    await page.goto('/');
    await expect(page.locator('#progress')).toHaveAttribute('style', /width/);

    // Inside the rounded corner, which clips the image's very corner.
    await media.hover({ position: { x: 16, y: 16 } });
    await expect(media).toHaveAttribute('style', /rotateX\(1\.\d+deg\)/);
    await expect(media).toHaveAttribute('style', /rotateY\(-1\.\d+deg\)/);
});
