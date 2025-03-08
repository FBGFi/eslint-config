import { isObjectExpression } from "../../utils.js";

export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Prevents usage of var and let keywords for object values and prevents reassigning objects into mutable values",
    },
    fixable: "code",
    schema: [],
    messages: {
      noReassignObjects: "Do not reassign objects values, it might hinder performance",
      noMutableObjectDeclaration: "Do not use let or var when assigning object values, use const instead"
    }
  },
  create: function (context) {
    return {
      VariableDeclaration(node) {
        if (node.kind !== "const" && node.declarations.some(function (dec) {
          return isObjectExpression(dec.init.type);
        })) {
          context.report({
            node,
            messageId: "noMutableObjectDeclaration"
          });
        }
      },
      ExpressionStatement(node) {
        const expression = node.expression;
        if (expression.operator === "=") {
          const type = expression.right.type;
          if (isObjectExpression(type)) {
            context.report({
              node,
              messageId: "noReassignObjects"
            });
          }
        }
      }
    };
  }
}