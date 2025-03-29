import { errorRules, omittedFromTests, plugins, warningRules } from "./index.js";
import { defineConfig } from "eslint/config";
import globals from "globals";

export { plugins };

export const recommended = {
  files: ["**/*.{js,ts,jsx,tsx}"],
  name: "@fbgfi/eslint-config",
  plugins,

  languageOptions: {
    globals: {
      ...globals.node
    }
  },
  rules: {
    "@fbgfi/no-global-arrow-function": "error",
    "@fbgfi/no-mutating-input-objects": "warn",
    "@fbgfi/no-reassign-objects": "warn",
    "@fbgfi/no-spread-in-reduce": "error",
    ...errorRules,
    ...warningRules,
    ...omittedFromTests
  }
};

export const testFileRules = {
  files: ["**/*.{test,spec}.{js,ts,jsx,tsx}"],
  rules: Object.keys(omittedFromTests).reduce((rules, key) => {
    rules[key] = "off";
    return rules;
  }, {}),
};

export default defineConfig([
  recommended,
  testFileRules,
]);