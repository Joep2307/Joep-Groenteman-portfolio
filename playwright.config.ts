import { defineConfig, devices } from '@playwright/test';

const { BASE_URL, CI } = process.env;
const LOCAL_URL = 'http://localhost:4173';

export default defineConfig({
    testDir: 'src/smoke',
    testMatch: '*.{smoke,visual}.ts',
    snapshotPathTemplate: 'src/smoke/baseline/{projectName}/{arg}{ext}',
    forbidOnly: CI !== undefined,
    reporter: 'list',
    use: { baseURL: BASE_URL ?? LOCAL_URL },
    expect: { toHaveScreenshot: { threshold: 0.02, maxDiffPixels: 0 } },
    projects: [
        {
            name: 'smoke',
            testMatch: '*.smoke.ts',
            use: devices['Desktop Chrome'],
        },
        {
            name: 'visual-desktop',
            testMatch: '*.visual.ts',
            // Glyph anti-aliasing varies now and then. A real change fails
            // every attempt.
            retries: 2,
            use: devices['Desktop Chrome'],
        },
        {
            name: 'visual-mobile',
            testMatch: '*.visual.ts',
            // Glyph anti-aliasing varies now and then. A real change fails
            // every attempt.
            retries: 2,
            use: devices['Pixel 7'],
        },
    ],
    // BASE_URL points at a site that is already running, such as the live
    // one when capturing the baseline.
    ...(BASE_URL === undefined && {
        webServer: {
            // Vite directly: pnpm keeps it alive after the tests finish.
            command:
                'pnpm build && ' +
                'node_modules/.bin/vite preview --port 4173 --strictPort',
            url: LOCAL_URL,
            reuseExistingServer: CI === undefined,
        },
    }),
});
