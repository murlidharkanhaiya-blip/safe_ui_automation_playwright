// @ts-check
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // Max time one test can run
  timeout: 180 * 1000, // 3 minutes per test

  // Global timeout for expect() assertions
  expect: {
    timeout: 45 * 1000, // 45 seconds for expect checks
  },

  // Run tests serially to avoid shared state issues across tests
  workers: 2,

  // ✅ Give failing tests 3 retry attempts (MOVED HERE)
  retries: 2,

  // Reporters
  reporter: [
    ['html', { open: 'never' }],
    ['allure-playwright']
  ],

  // Shared settings for all tests
  use: {
    browserName: 'chromium',
    headless: true,

    // Increased viewport for better report visuals
    viewport: { width: 1240, height: 800 },

    ignoreHTTPSErrors: true,

    actionTimeout: 30 * 1000,
    navigationTimeout: 60 * 1000,

    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
});