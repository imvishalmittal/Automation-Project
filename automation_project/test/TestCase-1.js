var lob = 'PA';
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
    this.timeout(25000);

    //Login as 'su'
    test.it('Log in', function () {
        driver.findElement(By.xpath('//*[@id="Login:LoginScreen:LoginDV:username-inputEl"]')).sendKeys('su');
        driver.findElement(By.xpath('//*[@id="Login:LoginScreen:LoginDV:password-inputEl"]')).sendKeys('gw');
        // a promise is returned while ‘click’ action
        // is registered in ‘driver’ object
        driver.findElement(By.xpath('//*[@id="Login:LoginScreen:LoginDV:submit-btnInnerEl"]')).click();
    });

    //Create New Policy
    var policyNumber = "";
    test.it('Create New Submission', function () {
        driver.findElement(By.xpath('//*[@id="QuickJump-inputEl"]')).sendKeys('Run Policy wIssuance '+ lob);
        driver.findElement(By.xpath('//*[@id="QuickJump-inputEl"]')).sendKeys(webdriver.Key.ENTER);
        driver.sleep(10000);
        driver.findElement(By.xpath('//*[@id="PolicyFile_Summary:Policy_SummaryScreen:Policy_Summary_PolicyDV:PolicyNumber-inputEl"]')).getAttribute('innerHTML').then(function (policy) {
            policyNumber = policy;
            assert.notEqual(policyNumber, "1234", "Policy Number Verfication");
        });
    });

