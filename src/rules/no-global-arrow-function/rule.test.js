import { describe, it } from "node:test";
import { RuleTester } from "eslint";
import noReassignObjects from "./no-global-arrow-function.js";

const tester = new RuleTester();

describe("no-global-arrow-function", () => {
  it("allows using arrow functions within function scopes", () => {
    tester.run("no-global-arrow-function", noReassignObjects, {
      invalid: [],
      valid: [
        {
          code: `{const fun = () => {};}`,
        },
        {
          code: `function fun(){const fun = () => {};}`,
        },
      ],
    });
  });
  it("prevents using arrow functions at global level", () => {
    tester.run("no-global-arrow-function", noReassignObjects, {
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
      valid: [],
    });
  });
});