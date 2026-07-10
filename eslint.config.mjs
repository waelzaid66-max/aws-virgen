import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

const mobileImportPatterns = [
  {
    group: [
      "**/banco-mobile/**",
      "@workspace/banco-mobile",
      "@workspace/banco-mobile/*",
    ],
    message: "Web surfaces must not import from banco-mobile (mobile-first isolation).",
  },
];

const b2bImportPatterns = [
  {
    group: [
      "**/dealer-os/**",
      "**/admin-os/**",
      "@workspace/dealer-os",
      "@workspace/dealer-os/*",
      "@workspace/admin-os",
      "@workspace/admin-os/*",
    ],
    message: "Consumer web must not import dealer-os or admin-os (B2B isolation).",
  },
];

const serverImportPatterns = [
  {
    group: [
      "**/api-server/**",
      "@workspace/api-server",
      "@workspace/api-server/*",
      "@workspace/db",
      "@workspace/db/*",
    ],
    message: "Consumer web must not import api-server or db (browser-only surface).",
  },
];

const webImportPatterns = [
  {
    group: [
      "**/banco-web/**",
      "@workspace/banco-web",
      "@workspace/banco-web/*",
    ],
    message: "banco-mobile must not import from banco-web.",
  },
];

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.expo/**",
      "**/build/**",
      "**/.next/**",
      "**/next-env.d.ts",
      "lib/api-client-react/**",
      "lib/api-zod/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx,mjs}"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "no-empty": ["warn", { allowEmptyCatch: true }],
    },
  },
  {
    files: [
      "artifacts/banco-web/**/*.{ts,tsx}",
      "artifacts/landing/**/*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        { patterns: [...mobileImportPatterns, ...b2bImportPatterns, ...serverImportPatterns] },
      ],
    },
  },
  {
    files: ["artifacts/banco-mobile/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: webImportPatterns }],
    },
  },
  {
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      sourceType: "module",
      ecmaVersion: 2022,
      globals: globals.node,
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
);
