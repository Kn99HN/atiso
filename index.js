const fs = require("fs");
const FILE_PATH = "./input.txt";

const input = fs.readFileSync(FILE_PATH, "utf-8");

const tokenize = (input) => {
  return input
    .replace(/(?<=[(])/g, " ")
    .replace(/(?=[)])/g, " ")
    .split(" ");
};

const convert = (input) => {
  if (typeof input === "number") {
    return {
      type: "Literal",
      value: input,
    };
  } else if (typeof input === "string") {
    return {
      type: "Literal",
      value: input,
    };
  } else {
    return {
      type: "Identifier",
      value: intput,
    };
  }
};

//['(', '(', 'lambda', '(', 'x', ')', 'x', ')', '"Lisp"', ')']
// [[{ type: 'identifier', value: 'lambda' }, [{ type: 'identifier', value: 'x' }],
//   { type: 'identifier', value: 'x' }],
//   { type: 'literal', value: 'Lisp' }]
const parenthesize = (tokens, ls = undefined) => {
  // console.log(tokens[idx], ls);
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
  } else if (Array.isArray(parenthesizedTokens[idx])) {
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

const evaluate = (fn) => {
  if (fn === "+") {
    return (a, b) => a + b;
  } else if (fn === "first") {
    return (ls) => ls[0];
  }
};

const parsedTokens = parse(input);
console.log(parsedTokens);
