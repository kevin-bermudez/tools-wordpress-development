const fs = require('fs');
const path = require('path');
const jsYaml = require('js-yaml');

module.exports.getJsonFromYaml = (...args) => {
  const realPath = path.resolve.apply(null, args);
  const yamlString = fs.readFileSync(realPath, 'utf8');
  return jsYaml.load(yamlString);
};
