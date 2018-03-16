const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhoneUserAgent = devices['iPhone 6'];
const fetch = require('node-fetch');
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
      if (questionStack.length >= 35) {
        mobileSearch(process.argv[2], process.argv[3], iPhoneUserAgent);
      }
    }
  });
}

/**
 * 
 * @param {string} userAgent 
 * @param {string} userName 
 * @param {string} passWord 
 */
let mobileSearch = (userName, passWord, userAgent) => {
  puppeteer.launch({ headless: false }).then(async browser => {
    let currentQuerey;
    // Lets make the browser global so we don't have to pass it down later
    // This way we can close it when we want
    globalBrowser = browser;

    console.log("Go to login page", +new Date())
    const page = await browser.newPage();
    await page.emulate(userAgent);
    await page.goto("https://login.live.com/");

    console.log("Input user name", +new Date())
    const inputUserName = await page.$('#i0116');
    await inputUserName.type(userName, { delay: 100 });

    console.log("Go to password page", +new Date())
    const moveToPasswordPage = await page.$("#idSIButton9");
    await moveToPasswordPage.click()

    console.log("Input password", +new Date())
    await page.waitForSelector('#i0118');
    const inputPassWord = await page.$('#i0118');
    await inputPassWord.type(passWord, { delay: 100 });

    console.log("Submit password", +new Date())
    const submitPassword = await page.$("#idSIButton9");
    await submitPassword.click()
    // await page.goto(url, { waitUntil: 'networkidle' });

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
  let handlePageUpdates = (currentQuerey, currentPage, currentIndex) => {
    // console.log("Check time", + new Date(), "what is page?", currentWord);
    setTimeout(async () => {
      await currentPage.goto(`https://bing.com/search?q=${currentQuerey}`, {
        waitLoad: true,
        waitNetworkIdle: true,
        timeout: 10000 // defaults to false
      });
      if (currentIndex === questionStack.length - 1) {
        globalBrowser.close();
      }
    }, currentIndex * 3000);
  };
}
