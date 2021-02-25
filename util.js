const fs = require("fs");
const TEST_DIR = "./tests";

function isBalance(text) {
    const trimmedText = text.trim();
    const stack = [];
    for(char of text) {
        if(stack.length === 0) {
            if(char === '(') {
                stack.push(char);
            }
        } else if(char === ')') {
            if(stack[stack.length - 1] === "(") {
                stack.pop();
            } else {
                return false;
            }
        } 
    }
    return stack.length === 0;
}

function parse(inputs) {
    const modifiedInputs = inputs.split("\n");
    const balancedInputs = modifiedInputs.map((text) => isBalance(text));
    const output = [];
    let expression = "";
    for(let i = 0; i < balancedInputs.length; i++) {
        if(balancedInputs[i]) {
            if(expression !== "") {
                output.push(expression);
            }
            output.push(modifiedInputs[i]);
        } else {
            expression += balancedInputs + " ";
        }
    }
    return output;
}

function readFile(fileName) {
    return fs.readFileSync(`${TEST_DIR}/${fileName}`, 'utf-8');
}

module.exports = {
    readFile
}