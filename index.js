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
const parenthesize = (tokens, ls = undefined, idx = 0) => {
  if (tokens === undefined || idx >= tokens.length) {
    return ls;
  } else if (tokens[idx] === ")") {
    return parenthesize(tokens, ls, idx + 1);
  } else if (tokens[idx] === "(") {
    const list = parenthesize(tokens, [], idx + 1);
    if (!ls) {
      return list;
    }
    ls.push(list);
    return ls;
  } else {
    ls.push(convert(tokens[idx]));
    return parenthesize(tokens, ls, idx + 1);
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
}

const parsedTokens = parse(input);
console.log(parsedTokens);



