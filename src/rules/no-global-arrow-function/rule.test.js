import { RuleTester } from "eslint";
import { describe, it } from "node:test";
import noReassignObjects from "./no-global-arrow-function.js";

const tester = new RuleTester();

describe("no-global-arrow-function", function () {
  it("allows using arrow functions within function scopes", function () {
    tester.run("no-global-arrow-function", noReassignObjects, {
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
    tester.run("no-global-arrow-function", noReassignObjects, {
      valid: [],
      invalid: [
        {
          code: `export const fun = () => {};`,
          errors: [{ messageId: "noGlobalArrowExpressions" }],
          output: `export function fun(){}`,
        },
        {
          code: `const fun = () => {};`,
          errors: [{ messageId: "noGlobalArrowExpressions" }],
          output: `function fun(){}`,
        },
        {
          code: `const fun=()=>{};`,
          errors: [{ messageId: "noGlobalArrowExpressions" }],
          output: `function fun(){}`,
        },
        {
          code: `const fun = param => {};`,
          errors: [{ messageId: "noGlobalArrowExpressions" }],
          output: `function fun(param){}`,
        },
        {
          code: `const fun=(param)=>{};`,
          errors: [{ messageId: "noGlobalArrowExpressions" }],
          output: `function fun(param){}`,
        },
        {
          code: `const fun=(param1,param2)=>{};`,
          errors: [{ messageId: "noGlobalArrowExpressions" }],
          output: `function fun(param1, param2){}`,
        },
      ],
    });
  });
});