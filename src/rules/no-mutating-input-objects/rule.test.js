import { describe, it } from "node:test";
import { RuleTester } from "eslint";
import noMutatingInputObjects from "./no-mutating-input-objects.js";

const tester = new RuleTester();

describe("no-mutating-input-objects", () => {
  it("allows mutating values in current scope", () => {
    tester.run("no-mutating-input-objects", noMutatingInputObjects, {
      invalid: [],
      valid: [
        {
          code: `const fun = () => {
              let a = 0;
              a = 1;
              const b = {};
              b.a = 1;
              b.c.d = 2;
              b.d.push(3);
            };`,
        },
      ],
    });
  });
  it("prevents mutating variables that are function inputs", () => {
    tester.run("no-mutating-input-objects", noMutatingInputObjects, {
      invalid: [
        {
          code: `const fun = (input) => {
              input.a = 1;
            };`,
          errors: [{ messageId: "noMutatingInputVariables" }]
        },
        {
          code: `function fun(input) {
              input = 1;
          };`,
          errors: [{ messageId: "noMutatingInputVariables" }]
        },
        {
          code: `function fun(input) {
              input.a = 1;
          };`,
          errors: [{ messageId: "noMutatingInputVariables" }]
        },
        {
          code: `function fun(input) {
              input.push(1);
          }`,
          errors: [{ messageId: "noMutatingInputVariables" }]
        },
        {
          code: `function fun(input) {
              input.values.others.push(1);
          }`,
          errors: [{ messageId: "noMutatingInputVariables" }]
        },
        {
          code: `function fun(input) {
              input.values.push(1);
          }`,
          errors: [{ messageId: "noMutatingInputVariables" }]
        },
        {
          code: `function fun1(input) {
                function fun2() {
                  input.values.push(1);
                }
              }`,
          errors: [{ messageId: "noMutatingInputVariables" }]
        },
      ],
      valid: [],
    });
  });
  it("prevents mutating variables that come from out of scope", () => {
    tester.run("no-mutating-input-objects", noMutatingInputObjects, {
      invalid: [
        {
          code: `
          let input = 0;
          function fun() {
              input = 1;
          };`,
          errors: [{ messageId: "noMutatingOutsideScope" }]
        },
        {
          code: `
          var input = 0;
          function fun() {
              input = 1;
          };`,
          errors: [{ messageId: "noMutatingOutsideScope" }]
        },
        {
          code: `
          const input = {};
          function fun() {
              input.a = 1;
          };`,
          errors: [{ messageId: "noMutatingOutsideScope" }]
        },
        {
          code: `
          const input = [];
          function fun() {
              input.push(1);
          }`,
          errors: [{ messageId: "noMutatingOutsideScope" }]
        },
        {
          code: `
          const input = [];
          function fun() {
              input.values.push(1);
          }`,
          errors: [{ messageId: "noMutatingOutsideScope" }]
        },
      ],
      valid: [],
    });
  });
});