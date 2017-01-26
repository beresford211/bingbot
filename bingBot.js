require('chromedriver');
var webdriver = require('selenium-webdriver'),
routes = require('./routes.js'),
fetch = require('node-fetch'),
  By = webdriver.By,
  until  = webdriver.until;

var outlookEmail = // enter credenetials
var outlookPw = // enter credenetials

function sendDataToNode(listofUsers) {
  var data = JSON.stringify(listofUsers);
  console.log("data", typeof data);
	fetch("http://localhost:8888/submituserData", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: data,
		success: function(data) {
      console.log("Data", data);
		},
		error: function(err) {
		  console.log("This is your err ", err);
		}
	});
}


let writeWords = (driver) => {
  let url = "http://www.bing.com/search?q=", options = ["testing", "this", "out", "please", "tell", "me", "what", "is", "the", "result"]
  let intId
  intId = setInterval(()=>{
      if(options.length === 0){
        clearInterval(intId);
      } else {
        driver.navigate().to(url + options.pop());
      }
  }, (Math.random() + 1 ) * 1000);
}

function checkAllArr(driver){
  setTimeout(() => {
    let login = driver.findElement(By.id("id_s"));
    login.click();
    setTimeout(()=>{
      let connect = driver.findElement(By.className("b_toggle"));
      connect.click();
    }, 1000);
    setTimeout(()=>{
    let email = driver.findElement(By.id("i0116"));
    email.sendKeys(outlookEmail);
    let nextBtn = driver.findElement(By.id("idSIButton9"));
    nextBtn.click();

        setTimeout(()=>{
          let password = driver.findElement(By.id("i0118"));
          password.sendKeys(outlookPw);
          var submitButton = driver.findElement(By.id("idSIButton9"));
          submitButton.click();
          writeWords(driver);
        }, 40000);
    }, 3000);

  }, 5000);
}

(function startUpChrome(url) {
  let driver = new webdriver.Builder().forBrowser('chrome').build();
  driver.get(url);
  checkAllArr(driver);
})("https://www.bing.com/");
