export default {
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.js", "!src/**/index.js", "!**/node_modules/**"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
};
