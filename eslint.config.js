import { errorRules, omittedFromTests, plugins, warningRules } from "./index.js";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    name: "@fbgfi/eslint-config",
    plugins,
    rules: {
      "@fbgfi/no-global-arrow-function": "error",
      "@fbgfi/no-mutating-input-objects": "warn",
      "@fbgfi/no-reassign-objects": "error",
      "@fbgfi/no-spread-in-reduce": "error",
      ...errorRules,
      ...warningRules,
      ...omittedFromTests
    }
  },
  {
    files: ["**/*.{test,spec}.{js,ts,jsx,tsx}"],
    rules: Object.keys(omittedFromTests).reduce((rules, key) => {
      rules[key] = "off";
      return rules;
    }, {}),
  }
]);