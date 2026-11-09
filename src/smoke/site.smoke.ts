import { expect, test } from '@playwright/test';

test('the site loads with no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
    });
    await page.goto('/');
    await expect(page.locator('#intro')).toBeVisible();
    expect(errors).toEqual([]);
});

test('the name beside the logo hides while the page is scrolled', async ({
    page,
}) => {
    const hidden = 'rgba(0, 0, 0, 0)';
    const link = page.locator('.topnav .mark a');
    await page.goto('/');
    await expect(link).not.toHaveCSS('color', hidden);

    await page.evaluate(() => {
        window.scrollTo(0, 300);
    });
    await expect(link).toHaveCSS('color', hidden);
    await expect(link.locator('img')).toBeVisible();
    await expect(link).toHaveAccessibleName(/Joep/);

    await page.evaluate(() => {
        window.scrollTo(0, 0);
    });
    await expect(link).not.toHaveCSS('color', hidden);
});
