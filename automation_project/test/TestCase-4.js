var lob = 'PA';
var fileName = 'TestCase-4.js';
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
    this.timeout(50000);

    //Login as 'su'
    test.it('Log in', function () {
        driver.findElement(By.xpath('//*[@id="Login:LoginScreen:LoginDV:username-inputEl"]')).sendKeys('su');
        driver.findElement(By.xpath('//*[@id="Login:LoginScreen:LoginDV:password-inputEl"]')).sendKeys('gw');
        // a promise is returned while ‘click’ action
        // is registered in ‘driver’ object
        driver.findElement(By.xpath('//*[@id="Login:LoginScreen:LoginDV:submit-btnInnerEl"]')).click();
    });

driver.sleep(2000).then(
	function() {
	driver.findElement(By.xpath('//*[@id="QuickJump-inputEl"]')).sendKeys(webdriver.Key.ALT + webdriver.Key.SHIFT + "T");
	driver.sleep(10000);	
	driver.findElement(By.xpath('//*[@id="InternalToolsTabBar:UnsupportedToolsTab-btnInnerEl"]')).click();	
	driver.findElement(By.xpath('/html/body/div[2]/div/div/div/div[3]/div[2]/div[1]/div/table[4]/tbody/tr/td/div/span')).click();	
	driver.findElement(By.xpath('//*[@id="PCSampleData:PCSampleDataScreen:SampleDataSetsLV:2:LoadSampleData"]')).click();	
	driver.sleep(25000);
	driver.findElement(By.xpath('//*[@id="PCSampleData:PCSampleDataScreen:_msgs"]/div')).then(function(){
		driver.findElement(By.xpath('//*[@id="PCSampleData:PCSampleDataScreen:_msgs"]/div')).getAttribute('innerText').then(function(error){
		console.log(error);		
		});		
	}, function(err) {
		if (err instanceof webdriver.error.NoSuchElementError) {
        return false;//it was not found
		} 
	});
	
	
		driver.findElement(By.xpath('//*[@id="PCSampleData:PCSampleDataScreen:0"]')).then(function(){
		driver.findElement(By.xpath('//*[@id="PCSampleData:PCSampleDataScreen:0"]')).getAttribute('innerHTML').then(function(status){
		console.log(status);
		});		
	}, function(err) {
		if (err instanceof webdriver.error.NoSuchElementError) {
        return false;//it was not found
		} 
	});
});

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
var d = new Date();
d.setDate(d.getDate() + addDays);
var newDate = d.getMonth() +1 + "/" + d.getDate() + "/" + d.getUTCFullYear();

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
            driver.findElement(By.xpath('//*[@id="StartPolicyChange:StartPolicyChangeScreen:StartPolicyChangeDV:EffectiveDate_date-inputEl"]')).clear();
            driver.sleep(1000);
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

//Issue PA Policy Change
var addDays = Number("60");
var d = new Date();
d.setDate(d.getDate() + addDays);
var newDate = d.getMonth() +1 + "/" + d.getDate() + "/" + d.getUTCFullYear();

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
            driver.findElement(By.xpath('//*[@id="StartPolicyChange:StartPolicyChangeScreen:StartPolicyChangeDV:EffectiveDate_date-inputEl"]')).clear();
            driver.sleep(1000);
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
function verifyContent(xpath, attribute, expected, msg){
    driver.findElement(By.xpath(xpath)).getAttribute(attribute).then(function (content) {
        assert.equal(content, expected, msg);
    });
}
