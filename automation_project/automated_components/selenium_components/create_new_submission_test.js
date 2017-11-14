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
