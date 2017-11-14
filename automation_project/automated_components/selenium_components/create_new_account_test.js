    //Create New Account
    var uniqueKey = Math.random().toString(36).substr(2, 9);
    var accountFirstName = "Test";
    var accountLastName = "Account-" + uniqueKey;
    test.it('Create New Account', function () {
        //Navigate to New Account screen and search for an account
        driver.findElement(By.xpath('//*[@id="Desktop:DesktopMenuActions-btnInnerEl"]')).click();
        driver.findElement(By.xpath('//*[@id="Desktop:DesktopMenuActions:DesktopMenuActions_Create:DesktopMenuActions_NewAccount-textEl"]')).click().then(function () {
            driver.findElement(By.xpath('//*[@id="NewAccount:NewAccountScreen:NewAccountSearchDV:GlobalPersonNameInputSet:FirstName-inputEl"]')).sendKeys(accountFirstName);
            driver.findElement(By.xpath('//*[@id="NewAccount:NewAccountScreen:NewAccountSearchDV:GlobalPersonNameInputSet:LastName-inputEl"]')).sendKeys(accountLastName);
            driver.findElement(By.xpath('//*[@id="NewAccount:NewAccountScreen:NewAccountSearchDV:SearchAndResetInputSet:SearchLinksInputSet:Search"]')).click();
            driver.findElement(By.xpath('//*[@id="NewAccount:NewAccountScreen:NewAccountButton-btnInnerEl"]')).click().then(function () {
                driver.findElement(By.xpath('//*[@id="NewAccount:NewAccountScreen:NewAccountButton:NewAccount_Person-textEl"]')).click().then(function () {

                    //Verify first name and last name carried forward to screen
                    verifyContent('//*[@id="CreateAccount:CreateAccountScreen:CreateAccountDV:CreateAccountContactInputSet:GlobalPersonNameInputSet:FirstName-inputEl"]', 'value', accountFirstName, "First Name Verification");
                    verifyContent('//*[@id="CreateAccount:CreateAccountScreen:CreateAccountDV:CreateAccountContactInputSet:GlobalPersonNameInputSet:LastName-inputEl"]', 'value', accountLastName, "Last Name Verification");
                    driver.findElement(By.xpath('//*[@id="CreateAccount:CreateAccountScreen:CreateAccountDV:AddressInputSet:globalAddressContainer:GlobalAddressInputSet:AddressLine1-inputEl"]')).sendKeys("101 Parkway");
                    driver.findElement(By.xpath('//*[@id="CreateAccount:CreateAccountScreen:CreateAccountDV:AddressInputSet:globalAddressContainer:GlobalAddressInputSet:City-inputEl"]')).sendKeys("San Mateo");

                    //Navigate to search for organization
                    driver.findElement(By.xpath('//*[@id="CreateAccount:CreateAccountScreen:CreateAccountDV:ProducerSelectionInputSet:Producer:SelectOrganization"]')).click();
                    driver.findElement(By.xpath('//*[@id="OrganizationSearchPopup:OrganizationSearchPopupScreen:OrganizationSearchDV:GlobalContactNameInputSet:Name-inputEl"]')).sendKeys("Armstrong");
                    driver.findElement(By.xpath('//*[@id="OrganizationSearchPopup:OrganizationSearchPopupScreen:OrganizationSearchDV:SearchAndResetInputSet:SearchLinksInputSet:Search"]')).click();

                    driver.findElement(By.xpath('//*[@id="OrganizationSearchPopup:OrganizationSearchPopupScreen:OrganizationSearchResultsLV:0:_Select"]')).click();
                    driver.sleep(2000);
                    driver.findElement(By.xpath('//*[@id="CreateAccount:CreateAccountScreen:CreateAccountDV:AddressInputSet:globalAddressContainer:GlobalAddressInputSet:State-inputEl"]')).sendKeys("California");
                    driver.findElement(By.xpath('//*[@id="CreateAccount:CreateAccountScreen:CreateAccountDV:AddressInputSet:globalAddressContainer:GlobalAddressInputSet:PostalCode-inputEl"]')).clear()
                    driver.findElement(By.xpath('//*[@id="CreateAccount:CreateAccountScreen:CreateAccountDV:AddressInputSet:globalAddressContainer:GlobalAddressInputSet:PostalCode-inputEl"]')).sendKeys("94404");
                    driver.sleep(1000);
                    driver.findElement(By.xpath('//*[@id="CreateAccount:CreateAccountScreen:CreateAccountDV:AddressType-inputWrap"]')).click();
                    driver.findElement(By.xpath('//*[@id="CreateAccount:CreateAccountScreen:CreateAccountDV:AddressType-inputEl"]')).clear();
                    driver.findElement(By.xpath('//*[@id="CreateAccount:CreateAccountScreen:CreateAccountDV:AddressType-inputEl"]')).sendKeys("Billing");
                    driver.findElement(By.xpath('//*[@id="CreateAccount:CreateAccountScreen:CreateAccountDV:ProducerSelectionInputSet:ProducerCode-inputWrap"]')).click();
                    //driver.findElement(By.xpath('//*[@id="CreateAccount:CreateAccountScreen:CreateAccountDV:ProducerSelectionInputSet:ProducerCode-inputEl"]')).sendKeys(webdriver.Key.BACK_SPACE + webdriver.Key.ARROW_DOWN + webdriver.Key.ARROW_DOWN + webdriver.Key.ENTER);
                    driver.findElement(By.xpath('//*[@id="CreateAccount:CreateAccountScreen:CreateAccountDV:ProducerSelectionInputSet:ProducerCode-inputEl"]')).clear();
                    driver.findElement(By.xpath('//*[@id="CreateAccount:CreateAccountScreen:CreateAccountDV:ProducerSelectionInputSet:ProducerCode-inputEl"]')).sendKeys("100-002541 Armstrong (Premier)");
                    driver.sleep(2000);

                    driver.findElement(By.xpath('//*[@id="CreateAccount:CreateAccountScreen:Update-btnInnerEl"]')).sendKeys(webdriver.Key.ALT + "U")
                    driver.sleep(2000);
                    //
                    verifyContent('//*[@id="AccountFile_Summary:AccountFile_SummaryScreen:ttlBar"]', 'innerHTML', "Account File Summary", "Account Summary Verification - Header");
                    verifyContent('//*[@id="AccountFile_Summary:AccountFile_SummaryScreen:AccountFile_Summary_BasicInfoDV:Name-inputEl"]', 'innerHTML', accountFirstName + " " + accountLastName, "Account Summary Verification - Name");
                    verifyContent('//*[@id="AccountFile_Summary:AccountFile_SummaryScreen:AccountFile_Summary_BasicInfoDV:AccountStatus-inputEl"]', 'innerHTML', "Pending", "Account Summary Verification - Status");
                    verifyContent('//*[@id="AccountFile_Summary:AccountFile_SummaryScreen:AccountFile_Summary_BasicInfoDV:AddressShortInputSet:AddressType-inputEl"]', 'innerHTML', "Billing", "Account Summary Verification - Address Type");
                    // verifyContent('//*[@id="AccountFile_Summary:AccountFile_SummaryScreen:AccountFile_Summary_BasicInfoDV:AccountNumber-inputEl"]', 'innerHTML', "1234", "Account Summary Verification - Account Number");
                    //});
                });
            });
        });
    });
