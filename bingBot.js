require('chromedriver');
let webdriver = require('selenium-webdriver'),
fetch = require('node-fetch'),
By = webdriver.By,
until  = webdriver.until;

let outlookLogin = [["testing@outlook.com", "testme"]], signInBtn, pwdDescEl, pwdEl;;

// After being logged in randomly search for words picked out of the array.
let writeWords = (driver) => {
  let url = "http://www.bing.com/search?q=", intId, options = ["testing", "this", "out", "please", "tell", "me", "what", "is", "the", "result"]
  intId = setInterval(()=>{
      if(options.length === 0){
        clearInterval(intId);
      } else {
        driver.navigate().to(url + options.pop());
      }
  }, (Math.random() + 1 ) * 1000);
}

function checkAllArr(driver){
  // Wait until page loads then click menu to sign in
  driver.wait(until.elementLocated(By.id("id_s")), 1000).then((el) => {
    el.click();
  });

  // Wait for sign in menu to appear then click on the connect account button
  driver.wait(until.elementLocated(By.className("b_toggle")), 4000).then((el) => {
    el.click();
  });

  // Once page is loaded insert email address and then click next
  driver.wait(until.elementLocated(By.id("i0116")), 7000).then((el) => {
    el.sendKeys(outlookLogin[0][0]);
    driver.findElement(By.id("idSIButton9")).click();
  });

  // Once page is loaded insert password and then click next
  driver.wait(until.elementLocated(By.id("passwordDesc")), 10000).then(() => {
    pwdEl = driver.findElement(By.id("i0118"));
    pwdEl.sendKeys(outlookLogin[0][1]);

    signInBtn = driver.findElement(By.id("idSIButton9"));
    signInBtn.click();
    writeWords(driver)
  });
}

function startUpChrome(url) {
  let driver = new webdriver.Builder().forBrowser('chrome').build();
  driver.get(url);
  checkAllArr(driver);
}
startUpChrome("https://www.bing.com/");
