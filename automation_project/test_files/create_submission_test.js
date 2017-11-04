var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var driver = new webdriver.Builder()
	.forBrowser('firefox')
    .build();

driver.get('http://vmittal-t46:8180/pc/PolicyCenter.do');

driver.sleep(2000).then(
	function() {
	driver.findElement(By.xpath('//*[@id="Login:LoginScreen:LoginDV:username-inputEl"]')).sendKeys('su');
	driver.findElement(By.xpath('//*[@id="Login:LoginScreen:LoginDV:password-inputEl"]')).sendKeys('gw');
	driver.findElement(By.xpath('//*[@id="Login:LoginScreen:LoginDV:submit-btnInnerEl"]')).click();
	driver.sleep(10000);
	driver.findElement(By.xpath('//*[@id="QuickJump-inputEl"]')).sendKeys('Run Policy wIssuance PA');
	driver.findElement(By.xpath('//*[@id="QuickJump-inputEl"]')).sendKeys(webdriver.Key.ENTER);
	driver.sleep(15000);
	driver.findElement(By.xpath('//*[@id="PolicyFile_Summary:Policy_SummaryScreen:Policy_Summary_PolicyDV:PolicyNumber-inputEl"]')).getAttribute('innerHTML').then(function(policy){
		console.log(policy);
	});
	
});
driver.quit();
