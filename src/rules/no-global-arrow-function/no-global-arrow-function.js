const RANGE_START_INDEX = 0;
const RANGE_END_INDEX = 1;

function reportAndFixIfArrowFunctionExpression(context, node) {
  if (node.init?.type === "ArrowFunctionExpression") {
    context.report({
      *fix(fixer) {
        const variableDeclaration = node.parent;
        const textStart = variableDeclaration.range[RANGE_START_INDEX];
        const variableType = variableDeclaration.kind;
        yield fixer.replaceTextRange([textStart, textStart + variableType.length], "function");
        const functionStart = node.init.range[RANGE_START_INDEX];
        const variableEnd = node.id.range[RANGE_END_INDEX];
        yield fixer.replaceTextRange([variableEnd, functionStart], "");
        const functionEnd = node.init.range[RANGE_END_INDEX];
        const params = node.init.params;
        const blockStart = node.init.body.range[RANGE_START_INDEX];
        yield fixer.replaceTextRange([functionStart, blockStart], `(${params.map(({ name }) => name).join(", ")})`)
        yield fixer.replaceTextRange([functionEnd, functionEnd + 1], "");
      },
      messageId: "noGlobalArrowExpressions",
      node,
    });
  }
}
export default {

  create: function (context) {
    return {
      ExportNamedDeclaration(node) {
        if (node.parent?.type === "Program") {
          node.declaration?.declarations?.forEach((declarator) => {
            reportAndFixIfArrowFunctionExpression(context, declarator);
          });
        }
      },
      VariableDeclarator(node) {
        if (node.parent?.parent?.type === "Program") {
          reportAndFixIfArrowFunctionExpression(context, node);
        }
      },
    };
  },
  meta: {
    docs: {
      description: "Prevents usage of global arrow expressions",
    },
    fixable: "code",
    messages: {
      noGlobalArrowExpressions: "Do not use arrow functions in global scope",
    },
    schema: [],
    type: "suggestion",
  },
}