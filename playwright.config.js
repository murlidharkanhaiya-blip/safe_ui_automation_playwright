import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // Timeout settings
  timeout: 60000,

  // Retry failing tests 3 times
  retries: 3,

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],  // HTML reporter
    ['list'],                                          // Console output
    ['allure-playwright', {                            // Allure reporter
      outputFolder: 'allure-results',
      detail: true,
      suiteTitle: true,
      categories: [
        {
          name: 'Flaky tests',
          matchedStatuses: ['flaky']
        },
        {
          name: 'Failed tests',
          matchedStatuses: ['failed']
        },
        {
          name: 'Broken tests',
          matchedStatuses: ['broken']
        }
      ],
      environmentInfo: {
        'Test Environment': 'MQA',
        'Browser': 'Chromium',
        'Platform': 'Windows',
        'Framework': 'Playwright'
      }
    }],
    ['json', { outputFile: 'test-results/results.json' }]  // JSON reporter
  ],

  use: {
    // Browser settings
    browserName: 'chromium',
    headless: true,

    // Base URL (uncomment when needed)
    // baseURL: 'https://fd-mqa.xavlab.xyz',

    // Screenshot settings
    screenshot: 'only-on-failure',

    // Video settings
    video: 'retain-on-failure',

    // Trace settings
    trace: 'on-first-retry',

    // Viewport
    viewport: { width: 1920, height: 1080 },

    // Action timeout
    actionTimeout: 15000,

    // Navigation timeout
    navigationTimeout: 30000,
  },

  // Projects for different browsers (optional)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment to add more browsers
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});