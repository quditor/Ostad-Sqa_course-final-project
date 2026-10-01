const { devices } = require('@playwright/test');

// @ts-check
require('dotenv').config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
const config = ({
  testDir: './tests',
  timeout: 60 * 1000, // Total test timeout
  expect: {
    timeout: 15000
  },

  workers: 1, // run tests one after another
  retries: process.env.CI ? 2 : 0,
  forbidOnly: !!process.env.CI,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', { resultsDir: 'allure-results' }],
  ],

  projects: [
    {
      name: 'Chrome',
      use: {
        browserName: 'chromium',
        headless: true,
        actionTimeout: 10 * 1000,
        navigationTimeout: 30 * 1000,
        screenshot: 'only-on-failure',
        trace: 'on',
        ignoreHTTPSErrors: true,
        permissions: ['geolocation'],
      },
    },
  ],
});

module.exports = config;