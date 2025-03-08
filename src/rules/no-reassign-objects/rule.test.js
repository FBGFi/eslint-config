import { RuleTester } from "eslint";
import { describe, it } from "node:test";
import noReassignObjects from "./no-reassign-objects.js";

const tester = new RuleTester();

describe("no-reassign-objects", function () {
  const validAssignmentCases = [
    {
      variableType: "const",
      value: "{}"
    },
    {
      variableType: "const",
      value: "[]"
    },
    {
      variableType: "let",
      value: "''"
    },
    {
      variableType: "var",
      value: "''"
    },
    {
      variableType: "let",
      value: "0"
    },
    {
      variableType: "var",
      value: "0"
    },
    {
      variableType: "let",
      value: "false"
    },
    {
      variableType: "var",
      value: "false"
    },
    {
      variableType: "let",
      value: "undefined"
    },
    {
      variableType: "var",
      value: "undefined"
    },
    {
      variableType: "let",
      value: "null"
    },
    {
      variableType: "var",
      value: "null"
    },
  ];

  validAssignmentCases.forEach(function ({ variableType, value }) {
    it(`allows assigning to ${variableType} for ${value}`, function () {
      tester.run("no-reassign-objects", noReassignObjects, {
        valid: [
          {
            code: `${variableType} variable = ${value};`,
          },
        ],
        invalid: [],
      });
    })
  });

  const validReAssignmentCases = ["''", "0", "false", "undefined", "null"];

  validReAssignmentCases.forEach(function (value) {
    it(`allows re-assigment for ${value}`, function () {
      tester.run("no-reassign-objects", noReassignObjects, {
        valid: [
          {
            code: `variable = ${value};`,
          },
        ],
        invalid: [],
      });
    })
  });

  const invalidAssignmentCases = [
    {
      variableType: "let",
      value: "{}"
    },
    {
      variableType: "var",
      value: "{}"
    },
    {
      variableType: "let",
      value: "[]"
    },
    {
      variableType: "var",
      value: "[]"
    },
  ];

  invalidAssignmentCases.forEach(function ({ variableType, value }) {
    it(`prevents assigning to ${variableType} for ${value}`, function () {
      tester.run("no-reassign-objects", noReassignObjects, {
        valid: [],
        invalid: [
          {
            code: `${variableType} variable = ${value};`,
            errors: [{ messageId: "noMutableObjectDeclaration" }]
          },
        ],
      });
    })
  });

  const invalidReassignmentCases = ["{}", "[]"];

  invalidReassignmentCases.forEach(function (value) {
    it(`prevents reassigning for ${value}`, function () {
      tester.run("no-reassign-objects", noReassignObjects, {
        valid: [],
        invalid: [
          {
            code: `variable = ${value};`,
            errors: [{ messageId: "noReassignObjects" }]
          },
        ],
      });
    })
  });
})