const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    failOnStatusCode: true,
    baseUrl: "https://serverest.dev",
  },
});