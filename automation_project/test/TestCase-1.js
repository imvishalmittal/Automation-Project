var lob = 'CP';
var fileName = 'TestCase-1.js';
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
test.it('Create New Account', function () {
    driver.findElement(By.xpath('//*[@id="QuickJump-inputEl"]')).sendKeys('Run Policy wIssuance PA');
    driver.findElement(By.xpath('//*[@id="QuickJump-inputEl"]')).sendKeys(webdriver.Key.ENTER);
    driver.sleep(10000);
    driver.findElement(By.xpath('//*[@id="PolicyFile_Summary:Policy_SummaryScreen:Policy_Summary_PolicyDV:PolicyNumber-inputEl"]')).getAttribute('innerHTML').then(function (policy) {
        var policyNumber1 = policy;
        assert.notEqual(policyNumber1, "1234", "Policy Verfication msg");
    });
});

test.it('Create New Submission', function () {
    driver.findElement(By.xpath('//*[@id="QuickJump-inputEl"]')).sendKeys('Run Policy wIssuance '+ lob);
    driver.findElement(By.xpath('//*[@id="QuickJump-inputEl"]')).sendKeys(webdriver.Key.ENTER);
    driver.sleep(10000);
    driver.findElement(By.xpath('//*[@id="PolicyFile_Summary:Policy_SummaryScreen:Policy_Summary_PolicyDV:PolicyNumber-inputEl"]')).getAttribute('innerHTML').then(function (policy) {
        var policyNumber1 = policy;
        assert.notEqual(policyNumber1, "1234", "Policy Verfication msg");
    });
});

});
