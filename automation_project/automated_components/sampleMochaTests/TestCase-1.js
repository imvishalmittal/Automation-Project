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

test.describe( "Test Case" , function() {
    this.timeout(15000);
    test.it('Log in', function () {
        driver.findElement(By.xpath('//*[@id="Login:LoginScreen:LoginDV:username-inputEl"]')).sendKeys('su');
        driver.findElement(By.xpath('//*[@id="Login:LoginScreen:LoginDV:password-inputEl"]')).sendKeys('gw');
        // a promise is returned while ‘click’ action
        // is registered in ‘driver’ object
        driver.findElement(By.xpath('//*[@id="Login:LoginScreen:LoginDV:submit-btnInnerEl"]')).click();
    });
this.timeout(15000);
test.it('Create Policy', function () {
    driver.findElement(By.xpath('//*[@id="QuickJump-inputEl"]')).sendKeys('Run Policy wIssuance PA');
    driver.findElement(By.xpath('//*[@id="QuickJump-inputEl"]')).sendKeys(webdriver.Key.ENTER);
    driver.sleep(10000);
    driver.findElement(By.xpath('//*[@id="PolicyFile_Summary:Policy_SummaryScreen:Policy_Summary_PolicyDV:PolicyNumber-inputEl"]')).getAttribute('innerHTML').then(function (policy) {
        var policyNumber1 = policy;
        assert.notEqual(policyNumber1, "1234", "Policy Verfication msg");
    });
});

});
