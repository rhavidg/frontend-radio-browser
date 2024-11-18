module.exports = {
  // workaround for  "Unexpected token 'exports'" error when parsing preact
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    customExportConditions: [], // don't load "browser" field
  },
};
