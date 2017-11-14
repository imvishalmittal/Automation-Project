function verifyContent(xpath, attribute, expected, msg){
    driver.findElement(By.xpath(xpath)).getAttribute(attribute).then(function (content) {
        assert.equal(content, expected, msg);
    });
}