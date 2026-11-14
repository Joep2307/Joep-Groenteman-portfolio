import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';

const API = 'https://api.github.com/repos/*/*';

/** Answers the editor's GitHub reads from the working tree. */
async function mockGithub(page: Page): Promise<void> {
    const html = readFileSync('exe/index.html');
    await page.route(`${API}/git/ref/heads/*`, (route) =>
        route.fulfill({ json: { object: { sha: 'head' } } }),
    );
    await page.route(`${API}/contents/exe/index.html?*`, (route) =>
        route.fulfill({
            json: { sha: 'blob', content: html.toString('base64') },
        }),
    );
    await page.route(`${API}/contents/exe/img?*`, (route) =>
        route.fulfill({ json: [] }),
    );
}

test('the editor is served at /dev/', async ({ page }) => {
    await mockGithub(page);
    const response = await page.goto('/dev/');
    expect(response?.status()).toBe(200);
    await expect(page.locator('body')).not.toBeEmpty();
});

test('without a token the editor opens straight away', async ({ page }) => {
    await mockGithub(page);
    await page.goto('/dev/');
    await expect(
        page.getByRole('button', { name: 'Site settings' }),
    ).toBeVisible();
    await expect(page.getByLabel('GitHub token')).toHaveCount(0);
});

test('connecting asks for the token and can be left', async ({ page }) => {
    await mockGithub(page);
    await page.goto('/dev/');
    await page.getByRole('button', { name: 'Connect GitHub' }).click();
    await expect(page.getByLabel('GitHub token')).toBeVisible();
    await page.getByRole('button', { name: 'Back to editing' }).click();
    await expect(
        page.getByRole('button', { name: 'Site settings' }),
    ).toBeVisible();
});
