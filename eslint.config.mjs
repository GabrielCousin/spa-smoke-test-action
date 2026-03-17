import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";
import jest from "eslint-plugin-jest";

export default tseslint.config(
  { ignores: ["dist/**"] },
  {
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  eslint.configs.recommended,
  tseslint.configs.strict,
  eslintPluginPrettierRecommended,
  {
    files: ["**/*.test.ts"],
    ...jest.configs["flat/recommended"],
  },
);
