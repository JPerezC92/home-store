import expoConfig from "eslint-config-expo/flat.js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...expoConfig,
  {
    ignores: ["node_modules", ".expo", "dist"],
  },
  {
    rules: {
      // Expo specific overrides
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      // Align with monorepo standards
      "react/react-in-jsx-scope": "off",
    },
  },
];
