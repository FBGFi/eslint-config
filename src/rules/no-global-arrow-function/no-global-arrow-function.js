function reportAndFixIfArrowFunctionExpression(context, node) {
  if (node.init?.type === "ArrowFunctionExpression") {
    context.report({
      node,
      messageId: "noGlobalArrowExpressions",
      *fix(fixer) {
        const variableDeclaration = node.parent;
        const textStart = variableDeclaration.range[0];
        const variableType = variableDeclaration.kind;
        yield fixer.replaceTextRange([textStart, textStart + variableType.length], "function");
        const functionStart = node.init.range[0];
        const variableEnd = node.id.range[1];
        yield fixer.replaceTextRange([variableEnd, functionStart], "");
        const functionEnd = node.init.range[1];
        const params = node.init.params;
        const blockStart = node.init.body.range[0];
        yield fixer.replaceTextRange([functionStart, blockStart], `(${params.map(({ name }) => name).join(", ")})`)
        yield fixer.replaceTextRange([functionEnd, functionEnd + 1], "");
      }
    });
  }
}
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
        if (node.parent?.parent?.type === "Program") {
          reportAndFixIfArrowFunctionExpression(context, node);
        }
      },
      ExportNamedDeclaration(node) {
        if (node.parent?.type === "Program") {
          node.declaration?.declarations?.forEach((declarator) => {
            reportAndFixIfArrowFunctionExpression(context, declarator);
          });
        }
      }
    };
  }
}