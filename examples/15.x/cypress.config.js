const { defineConfig } = require("cypress");

module.exports = defineConfig({
  video: false,
  screenshotOnRunFailure: false,
  chromeWebSecurity: false,
  e2e: {
    setupNodeEvents(_on, _config) {},
  },
});
