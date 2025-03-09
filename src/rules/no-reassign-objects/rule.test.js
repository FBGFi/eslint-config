import { describe, it } from "node:test";
import { RuleTester } from "eslint";
import noReassignObjects from "./no-reassign-objects.js";

const tester = new RuleTester();

describe("no-reassign-objects", () => {
  const validAssignmentCases = [
    {
      value: "{}",
      variableType: "const",
    },
    {
      value: "[]",
      variableType: "const",
    },
    {
      value: "''",
      variableType: "let",
    },
    {
      value: "''",
      variableType: "var",
    },
    {
      value: "0",
      variableType: "let",
    },
    {
      value: "0",
      variableType: "var",
    },
    {
      value: "false",
      variableType: "let",
    },
    {
      value: "false",
      variableType: "var",
    },
    {
      value: "undefined",
      variableType: "let",
    },
    {
      value: "undefined",
      variableType: "var",
    },
    {
      value: "null",
      variableType: "let",
    },
    {
      value: "null",
      variableType: "var",
    },
  ];

  validAssignmentCases.forEach(({ variableType, value }) => {
    it(`allows assigning to ${variableType} for ${value}`, () => {
      tester.run("no-reassign-objects", noReassignObjects, {
        invalid: [],
        valid: [
          {
            code: `${variableType} variable = ${value};`,
          },
        ],
      });
    })
  });

  const validReAssignmentCases = ["''", "0", "false", "undefined", "null"];

  validReAssignmentCases.forEach((value) => {
    it(`allows re-assigment for ${value}`, () => {
      tester.run("no-reassign-objects", noReassignObjects, {
        invalid: [],
        valid: [
          {
            code: `variable = ${value};`,
          },
        ],
      });
    })
  });

  const invalidAssignmentCases = [
    {
      value: "{}",
      variableType: "let",
    },
    {
      value: "{}",
      variableType: "var",
    },
    {
      value: "[]",
      variableType: "let",
    },
    {
      value: "[]",
      variableType: "var",
    },
  ];

  invalidAssignmentCases.forEach(({ variableType, value }) => {
    it(`prevents assigning to ${variableType} for ${value}`, () => {
      tester.run("no-reassign-objects", noReassignObjects, {
        invalid: [
          {
            code: `${variableType} variable = ${value};`,
            errors: [{ messageId: "noMutableObjectDeclaration" }]
          },
        ],
        valid: [],
      });
    })
  });

  const invalidReassignmentCases = ["{}", "[]"];

  invalidReassignmentCases.forEach((value) => {
    it(`prevents reassigning for ${value}`, () => {
      tester.run("no-reassign-objects", noReassignObjects, {
        invalid: [
          {
            code: `variable = ${value};`,
            errors: [{ messageId: "noReassignObjects" }]
          },
        ],
        valid: [],
      });
    })
  });
})