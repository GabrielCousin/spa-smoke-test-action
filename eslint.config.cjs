/* eslint-disable @typescript-eslint/no-require-imports */
const eslint = require("@eslint/js");
const tsEslint = require("typescript-eslint");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const globals = require("globals");
const jestPlugin = require("eslint-plugin-jest");
const jestRecommendedConfig = jestPlugin.configs["flat/recommended"];

/**
 * @type {import('eslint').ESLint.Plugin}
 */
module.exports = [
  eslint.configs.recommended,
  ...tsEslint.configs.strict,
  eslintPluginPrettierRecommended,

  {
    ...jestRecommendedConfig,
    languageOptions: {
      globals: { ...globals.node },
    },
  },
];
