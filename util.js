const fs = require("fs");
const TEST_DIR = "./tests";

function readFile(fileName) {
    return fs.readFileSync(`${TEST_DIR}/${fileName}`, 'utf-8');
}

module.exports = {
    readFile
}