# @fbgfi/eslint-config
This package is for defining rules for JS/TS projects with performance in mind.

## no-global-arrow-function
Since arrow functions are evaluated on run time, it is not adviced to use them in global scope. Since named functions have `this` binded to the function prototype, it is more performant to use them instead.

## no-reassign-objects
Objects should not be re-assigned to objects due to possible performance hits and unexpected side-effects.

## no-spread-in-reduce
Spreading objects or arrays, especially in return statements of Array.reduce can cause significant performance issues.

## no-mutating-input-objects
Directly mutating objects that are inputs of a function, or that are not in the same scope can cause unwanted side-effects.

## no-deprecated-functions
Allows marking certain function declarations and function calls as deprecated on global level. Useful when cleaning up code bases. Not enforced by default. Requires array of function names to be passed as second argument of options.