import { defineConfig } from "eslint/config";

import {
  noReassignObjects,
  noGlobalArrowFunction,
  noMutatingInputObjects,
  noSpreadInReduce
} from "./src/index.js";

export default defineConfig([
  {
    name: "@fbgfi/eslint-config",
    files: ["**/*.{js,ts,jsx,tsx}"],
    plugins: {
      "@fbgfi": {
        rules: {
          "no-global-arrow-function": noGlobalArrowFunction,
          "no-mutating-input-objects": noMutatingInputObjects,
          "no-reassign-objects": noReassignObjects,
          "no-spread-in-reduce": noSpreadInReduce,
        }
      },
    },
    rules: {
      "@fbgfi/no-global-arrow-function": "error",
      "@fbgfi/no-mutating-input-objects": "warn",
      "@fbgfi/no-reassign-objects": "error",
      "@fbgfi/no-spread-in-reduce": "error",
    }
  },
]);