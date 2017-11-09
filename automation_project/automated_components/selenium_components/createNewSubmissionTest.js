var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();

var policyNumber1, policyNumber2;
driver.get('http://localhost:8190/pc/PolicyCenter.do');

driver.getTitle().then(function(title) {
    //document.getElementById("lblVersionDetail").style.display = 'inline';
    console.log(title)
});

/*driver.sleep(2000).then(
    function() {
        driver.findElement(By.xpath('//*[@id="Login:LoginScreen:LoginDV:username-inputEl"]')).sendKeys('su');
        driver.findElement(By.xpath('//*[@id="Login:LoginScreen:LoginDV:password-inputEl"]')).sendKeys('gw');
        driver.findElement(By.xpath('//*[@id="Login:LoginScreen:LoginDV:submit-btnInnerEl"]')).click();
        driver.sleep(10000);

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
*/
driver.sleep(2000).then(
    function() {
        driver.findElement(By.xpath('//*[@id="Login:LoginScreen:LoginDV:username-inputEl"]')).sendKeys('su');
        driver.findElement(By.xpath('//*[@id="Login:LoginScreen:LoginDV:password-inputEl"]')).sendKeys('gw');
        driver.findElement(By.xpath('//*[@id="Login:LoginScreen:LoginDV:submit-btnInnerEl"]')).click();
        driver.sleep(10000);
        driver.findElement(By.xpath('//*[@id="QuickJump-inputEl"]')).sendKeys('Run Policy wIssuance PA');
        driver.findElement(By.xpath('//*[@id="QuickJump-inputEl"]')).sendKeys(webdriver.Key.ENTER);
        driver.sleep(20000);
        driver.findElement(By.xpath('//*[@id="PolicyFile_Summary:Policy_SummaryScreen:Policy_Summary_PolicyDV:PolicyNumber-inputEl"]')).getAttribute('innerHTML').then(function(policy){
            policyNumber1 = policy;
            console.log(policy);
        });

    });
driver.sleep(2000).then(
    function() {
        //driver.findElement(By.xpath('//*[@id="Login:LoginScreen:LoginDV:username-inputEl"]')).sendKeys('su');
        //driver.findElement(By.xpath('//*[@id="Login:LoginScreen:LoginDV:password-inputEl"]')).sendKeys('gw');
        //driver.findElement(By.xpath('//*[@id="Login:LoginScreen:LoginDV:submit-btnInnerEl"]')).click();
        //driver.sleep(10000);
        driver.findElement(By.xpath('//*[@id="QuickJump-inputEl"]')).sendKeys('Run Policy wIssuance CP');
        driver.findElement(By.xpath('//*[@id="QuickJump-inputEl"]')).sendKeys(webdriver.Key.ENTER);
        driver.sleep(20000);
        driver.findElement(By.xpath('//*[@id="PolicyFile_Summary:Policy_SummaryScreen:Policy_Summary_PolicyDV:PolicyNumber-inputEl"]')).getAttribute('innerHTML').then(function(policy){
            console.log(policy);
            policyNumber2 = policy;
            console.log(policyNumber1 + " and " + policyNumber2);
        });

    });
driver.quit();

