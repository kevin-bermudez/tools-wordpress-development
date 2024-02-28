const { manageConsole } = require('./manage-console');

module.exports.doQuestion = (question, newLineBefore = false,defaultValue) =>
  new Promise((res, rej) => {
    try {
      if (newLineBefore) {
        console.log();
      }

      if (process.env.DEFAULT_VALUES === 'true' && typeof defaultValue !== 'undefined') {
        return res(defaultValue);
      }

      manageConsole.question(`${question} `, (answer) => {
        return res(answer);
      });
    } catch (error) {
      return rej(error);
    }
  });
