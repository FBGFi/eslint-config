import { RuleTester } from "eslint";
import { describe, it } from "node:test";
import noSpreadInReduce from "./no-spread-in-reduce.js";

const tester = new RuleTester();

describe("no-spread-in-reduce", function () {
  it("allows using spread of arrays outside of reduce", function () {
    tester.run("no-spread-in-reduce", noSpreadInReduce, {
      valid: [
        {
          code: "const a = [...arr];"
        },
        {
          code: "[...arr].reduce((total, val) => total + val, 0);"
        },
        {
          code: "arr.map((acc, i) => [...acc, i]);",
        },
      ],
      invalid: [],
    });
  });
  it("allows using spread of objects outside of reduce", function () {
    tester.run("no-spread-in-reduce", noSpreadInReduce, {
      valid: [
        {
          code: "const a = {...obj};"
        },
        {
          code: "arr.map((acc, i) => ({...acc, i}));",
        },
      ],
      invalid: [],
    });
  });
  it("prevents usage of array spread inside reduce", function () {
    tester.run("no-spread-in-reduce", noSpreadInReduce, {
      valid: [],
      invalid: [
        {
          code: "arr.reduce((acc, val) => [...acc, val], []);",
          errors: [{ messageId: "noSpreadInReduceReturn" }, { messageId: "noSpreadOfReduceAcc" }]
        },
        {
          code: "arr.reduce((acc, val) => {return [...acc, val];}, []);",
          errors: [{ messageId: "noSpreadInReduceReturn" }, { messageId: "noSpreadOfReduceAcc" }]
        },
        {
          code: "arr.reduce(function(acc, val){return [...acc, val];}, []);",
          errors: [{ messageId: "noSpreadInReduceReturn" }, { messageId: "noSpreadOfReduceAcc" }]
        },
        {
          code: `arr.reduce((total, val) => {
              const temp = [...total];
              temp.push(val);
              return temp;
            }, []);`,
          errors: [{ messageId: "noSpreadOfReduceAcc" }]
        },
      ],
    })
  });
  it("prevents usage of object spread inside reduce", function () {
    tester.run("no-spread-in-reduce", noSpreadInReduce, {
      valid: [],
      invalid: [
        {
          code: "arr.reduce((acc, val) => ({...acc, val}), {});",
          errors: [{ messageId: "noSpreadInReduceReturn" }, { messageId: "noSpreadOfReduceAcc" }]
        },
        {
          code: "arr.reduce((acc, val) => {return {...acc, val};}, {});",
          errors: [{ messageId: "noSpreadInReduceReturn" }, { messageId: "noSpreadOfReduceAcc" }]
        },
        {
          code: "arr.reduce(function(acc, val){return {...acc, val};}, {});",
          errors: [{ messageId: "noSpreadInReduceReturn" }, { messageId: "noSpreadOfReduceAcc" }]
        },
        {
          code: `arr.reduce((total, val) => {
              const temp = {...total};
              temp.push(val);
              return temp;
            }, {});`,
          errors: [{ messageId: "noSpreadOfReduceAcc" }]
        },
      ],
    })
  });
  it("allows cloning values outside of reduce scope with spread", function () {
    tester.run("no-spread-in-reduce", noSpreadInReduce, {
      valid: [
        {
          code: `arr.reduce((acc, current) => {
            const cloned = {...value};
            acc.push(cloned);
            return acc;
          }, []);`,
        },
      ],
      invalid: [],
    });
  })
})