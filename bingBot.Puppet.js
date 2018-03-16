const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const fetch = require('node-fetch');
let questionsURL = "https://opentdb.com/api.php?amount=35";
let questionStack = [];
let globalBrowser;
let validUser = {};

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
        desktopSearch(process.argv[2], process.argv[3]);
      }
    }
  });
}

/**
 * Desktop Search
 * @param {*} userName 
 * @param {*} passWord 
 */
let desktopSearch = (userName, passWord) => {
  puppeteer.launch({ headless: false }).then(async browser => {
    let currentQuerey;

    // Lets make the browser global so we don't have to pass it down later
    // This way we can close it when we want
    globalBrowser = browser;

    const page = await browser.newPage();
    await page.goto("https://login.live.com/");
    const inputUserName = await page.$('#i0116');
    await inputUserName.type(userName, { delay: 100 });
    const moveToPasswordPage = await page.$("#idSIButton9");
    await moveToPasswordPage.click()
    await page.waitForSelector('#i0118');
    const inputPassWord = await page.$('#i0118');
    await inputPassWord.type(passWord, { delay: 100 });
    const submitPassword = await page.$("#idSIButton9");
    await submitPassword.click()

    page.waitForSelector('#rewards-module-container').then(async (results) => {
      for (let k = 0; k < questionStack.length; k++) {
        handlePageUpdates(questionStack[k], page, k);
      }
    }).catch((err) => {
      console.log("Err in wait for selector", err);
    });
  });

  /**
   * handlePageUpdates: This function should call a new page querey
   *    the timeIncrement is constantly increase to space out the duration of the setTimeouts.
   * @param {*} currentQuerey 
   * @param {*} currentPage 
   * @param {*} timeIncrement
   */
  const handlePageUpdates = async (currentQuerey, currentPage, currentIndex) => {

    setTimeout(() => {
      currentPage.goto(`https://bing.com/search?q=${currentQuerey}`, {
        waitLoad: true,
        waitNetworkIdle: true,
        timeout: 10000 // defaults to false
      });
      if (currentIndex === questionStack.length - 1) {
        globalBrowser.close();
      }
    }, currentIndex * 6000);
  };
}