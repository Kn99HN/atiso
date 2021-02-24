const fs = require("fs");
const { get } = require("http");
const FILE_PATH = "./input.txt";

const input = fs.readFileSync(FILE_PATH, "utf-8");

const Context = function (scope, parent) {
  this.scope = scope;
  this.parent = parent;

  this.get = (identifier) => {
    if (identifier in this.scope) {
      return this.scope[identifier];
    } else if (this.parent !== undefined) {
      return this.parent.get(undefined);
    }
  }
};

const tokenize = (input) => {
  return input
    .replace(/(?<=[(])/g, " ")
    .replace(/(?=[)])/g, " ")
    .split(" ");
};

const convert = (input) => {
  if (!isNaN(parseFloat(input))) {
    return {
      type: "Literal",
      value: parseFloat(input),
    };
  } else if (input.indexOf('"') !== input.indexOf('"')) {
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
  '+': (a, b) => a + b,
  'first': (ls) => ls[0],
  'rest': (ls) => ls.shift(),
  'print': (ls) => console.log(ls)
};

const interpret = (input, context) => {
  if (context === undefined) {
    return interpret(input, new Context(library));
  } else if(input instanceof Array) {
    return interpretList(input, context);
  } else if(input.type === 'Identifier') {
    return context.get(input.value);
  } else {
    return input.value;
  }
};

const interpretList = (inputs, context) => {
  if(inputs[0] === 'lambda') {
    return interpretList(inputs, new Context(library));
  } else {
    const interpretedInputs = inputs.map((x) => interpret(x, context));
    if(interpretedInputs[0] instanceof Function) {
      const func = interpretedInputs[0];
      return func(interpretedInputs.slice(1));
    } else {
      return interpretedInputs;
    }
  }
}
