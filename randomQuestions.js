let fetch = require('node-fetch');
let questionsURL = "https://opentdb.com/api.php?amount=35";
let questionStack = [];

fetch(questionsURL).then((res) => {
  return res.text();
}).then((body) => {
  parseApiCallQuestions(body);
});

/**
 * parseApiCallQuestions parse the data from api call and push all the questions
 * into an array and then call mobileSearch
 * @param {JSON} apiData 
 */
let parseApiCallQuestions = (apiData) => {
  JSON.parse(apiData, (key, value) => {
    if (key.toLowerCase() === "question") {
      questionStack.push(value);
      if (questionStack.length === 35) {
        mobileSearch(iPhoneUserAgent, process.argv[2], process.argv[3]);
      }
    }
  });
}