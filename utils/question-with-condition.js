const { doQuestion } = require('./do-question');

module.exports.questionWithCondition = async (question, condition) => {
  let response;
  const control = true;
  while (control) {
    response = await doQuestion(question, true);

    if (condition(response)) {
      break;
    }
  }

  return response;
};
