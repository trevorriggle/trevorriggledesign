/* ============================================================================
   ESLINT
   ============================================================================
   A hand-composed flat config rather than `extends("next/core-web-vitals",
   "next/typescript")`.

   Why: eslint-config-next pulls in typescript-eslint, which does not yet
   support TypeScript 7 and throws on import — so extending it makes `lint`
   crash rather than lint. This config takes the three plugins from that preset
   that do work (Next's own rules, react-hooks, jsx-a11y) and leaves out the
   typescript-eslint layer.

   The knock-on: @typescript-eslint/parser throws on TS 7 too, and it is the
   only usable TS parser for ESLint. So ESLint cannot read .ts/.tsx files at
   all in this toolchain, and the rules below are scoped to the JS it can
   parse. This is an upstream gap, tracked at
   github.com/typescript-eslint/typescript-eslint/issues/10940.

   What still covers the .tsx files meanwhile:
     · `pnpm typecheck` (tsc --noEmit) and `next build` both type-check fully
     · alt text is a required, validated content field, so the a11y defect
       ESLint would most likely catch cannot be introduced through content
     · `scripts/check-links.mjs` covers the href defects at build time

   To get the full preset back, pin TypeScript to ^6 in package.json and
   replace this file with:

     import { FlatCompat } from "@eslint/eslintrc";
     const compat = new FlatCompat({ baseDirectory: import.meta.dirname });
     export default [
       ...compat.extends("next/core-web-vitals", "next/typescript"),
       { ignores: [".next/**"] },
     ];

   That is a real tradeoff — a compiler major for a linter — so it is your call
   rather than mine. See DECISIONS.md.
   ========================================================================= */

import next from "@next/eslint-plugin-next";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default [
  {
    ignores: [".next/**", "node_modules/**", "out/**", "next-env.d.ts"],
  },

  {
    /* .ts/.tsx are absent deliberately — no parser can read them here. See
       the note at the top of this file. */
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      "@next/next": next,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...next.configs.recommended.rules,
      ...next.configs["core-web-vitals"].rules,
      ...reactHooks.configs.recommended.rules,

      /* Accessibility is a stated requirement of this site, so the a11y rules
         that catch real defects are errors rather than warnings. */
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-has-content": "error",
      "jsx-a11y/anchor-is-valid": "error",
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/aria-role": "error",
      "jsx-a11y/heading-has-content": "error",
      "jsx-a11y/img-redundant-alt": "error",
      "jsx-a11y/no-redundant-roles": "error",
      "jsx-a11y/role-has-required-aria-props": "error",
      "jsx-a11y/scope": "error",
    },
  },
];
