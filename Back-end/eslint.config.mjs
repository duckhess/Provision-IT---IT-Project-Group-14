// eslint.config.mjs
import js from "@eslint/js";
import globals from "globals";
import jestPlugin from "eslint-plugin-jest";
import unicorn from "eslint-plugin-unicorn";
import prettier from "eslint-plugin-prettier";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.node },
    },
    plugins: { jest: jestPlugin, unicorn, prettier },
    rules: {
      // enforce snake_case for identifiers you write
      "id-match": [
        "error",
        "^[a-z][a-z0-9_]*$",
        { properties: false, onlyDeclarations: false, ignoreDestructuring: false },
      ],
      // enforce snake_case file names
      "unicorn/filename-case": ["error", { cases: { snakeCase: true } }],
      // run Prettier via ESLint
      "prettier/prettier": "error",
    },
    ignores: ["node_modules/**", "dist/**", "coverage/**"],
  },
  // Jest-specific rules for test files
  {
    files: ["**/*.test.js", "**/*.spec.js"],
    languageOptions: { globals: { ...globals.jest } },
    rules: { ...jestPlugin.configs.recommended.rules },
  },
];
