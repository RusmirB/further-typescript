import { defineConfig, devices } from '@playwright/test';
import process from 'process';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // Default timeout for each test. It is possible to override this value in each test.
  timeout: 60 * 1000,
  // Default timeout for each step in a test. It is possible to override this value in each test.
  expect: { timeout: 15 * 1000 },
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 2,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    trace: 'on',
  },

  /* Configure projects*/
  projects: [
    {
      name: 'ui_tests',
      testDir: './tests/ui',
      use: {
        baseURL: 'https://www.talkfurther.com',
        screenshot: 'only-on-failure',
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'api_tests',
      testDir: './tests/api',
      use: {
        baseURL: 'https://fakerestapi.azurewebsites.net',
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
        },
      },
    },
  ],
});
