var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var driver = new webdriver.Builder()
	.forBrowser('firefox')
    .build();

driver.get('http://localhost:8180/pc/PolicyCenter.do');
driver.sleep(2000).then(function() {
	
  driver.getTitle().then(function(title) {
      //document.getElementById("lblVersionDetail").style.display = 'inline';
      console.log(title)
  });
});

driver.quit();
