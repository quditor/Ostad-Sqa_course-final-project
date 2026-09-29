const { devices } = require('@playwright/test');
const { permission } = require('node:process');

// @ts-check
require('dotenv').config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
const config = ({
  testDir: './tests',
  timeout: 50 * 1000, // Total test timeout
  expect: {
    timeout: 5000
  },

  reporter: 'html',
//  use: {
 //   browserName: 'chromium',
 //   headless: true,
 //   navigationTimeout: 60 * 1000, // Explicitly give page.goto extra breathing room
  //}
  projects:[ 

    {
    name: 'Chrome',
    use:{
      browserName:'chromium',
      headless: false,
      actionTimeout: 10*1000,
      navigationTimeout: 30*1000,
      screenshot:'only-on-failure',
      trace:'on',
     //...devices['Pixel 10 Pro'],
     ignoreHTTPSErrors:true,
     permissions:['geolocation'],

    },
  },
], 
});

module.exports = config;