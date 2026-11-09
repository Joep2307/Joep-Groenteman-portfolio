import { expect, test } from '@playwright/test';

test('the editor is served at /dev/', async ({ page }) => {
    const response = await page.goto('/dev/');
    expect(response?.status()).toBe(200);
    await expect(page.locator('body')).not.toBeEmpty();
});

test('without a token the editor shows the login screen', async ({ page }) => {
    await page.goto('/dev/');
    await expect(
        page.getByRole('heading', { name: 'Portfolio editor' }),
    ).toBeVisible();
    await expect(page.getByLabel('GitHub token')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Connect' })).toBeVisible();
});
