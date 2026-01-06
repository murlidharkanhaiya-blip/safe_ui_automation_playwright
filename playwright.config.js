import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  use: {
    browserName: 'chromium',
    headless: true,

    // ✅ ADD THIS
    //baseURL: 'https://fd-mqa.xavlab.xyz',
  },

  timeout: 60000,


  // Give failing tests 3 retry attempts
  //retries: 3,
});