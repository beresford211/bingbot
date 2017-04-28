require('chromedriver');
let webdriver = require('selenium-webdriver'),
fetch = require('node-fetch'),
By = webdriver.By,
until  = webdriver.until;

let outlookLogin = [["testing@outlook.com", "testme"]], isVisible;

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
  let signInBtn, pwdDescEl, pwdEl;
  driver.wait(until.elementLocated(By.id("id_s")), 1000).then((el) => {
    el.click();
  });

  driver.wait(until.elementLocated(By.className("b_toggle")), 4000).then((el) => {
    el.click();
  });

  driver.wait(until.elementLocated(By.id("i0116")), 7000).then((el) => {
    el.sendKeys(outlookLogin[0][0]);
    driver.findElement(By.id("idSIButton9")).click();
  });

  driver.wait(until.elementLocated(By.id("passwordDesc")), 10000).then(() => {
    pwdEl = driver.findElement(By.id("i0118"));
    pwdEl.sendKeys(outlookLogin[0][1]);

    signInBtn = driver.findElement(By.id("idSIButton9"));
    signInBtn.click();
  });
}

function startUpChrome(url) {
  let driver = new webdriver.Builder().forBrowser('chrome').build();
  driver.get(url);
  checkAllArr(driver);
}
startUpChrome("https://www.bing.com/");
