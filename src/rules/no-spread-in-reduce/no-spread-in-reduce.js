import { isObjectExpression } from "../../utils.js";

function isReduceExpression(memberExpression) {
  return memberExpression.type === "MemberExpression" &&
    memberExpression.parent.type === "CallExpression" &&
    memberExpression.property.name === "reduce";
}

function isCallExpression(node) {
  return node.type === "CallExpression";
}

function objectHasSpreadElement(obj) {
  if (!isObjectExpression(obj.type)) return false;
  return (obj.elements ?? obj.properties)?.some(function (element) {
    return element.type === "SpreadElement";
  });
}

export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Prevents spreading return values or accumulating values in Array.reduce",
    },
    fixable: "code",
    schema: [],
    messages: {
      noSpreadInReduceReturn: "Do not spread return values in Array.reduce, it will result in O^n memory usage",
      noSpreadOfReduceAcc: "Do not spread accumulating values of Array.reduce, it will result in O^n memory usage",
    }
  },
  create: function (context) {
    return {
      SpreadElement(node) {
        const argumentName = node.argument.name;
        let parent = node.parent;
        while (parent) {
          if (parent.type === "ExpressionStatement" && isCallExpression(parent.expression) && isReduceExpression(parent.expression.callee)) {
            const params = parent.expression.arguments[0]?.params;
            if (params?.[0]?.name === argumentName) {
              context.report({
                node,
                messageId: "noSpreadOfReduceAcc"
              });
              break;
            }
          }
          parent = parent.parent;
        }
      },
      ArrowFunctionExpression(node) {
        // one-liner
        if (isObjectExpression(node.body.type) && isCallExpression(node.parent) && isReduceExpression(node.parent.callee)) {
          context.report({
            node,
            messageId: "noSpreadInReduceReturn"
          });
        }
      },
      ReturnStatement(node) {
        if (node.argument?.type && isObjectExpression(node.argument.type)
          && node.parent.type === "BlockStatement" &&
          objectHasSpreadElement(node.argument)) {
          let parent = node.parent;
          while (parent) {
            if (isCallExpression(parent) && isReduceExpression(parent.callee)) {
              context.report({
                node,
                messageId: "noSpreadInReduceReturn"
              });
              break;
            }
            parent = parent.parent;
          }
        }
      }
    };
  }
}