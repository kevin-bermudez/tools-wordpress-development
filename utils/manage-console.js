const { stdin: input, stdout: output } = require('node:process');
const readline = require('readline');
module.exports.manageConsole = readline.createInterface({ input, output });
