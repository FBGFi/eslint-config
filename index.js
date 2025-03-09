/* eslint-disable no-magic-numbers */
import {
  noGlobalArrowFunction,
  noMutatingInputObjects,
  noReassignObjects,
  noSpreadInReduce
} from "./src/index.js";

export const plugins = {
  "@fbgfi": {
    rules: {
      "no-global-arrow-function": noGlobalArrowFunction,
      "no-mutating-input-objects": noMutatingInputObjects,
      "no-reassign-objects": noReassignObjects,
      "no-spread-in-reduce": noSpreadInReduce,
    }
  },
};

/** https://eslint.org/docs/latest/rules */
/** Rules that most likely are undesired and might cause bugs */
export const errorRules = {
  "array-callback-return": "error",
  "constructor-super": "error",
  "curly": "error",
  "default-param-last": "error",
  "dot-notation": "error",
  "eqeqeq": "error",
  "no-case-declarations": "error",
  "no-dupe-args": "error",
  "no-dupe-class-members": "error",
  "no-dupe-else-if": "error",
  "no-dupe-keys": "error",
  "no-duplicate-case": "error",
  "no-duplicate-imports": "error",
  "no-else-return": "error",
  "no-empty": "error",
  "no-empty-function": "error",
  "no-empty-pattern": "error",
  "no-ex-assign": "error",
  "no-fallthrough": "error",
  "no-func-assign": "error",
  "no-import-assign": "error",
  "no-inner-declarations": "error",
  "no-invalid-this": "error",
  "no-irregular-whitespace": "error",
  "no-labels": "error",
  "no-lone-blocks": "error",
  "no-self-assign": "error",
  "no-self-compare": "error",
  "no-sequences": "error",
  "no-sparse-arrays": "error",
  "no-template-curly-in-string": "error",
  "no-this-before-super": "error",
  "no-throw-literal": "error",
  "no-undef": "error",
  "no-unexpected-multiline": "error",
  "no-unmodified-loop-condition": "error",
  "no-unreachable": "error",
  "no-unreachable-loop": "error",
  "no-unsafe-negation": "error",
  "no-unsafe-optional-chaining": "error",
  "no-unused-expressions": "error",
  "no-unused-private-class-members": "error",
  "no-unused-vars": "error",
  "no-use-before-define": "error",
  "no-useless-assignment": "error",
  "no-useless-concat": "error",
  "no-var": "error",
  "prefer-arrow-callback": "error",
  "prefer-const": "error",
  "sort-imports": "error",
  "sort-keys": "error",
  "sort-vars": "error",
};

/** Rules that might not always lead to unwanted behavior, but are generally undesired */
export const warningRules = {
  "complexity": ["warn", 10],
  "default-case": "warn",
  "max-depth": ["warn", 3],
  "max-nested-callbacks": ["warn", 3],
  "max-params": ["warn", 3],
  "max-statements": ["warn", 20],
  "no-cond-assign": "warn",
  "no-console": "warn",
  "no-constant-condition": "warn",
  "no-global-assign": "warn",
  "no-inline-comments": "warn",
  "no-loss-of-precision": "warn",
  "no-magic-numbers": ["warn", { ignore: [0, 1] }],
  "no-multi-assign": "warn",
  "no-nested-ternary": "warn",
  "no-shadow": "warn",
  "require-await": "warn",
  "require-yield": "warn",
};

/** Warnings that are unwanted behavior in regular files, but should be omitted from test files */
export const omittedFromTests = {
  "max-lines": ["warn", { max: 150, skipBlankLines: true, skipComments: true }],
  "max-lines-per-function": ["warn", { max: 30, skipBlankLines: true, skipComments: true }],
};