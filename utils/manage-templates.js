const fs = require('fs');
const path = require('path');
const appDir = path.resolve(__dirname, '..');
const templatesPath = path.resolve(appDir, 'templates');

module.exports.getParsedTemplate = (template, variables = {}) => {
  let content = fs.readFileSync(path.resolve(templatesPath, template), 'utf-8');

  Object.keys(variables).forEach((variableKey) => {
    content = content.replaceAll(`{{${variableKey}}}`, variables[variableKey]);
  });

  return content;
};

module.exports.createNewFile = (template, newFile, variables = {}) => {
  const content = this.getParsedTemplate(template, variables);
  fs.writeFileSync(path.resolve(newFile), content);
  return true;
};

module.exports.copyFile = (template, newFile) => {
  fs.cpSync(path.resolve(templatesPath, template), newFile);
}

module.exports.copyFolder = (origin, destination) => {
  fs.cpSync(origin, destination, {recursive: true});
}