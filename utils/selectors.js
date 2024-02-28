const fs = require('fs');
const path = require('path');
const { questionWithCondition } = require('./question-with-condition');

module.exports.folderSelector = async (...args) => {
  const parentPathDef = path.resolve.apply(null, args);
  const availableFolders = fs
    .readdirSync(parentPathDef)
    .filter((folder) =>
      fs.lstatSync(path.resolve(parentPathDef, folder)).isDirectory()
    );

  const selectedFolder = await this.selector(
    `Carpetas disponibles en ${parentPathDef}`,
    'En cual carpeta guardará el flujo?',
    availableFolders
  );

  return path.resolve(parentPathDef, selectedFolder);
};

module.exports.selector = async (title, question, options) => {
  console.log();
  console.log(title);

  options.forEach((option, index) => {
    console.log(index + 1, option);
  });

  const selectedIndex = await questionWithCondition(
    question,
    (response) => !isNaN(response) && response && response <= options.length + 1
  );

  return options[selectedIndex - 1];
};
