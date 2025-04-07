import { isOnGlobalLevel } from "../../utils.js";

function report(context, node) {
  context.report({
    messageId: "noDeprecatedFunctions",
    node,
  });
}

function reportFunctionDeclarations(context, deprecatedFunctionNames) {
  return (node) => {
    if (!isOnGlobalLevel(node)) {
      return;
    }
    if (deprecatedFunctionNames.includes(node.id.name)) {
      report(context, node);
    }
  }
}

function reportExpressions(context, deprecatedFunctionNames) {
  return (node) => {
    if (!isOnGlobalLevel(node) || node.expression.type !== "CallExpression") {
      return;
    }
    if (deprecatedFunctionNames.includes(node.expression.callee.name)) {
      report(context, node);
    }
  }
}

function reportVariableDeclarators(context, deprecatedFunctionNames) {
  return (node) => {
    if (!isOnGlobalLevel(node.parent)) {
      return;
    }
    const type = node.init.type
    // Assigning function to variable
    if ((type === "ArrowFunctionExpression" || type === "FunctionExpression") && deprecatedFunctionNames.includes(node.id.name)) {
      report(context, node);
    }
    // Calling deprecated function and assigning it to a variable
    else if (type === "CallExpression" && deprecatedFunctionNames.includes(node.init.callee.name)) {
      report(context, node);
    }
  }
}

export default {
  create: function (context) {
    if (context.options?.length !== 1 && !context.options[0].length) {
      throw new Error("Missing options for deprecated functions");
    }

    const deprecatedFunctionNames = context.options[0];

    return {
      FunctionDeclaration: reportFunctionDeclarations(context, deprecatedFunctionNames),
      ExpressionStatement: reportExpressions(context, deprecatedFunctionNames),
      VariableDeclarator: reportVariableDeclarators(context, deprecatedFunctionNames)
    }
  },
  meta: {
    docs: {
      description: "Prevents usage of manually declared functions in global scope.",
    },
    fixable: "code",
    messages: {
      noDeprecatedFunctions: "Function has been marked as deprecated for global scope.",
    },
    schema: [
      {
        type: "array",
        items: {
          type: "string"
        }
      }
    ],
    type: "suggestion",
  },
}