//Issue PA Policy Change
var addDays = Number("60");
test.it('Issue PA Policy Change', function () {
    //Navigate to Policy File screen from search
    driver.findElement(By.xpath('//*[@id="TabBar:SearchTab-btnInnerEl"]')).click().then(function(){
        driver.sleep(1000);
        driver.findElement(By.xpath('//*[@id="PolicySearch:PolicySearchScreen:DatabasePolicySearchPanelSet:PolicySearchDV:PolicyNumberCriterion-inputEl"]')).clear();
        driver.findElement(By.xpath('//*[@id="PolicySearch:PolicySearchScreen:DatabasePolicySearchPanelSet:PolicySearchDV:PolicyNumberCriterion-inputEl"]')).sendKeys(policyNumber)
        driver.findElement(By.xpath('//*[@id="PolicySearch:PolicySearchScreen:DatabasePolicySearchPanelSet:PolicySearchDV:SearchAndResetInputSet:SearchLinksInputSet:Search"]')).click()
        //TO DO - Verify search count
        driver.findElement(By.xpath('//*[@id="PolicySearch:PolicySearchScreen:DatabasePolicySearchPanelSet:PolicySearch_ResultsLV:0:PolicyNumber"]')).click();
        driver.sleep(2000);
        driver.findElement(By.xpath('//*[@id="PolicyFile:PolicyFileMenuActions-btnInnerEl"]')).click();
        driver.findElement(By.xpath('//*[@id="PolicyFile:PolicyFileMenuActions:PolicyFileMenuActions_NewWorkOrder:PolicyFileMenuActions_ChangePolicy-textEl"]')).click().then(function() {
            driver.findElement(By.xpath('//*[@id="StartPolicyChange:StartPolicyChangeScreen:StartPolicyChangeDV:EffectiveDate_date-inputEl"]')).getAttribute('value').then(function(dateFieldValue){
                var d = new Date(dateFieldValue);
                d.setDate(d.getDate() + addDays);
                var newDate = d.getMonth() +1 + "/" + d.getDate() + "/" + d.getUTCFullYear();
                driver.findElement(By.xpath('//*[@id="StartPolicyChange:StartPolicyChangeScreen:StartPolicyChangeDV:EffectiveDate_date-inputEl"]')).clear();
                driver.findElement(By.xpath('//*[@id="StartPolicyChange:StartPolicyChangeScreen:StartPolicyChangeDV:EffectiveDate_date-inputEl"]')).sendKeys(newDate + webdriver.Key.TAB);
                //driver.findElement(By.xpath('//*[@id="StartPolicyChange:StartPolicyChangeScreen:StartPolicyChangeDV:Description-inputEl"]')).sendKeys("Change");
                driver.sleep(2000);
                driver.findElement(By.xpath('//*[@id="StartPolicyChange:StartPolicyChangeScreen:NewPolicyChange"]')).click().then(function(){
                    driver.sleep(5000);
                    driver.findElement(By.xpath('//*[@id="PolicyChangeWizard:OfferingScreen:JobWizardToolbarButtonSet:QuoteTypeToolbarButtonSet:Quote"]')).click().then(function(){
                        driver.sleep(10000);
                        driver.findElement(By.xpath('//*[@id="PolicyChangeWizard:PolicyChangeWizard_QuoteScreen:JobWizardToolbarButtonSet:BindPolicyChange"]')).click().then(function(){
                            driver.sleep(2000);
                            driver.findElement(By.xpath('//*[@id="button-1005"]')).click().then(function(){
                                driver.sleep(10000);
                                driver.findElement(By.xpath('//*[@id="JobComplete:JobCompleteScreen:Message"]')).getAttribute('innerHTML').then(function(msg){
                                    assert.include(msg, "Your Policy Change", "Policy change bound message verification");
                                    assert.include(msg, "has been bound", "Policy change bound message verification");
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

//Issue PA Policy Change
var addDays = Number("60");
test.it('Issue PA Policy Change', function () {
    //Navigate to Policy File screen from search
    driver.findElement(By.xpath('//*[@id="TabBar:SearchTab-btnInnerEl"]')).click().then(function(){
        driver.sleep(1000);
        driver.findElement(By.xpath('//*[@id="PolicySearch:PolicySearchScreen:DatabasePolicySearchPanelSet:PolicySearchDV:PolicyNumberCriterion-inputEl"]')).clear();
        driver.findElement(By.xpath('//*[@id="PolicySearch:PolicySearchScreen:DatabasePolicySearchPanelSet:PolicySearchDV:PolicyNumberCriterion-inputEl"]')).sendKeys(policyNumber)
        driver.findElement(By.xpath('//*[@id="PolicySearch:PolicySearchScreen:DatabasePolicySearchPanelSet:PolicySearchDV:SearchAndResetInputSet:SearchLinksInputSet:Search"]')).click()
        //TO DO - Verify search count
        driver.findElement(By.xpath('//*[@id="PolicySearch:PolicySearchScreen:DatabasePolicySearchPanelSet:PolicySearch_ResultsLV:0:PolicyNumber"]')).click();
        driver.sleep(2000);
        driver.findElement(By.xpath('//*[@id="PolicyFile:PolicyFileMenuActions-btnInnerEl"]')).click();
        driver.findElement(By.xpath('//*[@id="PolicyFile:PolicyFileMenuActions:PolicyFileMenuActions_NewWorkOrder:PolicyFileMenuActions_ChangePolicy-textEl"]')).click().then(function() {
            driver.findElement(By.xpath('//*[@id="StartPolicyChange:StartPolicyChangeScreen:StartPolicyChangeDV:EffectiveDate_date-inputEl"]')).getAttribute('value').then(function(dateFieldValue){
                var d = new Date(dateFieldValue);
                d.setDate(d.getDate() + addDays);
                var newDate = d.getMonth() +1 + "/" + d.getDate() + "/" + d.getUTCFullYear();
                driver.findElement(By.xpath('//*[@id="StartPolicyChange:StartPolicyChangeScreen:StartPolicyChangeDV:EffectiveDate_date-inputEl"]')).clear();
                driver.findElement(By.xpath('//*[@id="StartPolicyChange:StartPolicyChangeScreen:StartPolicyChangeDV:EffectiveDate_date-inputEl"]')).sendKeys(newDate + webdriver.Key.TAB);
                //driver.findElement(By.xpath('//*[@id="StartPolicyChange:StartPolicyChangeScreen:StartPolicyChangeDV:Description-inputEl"]')).sendKeys("Change");
                driver.sleep(2000);
                driver.findElement(By.xpath('//*[@id="StartPolicyChange:StartPolicyChangeScreen:NewPolicyChange"]')).click().then(function(){
                    driver.sleep(5000);
                    driver.findElement(By.xpath('//*[@id="PolicyChangeWizard:OfferingScreen:JobWizardToolbarButtonSet:QuoteTypeToolbarButtonSet:Quote"]')).click().then(function(){
                        driver.sleep(10000);
                        driver.findElement(By.xpath('//*[@id="PolicyChangeWizard:PolicyChangeWizard_QuoteScreen:JobWizardToolbarButtonSet:BindPolicyChange"]')).click().then(function(){
                            driver.sleep(2000);
                            driver.findElement(By.xpath('//*[@id="button-1005"]')).click().then(function(){
                                driver.sleep(10000);
                                driver.findElement(By.xpath('//*[@id="JobComplete:JobCompleteScreen:Message"]')).getAttribute('innerHTML').then(function(msg){
                                    assert.include(msg, "Your Policy Change", "Policy change bound message verification");
                                    assert.include(msg, "has been bound", "Policy change bound message verification");
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

});
function verifyContent(xpath, attribute, expected, msg){
    driver.findElement(By.xpath(xpath)).getAttribute(attribute).then(function (content) {
        assert.equal(content, expected, msg);
    });
}
