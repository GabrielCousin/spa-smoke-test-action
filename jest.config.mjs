export default {
  testEnvironment: "node",
  clearMocks: true,
  extensionsToTreatAsEsm: [".ts"],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts", "!**/node_modules/**", "!src/index.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
  },
};
