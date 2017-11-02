require('chromedriver');
let webdriver = require('selenium-webdriver'),
  fetch = require('node-fetch'),
  config = require('./config'),
  By = webdriver.By,
  until = webdriver.until;

let outlookLogin = config, options = ["wu-tang", "clan", "ain", "nothing", "to", "fuck", "with", "trump", "the", "result", "products that count", "products that count meet up group", "Think slowly"], signInBtn, pwdDescEl, pwdEl;
let url = "http://www.bing.com/search?q=";

// After being logged in randomly search for words picked out of the array.
let writeWords = (driver, optionsCopy) => {
  if (optionsCopy.length > 0) {
    setTimeout(() => {
      let optionsCopyVal = optionsCopy.pop()
      driver.navigate().to(url + optionsCopyVal);
      writeWords(driver, optionsCopy);
    }, 3000);
  } else {
    startUpChrome("https://www.bing.com/");
  }
}

function checkAllArr(driver) {
  let credentials = outlookLogin.pop();
  // Wait until page loads then click menu to sign in
  driver.wait(until.elementLocated(By.id("id_s")), 3000).then((el) => {
    el.click();
  }, (err) => {
    console.warn("Err occured in id_s callback", err)
  })

  // Wait for sign in menu to appear then click on the connect account button
  driver.wait(until.elementLocated(By.className("b_toggle")), 4000).then((el) => {
    el.click()
  }, (err) => {
    console.warn("Err occured in b_toggle callback", err)
  }).then(driver.wait(until.elementLocated(By.id("i0116")), 6000))
    .then(() => driver.findElement(By.id("i0116")))
    .then((el) => {
      el.sendKeys(credentials[0])
    }, (err) => {
      console.warn("Err: couldn't send keys");
    })
    .then(() => driver.sleep(5000))
    .then(() => driver.findElement(By.id("idSIButton9")).click())
    .then(driver.wait(until.elementLocated(By.id("i0118")), 6000))
    .then(() => driver.sleep(5000))
    .then(() => driver.findElement(By.id("i0118")))
    .then((el) => {
      console.log("El", el, "creds", credentials[1]);
      el.sendKeys(credentials[1])
    })
    // .then(driver.wait(until.elementLocated(By.id("idSIButton9")), 6000))
    .then(() => driver.findElement(By.id("idSIButton9")))
    .then((el) => {
      console.log(+new Date(), "About to click");
      el.click()
    }, (err) => {
      console.log("Can't find el throw err", err)
    })
    .then(() => driver.sleep(1000))
    .then(() => {
      writeWords(driver, options.slice());
    })
    .catch((err) => {
      console.warn(err);
    })
};

function startUpChrome(url = "https://www.bing.com/") {
  let driver = new webdriver.Builder().forBrowser('chrome').build();
  driver.get(url);
  let siID = setTimeout(() => {
    if (outlookLogin.length > 0) {
      checkAllArr(driver);
      startUpChrome(url);
    } else {
      clearInterval(siID);
    }
  }, 10000);
}
startUpChrome(process.argv[2]);
