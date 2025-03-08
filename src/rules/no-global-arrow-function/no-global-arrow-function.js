import { isObjectExpression } from "../../utils.js";

export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Prevents usage of global arrow expressions",
    },
    fixable: "code",
    schema: [],
    messages: {
      noGlobalArrowExpressions: "Do not use arrow functions in global scope",
    }
  },
  create: function (context) {
    return {
      VariableDeclarator(node) {
        if (node.init.type === "ArrowFunctionExpression" && node.parent.parent?.type === "Program") {
          context.report({
            node,
            messageId: "noGlobalArrowExpressions"
          })
        }
      }
    };
  }
}