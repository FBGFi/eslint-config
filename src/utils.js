export function isObjectExpression(expressionType) {
  return expressionType === "ObjectExpression" || expressionType === "ArrayExpression"
}

export function isOnGlobalLevel(node) {
  return node.parent?.type === "Program";
}