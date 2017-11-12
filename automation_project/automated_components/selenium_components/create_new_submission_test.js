test.it('Create New Submission', function () {
    driver.findElement(By.xpath('//*[@id="QuickJump-inputEl"]')).sendKeys('Run Policy wIssuance '+ lob);
    driver.findElement(By.xpath('//*[@id="QuickJump-inputEl"]')).sendKeys(webdriver.Key.ENTER);
    driver.sleep(10000);
    driver.findElement(By.xpath('//*[@id="PolicyFile_Summary:Policy_SummaryScreen:Policy_Summary_PolicyDV:PolicyNumber-inputEl"]')).getAttribute('innerHTML').then(function (policy) {
        var policyNumber1 = policy;
        assert.notEqual(policyNumber1, "1234", "Policy Verfication msg");
    });
});
