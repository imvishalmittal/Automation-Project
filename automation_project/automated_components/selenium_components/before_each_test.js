var assert = require('chai').assert;
var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;
var test = require('selenium-webdriver/testing');
var driver;

test.before(function () {
    this.timeout(15000);
    driver = new webdriver.Builder()
        .forBrowser('firefox')
        .build();
    driver.get('http://localhost:8190/pc/PolicyCenter.do');
});

test.after(function () {
    driver.quit();
});

test.describe( fileName , function() {
    this.timeout(15000);
    test.it('Log in', function () {
        driver.findElement(By.xpath('//*[@id="Login:LoginScreen:LoginDV:username-inputEl"]')).sendKeys('su');
        driver.findElement(By.xpath('//*[@id="Login:LoginScreen:LoginDV:password-inputEl"]')).sendKeys('gw');
        // a promise is returned while ‘click’ action
        // is registered in ‘driver’ object
        driver.findElement(By.xpath('//*[@id="Login:LoginScreen:LoginDV:submit-btnInnerEl"]')).click();
    });