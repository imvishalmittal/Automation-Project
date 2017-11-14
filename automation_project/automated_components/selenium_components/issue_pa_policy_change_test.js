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
