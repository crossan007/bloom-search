const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
    preset: 'ts-jest',
  testEnvironment: 'node',
  // Optionally, specify testMatch if your tests are not in __tests__:
  testMatch: ['**/*.test.ts'],
};