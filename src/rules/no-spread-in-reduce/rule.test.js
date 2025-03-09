import { describe, it } from "node:test";
import { RuleTester } from "eslint";
import noSpreadInReduce from "./no-spread-in-reduce.js";

const tester = new RuleTester();

describe("no-spread-in-reduce", () => {
  it("allows using spread of arrays outside of reduce", () => {
    tester.run("no-spread-in-reduce", noSpreadInReduce, {
      invalid: [],
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
    });
  });
  it("allows using spread of objects outside of reduce", () => {
    tester.run("no-spread-in-reduce", noSpreadInReduce, {
      invalid: [],
      valid: [
        {
          code: "const a = {...obj};"
        },
        {
          code: "arr.map((acc, i) => ({...acc, i}));",
        },
      ],
    });
  });
  it("prevents usage of array spread inside reduce", () => {
    tester.run("no-spread-in-reduce", noSpreadInReduce, {
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
      valid: [],
    })
  });
  it("prevents usage of object spread inside reduce", () => {
    tester.run("no-spread-in-reduce", noSpreadInReduce, {
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
      valid: [],
    })
  });
  it("allows cloning values outside of reduce scope with spread", () => {
    tester.run("no-spread-in-reduce", noSpreadInReduce, {
      invalid: [],
      valid: [
        {
          code: `arr.reduce((acc, current) => {
            const cloned = {...value};
            acc.push(cloned);
            return acc;
          }, []);`,
        },
      ],
    });
  })
})