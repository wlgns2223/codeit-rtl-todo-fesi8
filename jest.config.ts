/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */
import nextJest from "next/jest";
import type { Config } from "jest";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  collectCoverage: true,
  clearMocks: true,
  coverageProvider: "v8",
  testEnvironment: "jest-fixed-jsdom",
  // testMatch: ["**/*.test.tsx"],
};

module.exports = createJestConfig(config);
