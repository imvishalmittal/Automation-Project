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
