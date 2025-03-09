function isFunctionExpression(node) {
  return node.type === "ArrowFunctionExpression" || node.type === "FunctionDeclaration";
}

function isMutatingArrayProperty(property) {
  return property.name === "copyWithin"
    || property.name === "fill"
    || property.name === "pop"
    || property.name === "push"
    || property.name === "reverse"
    || property.name === "shift"
    || property.name === "sort"
    || property.name === "splice"
    || property.name === "unshift";
}

function isMutatingArrayExpression(node) {
  if (!node.object || !node.property) {
    return false;
  }
  return (node.object.type === "MemberExpression" || node.object.type === "Identifier") && (
    isMutatingArrayProperty(node.property)
  );
}

function reportedIfMutatingInputVariables({ context, node, params, variableName }) {
  if (params.some((param) => param.name === variableName)) {
    context.report({
      messageId: "noMutatingInputVariables",
      node,
    });
    return true;
  }
  return false;
}

function reportedIfMutatingOutsideScope({ context, node, parent, variableName }) {
  for (const element of parent.body) {
    if (
      element.type === "VariableDeclaration"
      && element.declarations.some((declaration) => declaration.id.name === variableName)
    ) {
      context.report({
        messageId: "noMutatingOutsideScope",
        node,
      });
      return true;
    }
  }
  return false;
}

function checkDeclarationsAndReportErrors(context, node, variableName) {
  let parent = node.parent;
  let outOfScope = false;
  while (parent) {
    if (isFunctionExpression(parent)) {
      const reported = reportedIfMutatingInputVariables({ context, node, params: parent.params, variableName });
      if (reported) {
        break;
      }
      outOfScope = true;
    }
    if (outOfScope && Array.isArray(parent.body)) {
      const reported = reportedIfMutatingOutsideScope({ context, node, parent, variableName });
      if (reported) {
        break;
      }
    }
    parent = parent.parent;
  }
}

export default {
  create: function (context) {
    return {
      AssignmentExpression(node) {
        if (node.left.type === "MemberExpression") {
          const variableName = node.left.object.name;
          checkDeclarationsAndReportErrors(context, node, variableName);
        } else if (node.left.type === "Identifier") {
          const variableName = node.left.name;
          checkDeclarationsAndReportErrors(context, node, variableName);
        }
      },
      CallExpression(node) {
        if (isMutatingArrayExpression(node.callee)) {
          let variableName = undefined;
          let obj = node.callee.object;
          while (obj) {
            if (!obj.object) {
              variableName = obj.name;
              break;
            }
            obj = obj.object;
          }

          if (!variableName) {
            return;
          }
          checkDeclarationsAndReportErrors(context, node, variableName);
        }
      },
    };
  },
  meta: {
    docs: {
      description: "Prevents mutating values outside of function scope.",
    },
    fixable: "code",
    messages: {
      noMutatingInputVariables: "Mutating input variables might cause unwanted behavior, use with caution.",
      noMutatingOutsideScope: "Mutating variables that are declared outside of current scope might cause unwanted behavior, use with caution.",
    },
    schema: [],
    type: "suggestion",
  },
}