function isFunctionExpression(node) {
  return node.type === "ArrowFunctionExpression" || node.type === "FunctionDeclaration";
}

function isMutatingArrayExpression(node) {
  if (!node.object || !node.property) return false;
  return (node.object.type === "MemberExpression" || node.object.type === "Identifier") && (
    node.property.name === "copyWithin"
    || node.property.name === "fill"
    || node.property.name === "pop"
    || node.property.name === "push"
    || node.property.name === "reverse"
    || node.property.name === "shift"
    || node.property.name === "sort"
    || node.property.name === "splice"
    || node.property.name === "unshift"
  );
}

function checkDeclarationsAndReportErrors(context, node, variableName) {
  let parent = node.parent;
  let outOfScope = false;
  while (parent) {
    if (isFunctionExpression(parent)
      && parent.params.some((param) => param.name === variableName)
    ) {
      context.report({
        node,
        messageId: "noMutatingInputVariables"
      });
      break;
    } else if (isFunctionExpression(parent)) {
      outOfScope = true;
    }
    if (outOfScope && Array.isArray(parent.body)) {
      for (const element of parent.body) {
        if (
          element.type === "VariableDeclaration"
          && element.declarations.some((declaration) => declaration.id.name === variableName)
        ) {
          context.report({
            node,
            messageId: "noMutatingOutsideScope"
          });
          break;
        }
      }
    }
    parent = parent.parent;
  }
}

export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Prevents mutating values outside of function scope.",
    },
    fixable: "code",
    schema: [],
    messages: {
      noMutatingInputVariables: "Mutating input variables might cause unwanted behavior, use with caution.",
      noMutatingOutsideScope: "Mutating variables that are declared outside of current scope might cause unwanted behavior, use with caution.",
    }
  },
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

          if (!variableName) return;
          checkDeclarationsAndReportErrors(context, node, variableName);
        }
      },
    };
  }
}