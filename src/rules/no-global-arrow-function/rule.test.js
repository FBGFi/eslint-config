import { RuleTester } from "eslint";
import { describe, it } from "node:test";
import noReassignObjects from "./no-global-arrow-function.js";

const tester = new RuleTester();

describe("no-global-arrow-function", function () {
  it("allows using arrow functions within function scopes", function () {
    tester.run("no-reassign-objects", noReassignObjects, {
      valid: [
        {
          code: `{const fun = () => {};}`,
        },
        {
          code: `function fun(){const fun = () => {};}`,
        },
      ],
      invalid: [],
    });
  });
  it("prevents using arrow functions at global level", function () {
    tester.run("no-reassign-objects", noReassignObjects, {
      valid: [],
      invalid: [
        {
          code: `const fun = () => {};`,
          errors: [{ messageId: "noGlobalArrowExpressions" }]
        },],
    });
  });
});