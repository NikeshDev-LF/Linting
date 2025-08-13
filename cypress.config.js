const { defineConfig } = require('cypress');
require('dotenv').config();

const baseUrl = process.env.BASE_URL || 'https://demoqa.com';
const defaultNavigationTimeout = Number(process.env.NAV_TIMEOUT_MS || 20000);
const defaultCommandTimeout = Number(process.env.CMD_TIMEOUT_MS || 10000);
const viewportWidth = Number(process.env.VIEWPORT_WIDTH || 1280);
const viewportHeight = Number(process.env.VIEWPORT_HEIGHT || 800);

module.exports = defineConfig({
  e2e: {
    baseUrl: baseUrl,
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    chromeWebSecurity: false,
    defaultCommandTimeout: defaultCommandTimeout,
    pageLoadTimeout: defaultNavigationTimeout,
    viewportWidth: viewportWidth,
    viewportHeight: viewportHeight,
    video: false,
    blockHosts: [
      '*.doubleclick.net',
      '*.googlesyndication.com',
      '*.googletagservices.com',
      '*.adnxs.com',
      '*.ad.plus',
      'cdn.ad.plus',
    ],
  },
  retries: {
    runMode: 1,
    openMode: 0,
  },
});
