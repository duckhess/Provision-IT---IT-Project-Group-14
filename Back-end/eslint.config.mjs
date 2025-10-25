/* eslint-disable id-match */

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
      "id-match": [
        "error",
        "^[a-z][a-z0-9_]*$|^[A-Z][a-zA-Z0-9]*$|^[A-Z0-9_]+$",
        {
          properties: false,
          onlyDeclarations: false,
          ignoreDestructuring: false,
        },
      ],

      "unicorn/filename-case": ["error", { cases: { snakeCase: true } }],

      "prettier/prettier": "error",
    },
    ignores: ["node_modules/**", "dist/**", "coverage/**"],
  },

  {
    files: ["**/*.test.js", "**/*.spec.js"],
    languageOptions: { globals: { ...globals.jest } },
    rules: { ...jestPlugin.configs.recommended.rules },
  },
];
