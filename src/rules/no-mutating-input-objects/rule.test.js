import { RuleTester } from "eslint";
import { describe, it } from "node:test";
import noMutatingInputObjects from "./no-mutating-input-objects.js";

const tester = new RuleTester();

describe("no-mutating-input-objects", function () {
  it("allows mutating values in current scope", function () {
    tester.run("no-mutating-input-objects", noMutatingInputObjects, {
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
      invalid: [],
    });
  });
  it("prevents mutating variables that are function inputs", function () {
    tester.run("no-mutating-input-objects", noMutatingInputObjects, {
      valid: [],
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
    });
  });
  it("prevents mutating variables that come from out of scope", function () {
    tester.run("no-mutating-input-objects", noMutatingInputObjects, {
      valid: [],
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
              input.values.push(1);
          }`,
          errors: [{ messageId: "noMutatingOutsideScope" }]
        },
      ],
    });
  });
});