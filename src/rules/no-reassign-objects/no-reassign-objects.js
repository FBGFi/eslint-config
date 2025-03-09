import { isObjectExpression } from "../../utils.js";

export default {
  create: function (context) {
    return {
      ExpressionStatement(node) {
        const expression = node.expression;
        if (expression.operator === "=") {
          const type = expression.right.type;
          if (isObjectExpression(type)) {
            context.report({
              messageId: "noReassignObjects",
              node,
            });
          }
        }
      },
      VariableDeclaration(node) {
        if (node.kind !== "const" && node.declarations.some((dec) => {
          return isObjectExpression(dec.init.type);
        })) {
          context.report({
            messageId: "noMutableObjectDeclaration",
            node,
          });
        }
      },
    };
  },
  meta: {
    docs: {
      description: "Prevents usage of var and let keywords for object values and prevents reassigning objects into mutable values",
    },
    fixable: "code",
    messages: {
      noMutableObjectDeclaration: "Do not use let or var when assigning object values, use const instead",
      noReassignObjects: "Do not reassign objects values, it might hinder performance",
    },
    schema: [],
    type: "suggestion",
  },
}