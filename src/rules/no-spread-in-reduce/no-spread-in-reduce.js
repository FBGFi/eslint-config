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
  if (!isObjectExpression(obj.type)) { return false; }
  return (obj.elements ?? obj.properties)?.some((element) => {
    return element.type === "SpreadElement";
  });
}

function reportIfOneLinerWithSpread(context, node) {
  if (node.type === "ArrowFunctionExpression"
    && isObjectExpression(node.body.type)
    && isCallExpression(node.parent)
    && isReduceExpression(node.parent.callee)
  ) {
    context.report({
      messageId: "noSpreadInReduceReturn",
      node,
    });
  }
}

function isReturnStatementWithSpread(node) {
  return node.type === "ReturnStatement"
    && node.argument?.type
    && isObjectExpression(node.argument.type)
    && node.parent.type === "BlockStatement"
    && objectHasSpreadElement(node.argument);
}

function reportIfIsReturnStatementWithSpreadInReduce(context, node) {
  if (isReturnStatementWithSpread(node)) {
    let parent = node.parent;
    while (parent) {
      if (isCallExpression(parent) && isReduceExpression(parent.callee)) {
        context.report({
          messageId: "noSpreadInReduceReturn",
          node,
        });
        break;
      }
      parent = parent.parent;
    }
  }
}

function reportIfSpreadingReduceInputVariable(context, node) {
  if (node.type !== "SpreadElement") {
    return;
  }
  const argumentName = node.argument.name;
  let parent = node.parent;
  while (parent) {
    if (parent.type === "ExpressionStatement" && isCallExpression(parent.expression) && isReduceExpression(parent.expression.callee)) {
      const params = parent.expression.arguments[0]?.params;
      if (params?.[0]?.name === argumentName) {
        context.report({
          messageId: "noSpreadOfReduceAcc",
          node,
        });
        break;
      }
    }
    parent = parent.parent;
  }
}

export default {
  create: function (context) {
    return {
      ArrowFunctionExpression(node) {
        reportIfOneLinerWithSpread(context, node);
      },
      ReturnStatement(node) {
        reportIfIsReturnStatementWithSpreadInReduce(context, node);
      },
      SpreadElement(node) {
        reportIfSpreadingReduceInputVariable(context, node);
      }
    };
  },
  meta: {
    docs: {
      description: "Prevents spreading return values or accumulating values in Array.reduce",
    },
    fixable: "code",
    messages: {
      noSpreadInReduceReturn: "Do not spread return values in Array.reduce, it will result in O^n memory usage",
      noSpreadOfReduceAcc: "Do not spread accumulating values of Array.reduce, it will result in O^n memory usage",
    },
    schema: [],
    type: "suggestion"
  },
}