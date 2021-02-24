const fs = require("fs");
const FILE_DIR = "./tests";

class Context {
  constructor(scope, parent) {
    this.scope = scope;
    this.parent = parent;

    this.get = function (identifier) {
      if (identifier in this.scope) {
        return this.scope[identifier];
      } else if (this.parent !== undefined) {
        return this.parent.get(identifier);
      }
    };
  }
}

const tokenize = (input) => {
  const tokens = [];
  const spacedInput = input.replace(/\(/g, "( ").replace(/\)/g, " )");
  let currentWord = '';
  let isString = false;
  for (char of spacedInput) {
    if (char === '"') {
      if (currentWord.indexOf(char) === 0) {
        currentWord += '"';
        isString = false;
        if(currentWord !== '') {
          tokens.push(currentWord)
        };
        currentWord = '';
      } else {
        currentWord = '"';
        isString = true;
      }
    } else if (!isString && char === " ") {
      if(currentWord !== '') {
        tokens.push(currentWord)
      };
      currentWord = '';
    } else if (char === "(" || char === ")") {
      tokens.push(char);
    } else {
      currentWord += char;
    }
  }
  return tokens;
};

const convert = (input) => {
  if (!isNaN(parseFloat(input))) {
    return {
      type: "Literal",
      value: parseFloat(input),
    };
  } else if (input.indexOf('"') !== input.lastIndexOf('"')) {
    return {
      type: "Literal",
      value: input,
    };
  } else {
    return {
      type: "Identifier",
      value: input,
    };
  }
};

//['(', '(', 'lambda', '(', 'x', ')', 'x', ')', '"Lisp"', ')']
// [[{ type: 'identifier', value: 'lambda' }, [{ type: 'identifier', value: 'x' }],
//   { type: 'identifier', value: 'x' }],
//   { type: 'literal', value: 'Lisp' }]
const parenthesize = (tokens, ls = undefined) => {
  if (ls === undefined) {
    return parenthesize(tokens, []);
  } else {
    const token = tokens.shift();
    if (token === undefined) {
      return ls.pop();
    } else if (token === ")") {
      return ls;
    } else if (token === "(") {
      const list = parenthesize(tokens, []);
      ls.push(list);
      return parenthesize(tokens, ls);
    } else {
      ls.push(convert(token));
      return parenthesize(tokens, ls);
    }
  }
};

const prettyPrint = (parenthesizedTokens, idx = 0, currentString = "") => {
  if (parenthesizedTokens[idx] === undefined) {
    return currentString + "]";
  } else if (parenthesizedTokens[idx] instanceof Array) {
    currentString += idx === 0 ? "[ [" : "],\n[";
    currentString = prettyPrint(parenthesizedTokens[idx], 0, currentString);
    currentString = prettyPrint(parenthesizedTokens, idx + 1, currentString);
    return currentString;
  } else {
    let obj = Object.entries(parenthesizedTokens[idx]).reduce(
      (s, pair) => `${s} ${pair.join(": ")},`,
      ""
    );
    const i = obj.lastIndexOf(",");
    obj = obj.substring(0, i) + obj.substr(i + 1);
    currentString +=
      `{${obj}}` + (idx === parenthesizedTokens.length - 1 ? "" : ",");
    currentString = prettyPrint(parenthesizedTokens, idx + 1, currentString);
    return currentString;
  }
};

const parse = (input) => {
  return parenthesize(tokenize(input));
};

const library = {
  "+": (...args) => args.reduce((acc, curr) => acc + curr, 0),
  "-": (...args) => args.reduce((acc, curr) => acc - curr),
  "*": (...args) => args.reduce((acc, curr) => acc * curr, 1),
  "/": (...args) => args.reduce((acc, curr) => acc / curr),
  first: (...args) => args[0],
  rest: (...args) => args.shift(),
  print: (ls) => console.log(ls),
};

const interpret = (input, context) => {
  if (context === undefined) {
    return interpret(input, new Context(library));
  } else if (input instanceof Array) {
    return interpretList(input, context);
  } else if (input.type === "Identifier") {
    return context.get(input.value);
  } else {
    return input.value;
  }
};

const special = {
  lambda: (inputs, context) => {
    return function () {
      const lambdaArgs = arguments;
      const lambdaScope = inputs[1].reduce(function (acc, x, i) {
        acc[x.value] = lambdaArgs[i];
        return acc;
      }, {});
      return interpret(inputs[2], new Context(lambdaScope, context));
    };
  },
};

const interpretList = (inputs, context) => {
  if (inputs.length > 0 && inputs[0].value in special) {
    return special[inputs[0].value](inputs, context);
  } else {
    const interpretedInputs = inputs.map(function (x) {
      return interpret(x, context);
    });
    if (interpretedInputs[0] instanceof Function) {
      const func = interpretedInputs[0];
      return func(...interpretedInputs.slice(1));
    } else {
      return interpretedInputs;
    }
  }
};

const FILE_PATH = `${FILE_DIR}/subtract.txt`;
const input = fs.readFileSync(FILE_PATH, "utf-8");
console.log(interpretList(parse(input)));