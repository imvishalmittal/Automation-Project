var d = new Date();
var testFlow = "";
var dbExists = false;
var buildDir = "";
function backupDBExists(existence){
	if (existence == "no"){		
		document.getElementById("prerequisiteTable").style.visibility="visible";
		document.getElementById("baseConfigColumn").style.visibility="visible";
		document.getElementById("baseConfigForm").style.display="block";		
	} 
	else
	{
		document.getElementById("prerequisiteTable").style.visibility="visible";
		document.getElementById("baseConfigColumn").style.visibility="collapse";
		document.getElementById("baseConfigForm").style.display="none";	
	}
}
/*function runConfig(id){
	var buildZipPath, dbName, dbServer, buildBranch, buildDir, patchPath;
	var toDo = "";	
	var testDirectory = document.getElementById("testDirectory").value;
	document.getElementById("imgUpgCopyBuild").style.display = "none";
	document.getElementById("imgUpgunzBuild").style.display = "none";
	document.getElementById("imgUpgCreateDB").style.display = "none";
	document.getElementById("imgUpgUpdDBConf").style.display = "none";
	document.getElementById("imgUpgDrpDB").style.display = "none";	
	document.getElementById("imgApplyPatch").style.display = "none";	
	document.getElementById("imgUpdConfigEIT").style.display = "none";	
	if (id == "runUpgradeConfigButton"){
		buildZipPath = document.getElementById("newBuildZipPath").value;
		dbName = document.getElementById("newDbName").value;
		dbServer = document.getElementById("upgradeDBServer").value;
		dbServer = dbServer.replace("\\\\","\\");
		buildBranch = document.getElementById("upgradeBuildBranch").value;
		patchPath = document.getElementById("patchBuildZipPath").value
	}
	if (confirm("Setup patch build??")){
		skm_LockScreen('LockOn');	
		copyBuild(buildZipPath, testDirectory);
		var buildDir = unzipBuild(buildZipPath, testDirectory);			
		createDB(dbName, dbServer);
		updateDBConfig(dbServer, dbName, buildBranch, buildDir);
		var buildStatus = true;
		if(buildBranch != "granite"){applyPatch(buildBranch, buildDir, patchPath, buildStatus);}
		updateConfig(buildBranch, buildDir);
		dropDB(buildBranch, buildDir);
		startServer(buildDir);
		skm_LockScreen('LockOff');
	}				
}*/
function connectAndBackupDB() {
	var connection = new ActiveXObject("ADODB.Connection") ; 
	var connectionstring="Provider=SQLOLEDB;Data Source=REDSKULL\\SQLSERVER2012;UID=sa;PASSWORD=Gw_123;DATABASE=vmittal_PC804P5";	 
	connection.Open(connectionstring);		
	var rs = new ActiveXObject("ADODB.Recordset");	 
	rs.Open("BACKUP DATABASE vmittal_PC804P5 TO DISK='C:\\vmittal_PC804P5.BAK' WITH FORMAT", connection);	
	connection.close;
}
function copyBuild(buildZipPath, testDirectory) {	
	if (confirm("Copying build from " + buildZipPath + " to " + testDirectory + "??")){		    
		document.getElementById("imgUpgCopyBuild").style.display = "inline";
		cmdLine = "xcopy " + buildZipPath + " " + testDirectory;			
		var wsh = new ActiveXObject("WScript.Shell");
		wsh.Run(cmdLine, 1, true);				
		document.getElementById("imgUpgCopyBuild").src = "resources/check-mark.gif";
		//alert("Build copied!!");		
		wsh.close;
	}	
}
function unzipBuild(buildZipPath, testDirectory) {    
	var fso = new ActiveXObject("Scripting.FileSystemObject");		
	var zipFileName = fso.GetFileName(buildZipPath);
	if(zipFileName == ""){zipFileName = prompt("Please provide build zip filename to be unzipped!!");}
	var cmdLine = "7z x -o" + testDirectory + zipFileName.replace(".zip", "") + " " + testDirectory + zipFileName;	
	document.getElementById("imgUpgunzBuild").style.display = "inline";
	var wsh = new ActiveXObject("WScript.Shell");
	wsh.Run(cmdLine, 1, true);
	var buildDir = testDirectory + zipFileName.replace(".zip", "") + "\\";
	if (fso.FileExists(buildDir + "PolicyCenter.zip")){
		cmdLine = "7z x -o" + buildDir + "PolicyCenter " + buildDir + "PolicyCenter.zip";
		wsh.Run(cmdLine, 1, true);
		buildDir = buildDir + "PolicyCenter\\"
	}
	document.getElementById("imgUpgunzBuild").src = "resources/check-mark.gif";
	//alert("Build unzipped!!");
	fso.close;
	wsh.close;
	return buildDir
}	
function createDB(dbName, dbServer) {
	document.getElementById("imgUpgCreateDB").style.display = "inline";
	var connection = new ActiveXObject("ADODB.Connection") ; 
	var connectionstring="Provider=SQLOLEDB;Data Source=" + dbServer + ";UID=sa;PASSWORD=Gw_123";	 
	connection.Open(connectionstring);		
	var rs = new ActiveXObject("ADODB.Recordset");	 
	rs.Open("CREATE DATABASE " + dbName, connection);	
	connection.close;	
	document.getElementById("imgUpgCreateDB").src = "resources/check-mark.gif";	
	//alert("DB: " + dbName + " created at server: " + dbServer);
}
function updateDBConfig(dbServer, dbName, buildBranch, buildDir) {	
	if (buildDir == undefined){var buildDir = prompt("Please provide build directory path:\n(like: C:\\test\\PolicyCenter807\\PolicyCenter\\)");}

	var fso, dbConfigFile, file, newFile;	
	fso = new ActiveXObject("Scripting.FileSystemObject");
	
	if (buildBranch == "diamond"){alert("Update yourself!!");}
	else {dbConfigFile = buildDir + '\\modules\\configuration\\config\\database-config.xml';}	
	document.getElementById("imgUpgUpdDBConf").style.display = "inline";
	file = fso.GetFile(dbConfigFile);			
	file.name = d.getTime() + "_" + file.name;
	newFile = fso.OpenTextFile(dbConfigFile, 8, 1, -2);	
	newFile.WriteLine("\<\?xml version=\"1.0\"\?\>");
	newFile.WriteLine("\t\<database-config xmlns=\"http://guidewire.com/database-config\"\>");
	newFile.WriteLine("\t\<database name=\"PolicyCenterDatabase\" dbtype=\"sqlserver\"\>");
	if (dbServer == "REDSKULL\\SQLSERVER2014"){
		newFile.WriteLine("\t\t\<dbcp-connection-pool jdbc-url=\"jdbc:sqlserver://redskull:2014;databaseName=" + dbName + ";User=sa;Password=Gw_123\"\/\>");
	}
	else if (dbServer == "REDSKULL\\SQLSERVER2012"){
		newFile.WriteLine("\t\t\<dbcp-connection-pool jdbc-url=\"jdbc:sqlserver://redskull:2012;databaseName=" + dbName + ";User=sa;Password=Gw_123\"\/\>");
	} 
    newFile.WriteLine("\t\<\/database\>");
	newFile.WriteLine("\<\/database-config\>");
	newFile.close();
	fso.close;	
	document.getElementById("imgUpgUpdDBConf").src = "resources/check-mark.gif";
	//alert("DB confile update done: " + dbConfigFile);
}	
function dropDB(buildBranch, buildDir) {
	var wsh, cmdLineDropDB;
	if (buildDir == undefined){var buildDir = prompt("Please provide build directory path:\n(like: C:\\test\\PolicyCenter807\\PolicyCenter\\)");}	
	if (buildBranch == "ferrite"){		
		cmdLineDropDB = buildDir + "\\bin\\gwpc.bat dropDb";		
	}
	else {		
		cmdLineDropDB = buildDir + "\\bin\\gwpc.bat dev-dropdb";		
	}
	    	
	wsh = new ActiveXObject("WScript.Shell");	
	document.getElementById("imgUpgDrpDB").style.display = "inline";
	wsh.Run(cmdLineDropDB, 1, true);
	wsh.close;
	document.getElementById("imgUpgDrpDB").src = "resources/check-mark.gif";
}
function applyPatch(buildBranch, buildDir, patchPath, buildStatus) {
	var wsh;

	if (buildDir == undefined){var buildDir = prompt("Please provide build directory path:\n(like: C:\\test\\PolicyCenter807\\PolicyCenter\\)");}	
	if (patchPath == ""){var patchPath = prompt("Please provide patch build zip path");}	

	var fso = new ActiveXObject("Scripting.FileSystemObject");		
	var zipFileName = fso.GetFileName(patchPath);

	var cmdLineCopyPatch = "xcopy " + patchPath + " " + buildDir;			
	var cmdLineUnzipPatch = "7z x -o" + buildDir + " " + buildDir + zipFileName + " -y";	
	wsh = new ActiveXObject("WScript.Shell");	
	document.getElementById("imgApplyPatch").style.display = "inline";
	wsh.Run(cmdLineCopyPatch, 1, true);				
	wsh.Run(cmdLineUnzipPatch, 1, true);
	if (buildStatus == true){
		if(fso.FileExists(buildDir + "remove-deleted-files.bat")){
			wsh.Run("cd " + buildDir + 	" && remove-deleted-files.bat");
		}				
		if (buildBranch == "ferrite"){		
			wsh.Run(buildDir + "\\bin\\gwpc.bat clean cleanIdea", 1, true);
			wsh.Run(buildDir + "\\bin\\gwpc.bat compile idea", 1, true);				
			wsh.Run(buildDir + "\\bin\\gwpc.bat genJavaApi", 1, true);
		}
		else if (buildBranch == "emerald"){ 	
			wsh.Run(buildDir + "\\bin\\gwpc.bat regen-java-api", 1, true);
			wsh.Run(buildDir + "\\bin\\gwpc.bat regen-soap-api", 1, true);
		}
	}
	wsh.close;
	fso.close;
	document.getElementById("imgApplyPatch").src = "resources/check-mark.gif";
}
function updateConfig(buildBranch, buildDir) {	
	if (buildDir == undefined){var buildDir = prompt("Please provide build directory path:\n(like: C:\\test\\PolicyCenter807\\PolicyCenter\\)");}
	var configFile;	
	
	if (buildBranch == "diamond"){alert("Update yourself!!");}
	else {configFile = buildDir + '\\modules\\configuration\\config\\config.xml';}	
	document.getElementById("imgUpdConfigEIT").style.display = "inline";
	updateParamValue(buildDir, configFile, "EnableInternalDebugTools");
}

function updateParamValue(buildDir, configFile, paramToUpdate){	
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var key = d.getTime();
	fso.MoveFile(configFile, configFile + "_" + key);
	
	var fh = fso.OpenTextFile(configFile + "_" + key, 1, false);
	var newFile = fso.OpenTextFile(configFile, 2, true);
	while(!fh.AtEndOfStream){
		var lineContent = fh.ReadLine();		
		if (lineContent.indexOf(paramToUpdate) >= 0){
			lineContent = lineContent.replace("false", "true");		
		}
		newFile.WriteLine(lineContent);
	}
	fh.close();  
	newFile.close();
	fso.close;	
	document.getElementById("imgUpdConfigEIT").src = "resources/check-mark.gif";
}	
function startServer() {
    var wsh, cmdLineDevStart;
    var port = document.getElementById("port").value
    if(pingServer(port,'ToCheck')) {
        alert("Server already running on port!!");
        document.getElementById("imgUpgStrtSrvr").style.display = "inline";
        document.getElementById("imgUpgStrtSrvr").src = "resources/check-mark.gif";
        document.getElementById("testCaseListSection").style.visibility = 'visible';
    }
    else{
        if (document.buildDir == undefined || ""){document.buildDir = prompt("Please provide build directory path:\n(like: C:\\test\\PolicyCenter807\\PolicyCenter\\)");}
        cmdLineDevStart = document.buildDir + "\\bin\\gwpc.bat dev-start";

        wsh = new ActiveXObject("WScript.Shell");
        document.getElementById("imgUpgStrtSrvr").style.display = "inline";
        wsh.Run(cmdLineDevStart);//, 1, true);
        //wsh.close;
        if(pingServer(port,'')){
            document.getElementById("imgUpgStrtSrvr").src = "resources/check-mark.gif";
            document.getElementById("testCaseListSection").style.visibility = 'visible';
        }
    }
}
function onCheckboxChange(id, objName) {
	var changedItemState = "";
	var startCounter = false;
	var configChkbxArray = document.querySelectorAll("[name='" + objName + "']");	
	
	for (var i in configChkbxArray){
		if (configChkbxArray[i].id == id){
			if (changedItemState == ""){changedItemState = configChkbxArray[i].checked;}						
			startCounter = true;
		}
		else if(startCounter) {
			//alert(changedItemState);
			configChkbxArray[i].checked = changedItemState;
		}		
	}
}
function skm_LockScreen(toSet) 
      { 	      	      	
         var lock = document.getElementById('skm_LockPane'); 
         if (lock)
            lock.className = toSet;         					
      }
function pingServer(port, reason) {
	for (var i = 0 ; i <= 15 ; i++) {
		var wsh = new ActiveXObject("WScript.Shell");
		var status = wsh.exec("netstat -aon");// + port);
		wsh.close;

		if (status.StdOut.ReadAll().indexOf("0.0.0.0:" + port) >=0){
			return true;
			break;}
		else{
            if(reason == 'ToCheck'){
                return false;
                break;
            }
        }
		sleep(60000);
	}
}
function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}
function createConfigurationFile(){
    var testDirectory, buildZipPath, dbName, dbServer, buildBranch, patchPath;
    testDirectory= document.getElementById("testDirectory").value;
    buildZipPath = document.getElementById("newBuildZipPath").value;
    dbName = document.getElementById("newDbName").value;
    dbServer = document.getElementById("upgradeDBServer").value;
    //dbServer = dbServer.replace("\\\\","\\");
    buildBranch = document.getElementById("upgradeBuildBranch").value;
    patchPath = document.getElementById("patchBuildZipPath").value;
    var fso = new ActiveXObject("Scripting.FileSystemObject");
    if(fso.fileExists("C:\\Configuration.txt")){fso.DeleteFile("C:\\Configuration.txt");}
    newFile = fso.OpenTextFile("C:\\Configuration.txt", 8, true);
    newFile.WriteLine("testDirectory::" + testDirectory);
    newFile.WriteLine("newBuildZipPath::" + buildZipPath);
    newFile.WriteLine("newDbName::" + dbName);
    newFile.WriteLine("upgradeDBServer::" + dbServer);
    newFile.WriteLine("upgradeBuildBranch::" + buildBranch);
    newFile.WriteLine("patchBuildZipPath::" + patchPath);
    newFile.close();
    fso.close;
}
function loadConfiguration(){
    var fso = new ActiveXObject("Scripting.FileSystemObject");
    if(fso.fileExists("C:\\Configuration.txt")){
    	var configFile= fso.OpenTextFile("C:\\Configuration.txt", 1, false)
        while(!configFile.AtEndOfStream) {
            var splitLine= configFile.ReadLine().split("::");
            if(splitLine[1] != ""){document.getElementById(splitLine[0]).value = splitLine[1];}
        }
        configFile.Close();
    }
    fso.close;
    hidePatchOption();
}
function addTestCase(id) {
	document.getElementById("testCreatorTable").style.visibility = "visible";
    document.getElementById("addToListButton").style.visibility = "visible";
    document.getElementById("addToListCancelButton").style.visibility = "visible";
	document.getElementById("addSeleniumTestCase").style.visibility = "hidden";
    //var x = document.getElementById("testCreatorTable").rows.length
    var table = document.getElementById("testCreatorTable");

    if(id == "addSeleniumTestCase"){
        var row = table.insertRow();
        //row.insertCell(0).innerHTML = "<input type=\"checkbox\" name=\"testCaseSelector\"/>";
        var uniqueTableId = "testFlowTable";
        row.insertCell(0).innerHTML = "<table id=" + uniqueTableId + " style='width:100%'><tr bgcolor='#e9967a'><th>Steps</th><th>Transaction</th><th>Input Params</th><th>Output Params</th><th><button id='add' onClick='addRemoveTransactionRow(this.id, 0, \"" + uniqueTableId + "\")'>+</button></th></tr></table>";
	}
	else if(id == "addGosuTest")
	{
		alert("Code to be written");
    }
}
function hidePatchOption(){
    var buildBranch = document.getElementById("upgradeBuildBranch").value;
	if(buildBranch == "granite"){
        document.getElementById("patchBuildDetailsRow").style.display = "none";
    }
    else{
        document.getElementById("patchBuildDetailsRow").style.display = "table-row";
	}
}
function addRemoveTransactionRow(id, delRow, uniqueTableId) {
    var x = document.getElementById(uniqueTableId).rows.length
    var table = document.getElementById(uniqueTableId);

    if(id == "add"){
        var row = table.insertRow();
        var uniqueKey = Math.random().toString(36).substr(2, 9);
        row.insertCell(0).innerHTML = "Step " + x;
        row.insertCell(1).innerHTML = document.getElementById("transactionSelector").innerHTML;
        row.cells(1).innerHTML = (row.cells(1).innerHTML).replace("select:", "select:" + uniqueKey + ":" + uniqueTableId);
        row.insertCell(2).innerHTML = "<input style='width:98.5%;background-color: #9e9e9e' id='input:" + uniqueKey + ":" + uniqueTableId + "' readonly></input>";
        row.insertCell(3).innerHTML = "<input style='width:98.5%;background-color: #9e9e9e' id='output:" + uniqueKey + ":" + uniqueTableId + "' readonly></input>";
        row.insertCell(4).innerHTML = "<button id='remove' onClick='addRemoveTransactionRow(this.id, \"" + x + "\", \"" + uniqueTableId + "\")'>-</button>"
		loadOptionsFromFile("select:" + uniqueKey + ":" + uniqueTableId, "C:\\vmittal\\Project\\SelfLearning\\GitHub\\automation_project\\automated_components\\selenium_components.txt", "Transanction Type")
    }
    else if(id == "remove")
    {
        table.deleteRow(delRow);
    }
}
function populateTransactionParameters(id) {
	var selection = document.getElementById(id).value
    var splitId= id.split(":");
	var inputParamId = "input:" + splitId[1] + ":" + splitId[2];
    var outputParamId = "output:" + splitId[1] + ":" + splitId[2];
    var tableId = splitId[2];
    var x = document.getElementById(tableId).rows.length
    if(x == 2 && selection != "Create New Account") {
        document.getElementById(inputParamId).style.backgroundColor = 'white';
        document.getElementById(inputParamId).readOnly = false;
    }

    if(selection == "Create New Account"){
        document.getElementById(inputParamId).value = "";
        document.getElementById(outputParamId).value = "Account#"
    }
	else if(selection == "Create New Submission"){
    	document.getElementById(inputParamId).value = "Account#";
        document.getElementById(outputParamId).value = "Policy#"
	}
	else if(selection == "Issue PA Policy Change"){
        document.getElementById(inputParamId).value = "Policy*#; AddDays*#"
        document.getElementById(outputParamId).value = "Submission#"
        if(x!=2){
        	document.getElementById(inputParamId).value = "AddDays*#";
            document.getElementById(inputParamId).style.backgroundColor = 'white';
            document.getElementById(inputParamId).readOnly = false;
        }
	}

	if(x!=2 && selection !="Issue PA Policy Change"){document.getElementById(inputParamId).value = "";}
}
function addTestToList() {
    document.testFlow = "";
    createTestFlow();
    if (document.testFlow != "" && document.testFlow.indexOf("Select Transaction Type") < 0) {
        var fso = new ActiveXObject("Scripting.FileSystemObject");
        var newFile = fso.OpenTextFile("C:\\TestFile.csv", 8, true);
        var dataRows = newFile.Line;
        newFile.WriteLine("Test Case " + dataRows + "," + document.testFlow);
        newFile.close();
        fso.close;
        var toDeleteRowsCount1 = document.getElementById("testCreatorTable").rows.length
        var toDeleteFromTable1 = document.getElementById("testCreatorTable");
        for (var i = toDeleteRowsCount1 ; i > 0 ; i--){
            toDeleteFromTable1.deleteRow(i-1);
        }
        var toDeleteRowsCount2 = document.getElementById("testCasesList").rows.length
        var toDeleteFromTable2 = document.getElementById("testCasesList");
        for (var j = toDeleteRowsCount2 ; j > 1 ; j--){
            toDeleteFromTable2.deleteRow(j-1);
        }
        document.getElementById("testCreatorTable").style.visibility = "hidden";
        document.getElementById("addToListButton").style.visibility = "hidden";
        document.getElementById("addToListCancelButton").style.visibility = "hidden";
        document.getElementById("buttonSet").style.visibility = "visible";
        document.getElementById("addSeleniumTestCase").style.visibility = "visible";
        alert("Test added to list!!!");
    }
    else{
        alert("One or More missing transactions!!!");
    }
    writeTestListToPage();
}
function createTestFlow(){
    var x = document.getElementById("testFlowTable").rows.length

    var selectElementArray = document.getElementsByTagName("select");

    for (var i = 0 ; i < selectElementArray.length -1 ; i++){
    	var stepId = document.testFlow + selectElementArray[i].id;
        var splitId= stepId.split(":");
        var inputParamId = "input:" + splitId[1] + ":" + splitId[2];
        document.testFlow = document.testFlow + selectElementArray[i].value + "(" + document.getElementById(inputParamId).value + ") --> "
    }
}
function writeTestListToPage() {
    var fso = new ActiveXObject("Scripting.FileSystemObject");
    if (fso.fileExists("C:\\TestFile.csv")) {
        var existingFile = fso.OpenTextFile("C:\\TestFile.csv", 1, false);
        var table = document.getElementById("testCasesList");
        var r = 1;
        while (!existingFile.AtEndOfStream) {
            var lineContent = existingFile.ReadLine();
            var splitLineContent = lineContent.split(",");
            var row = table.insertRow();
            row.insertCell(0).innerHTML = splitLineContent[0];
            row.insertCell(1).innerHTML = splitLineContent[1];
            row.insertCell(2).innerHTML = "<button id='remove' onClick='addRemoveTransactionRow(this.id, \"" + (document.getElementById("testCasesList").rows.length - 1) + "\", \"testCasesList\")'>-</button>"
            createTestScriptFile("TestCase-" + r + ".js", splitLineContent[1]);
            r++;
        }
        existingFile.close();
    }
    fso.close;
}
function showTestList() {
	if (document.getElementById("showTestList").innerHTML == "Show Test List"){
        document.getElementById("showTestList").innerHTML = "Hide Test List";
		document.getElementById("testCaseListSection").style.visibility = "visible";
	}
	else{
        document.getElementById("showTestList").innerHTML = "Show Test List";
        document.getElementById("testCaseListSection").style.visibility = "hidden";
	}
}
function editTestCasesList() {
    if (document.getElementById("editTestCasesList").innerHTML == "Edit"){
        document.getElementById("editTestCasesList").innerHTML = "Save";
        document.getElementById("testCaseListEditCol").style.visibility = "visible";
    }
    else{
        document.getElementById("editTestCasesList").innerHTML = "Edit";
        document.getElementById("testCaseListEditCol").style.visibility = "collapse";
        writeTestListToFile();
    }
}
function editConfiguration() {
    if (document.getElementById("editConfiguration").innerHTML == "Edit"){
        document.getElementById("editConfiguration").innerHTML = "Save";
    }
    else{
        document.getElementById("editConfiguration").innerHTML = "Edit";
        createConfigurationFile()
    }
}
function writeTestListToFile() {
    var fso = new ActiveXObject("Scripting.FileSystemObject");
    if(fso.fileExists("C:\\TestFile.csv")){fso.DeleteFile("C:\\TestFile.csv");}

    var newFile = fso.OpenTextFile("C:\\TestFile.csv", 8, true);
    var table = document.getElementById("testCasesList");
    for (var r = 1; r < table.rows.length; r++){
        newFile.WriteLine("Test Case " + r + "," + table.rows[r].cells[1].innerHTML);
	}
    newFile.close();
    fso.close;
}
function loadOptionsFromFile(id, filePath, colLabel){
    var selectList = document.getElementById(id);
    var fso = new ActiveXObject("Scripting.FileSystemObject");
    var fileToRead = fso.OpenTextFile(filePath, 1, false);
    while (!fileToRead.AtEndOfStream) {
        var tempLine = fileToRead.ReadLine();
        var splitLine = tempLine.split(":");
        for (var i=0; i < splitLine.length; i++){
            if(splitLine[i] == colLabel){
                var colIndex = i;
                break;
            }
        }
        var option = document.createElement("option");
        option.text = splitLine[colIndex];
        selectList.add(option);
    }
    fileToRead.close();
    fso.close;

}
function createTestScriptFile(testScriptFileName, testFlow){
    var fso = new ActiveXObject("Scripting.FileSystemObject");
    var testScriptFileMerged = "C:\\vmittal\\Project\\SelfLearning\\GitHub\\automation_project\\test\\" + testScriptFileName;
    if(fso.fileExists(testScriptFileMerged)){fso.DeleteFile(testScriptFileMerged);}

    var newFile = fso.OpenTextFile(testScriptFileMerged, 8, true);
    newFile.writeLine("var lob = 'PA';");
    newFile.writeLine("var fileName = '" + testScriptFileName + "';");

    var scriptFile = fso.OpenTextFile("C:\\vmittal\\Project\\SelfLearning\\GitHub\\automation_project\\automated_components\\selenium_components\\before_each_test.js", 1, false);
    var fileCopyContent = scriptFile.ReadAll();
    scriptFile.close();
    newFile.writeLine(fileCopyContent);

    var splitTestFlow = testFlow.split("--");
    for(var i=0; i < splitTestFlow.length -1; i++){
        if (splitTestFlow[i] != "") {
            var testScript = getScriptFileName(splitTestFlow[i]);
            var scriptFile = fso.OpenTextFile("C:\\vmittal\\Project\\SelfLearning\\GitHub\\automation_project\\automated_components\\selenium_components\\" + testScript, 1, false);
            var fileCopyContent = scriptFile.ReadAll();
            scriptFile.close();
            newFile.writeLine(fileCopyContent);
        }
    }

    var scriptFile = fso.OpenTextFile("C:\\vmittal\\Project\\SelfLearning\\GitHub\\automation_project\\automated_components\\selenium_components\\after_each_test.js", 1, false);
    var fileCopyContent = scriptFile.ReadAll();
    scriptFile.close();
    newFile.writeLine("});");
    newFile.writeLine(fileCopyContent);
    newFile.close();
    fso.close;

}
function getScriptFileName(transactionType){
    var ofs = new ActiveXObject("Scripting.FileSystemObject");
    var fileToRead = ofs.OpenTextFile("C:\\vmittal\\Project\\SelfLearning\\GitHub\\automation_project\\automated_components\\selenium_components.txt", 1, false);
    while (!fileToRead.AtEndOfStream) {
        var tempLine = fileToRead.ReadLine();
        var splitLine = tempLine.split(":");
        if (transactionType.indexOf(splitLine[0]) >= 0){
            var scriptName=  splitLine[1];
            return scriptName;
            break;
        }
    }
    fileToRead.close();
    ofs.close;
}
function configureBuild(){
    var configuration = {
        testDirectory: "",
        upgradeBuildBranch: "",
        newBuildZipPath: "",
        upgradeDBServer: "",
        newDbName: "",
        patchBuildZipPath: ""
    }
    var fso = new ActiveXObject("Scripting.FileSystemObject");
    if(fso.fileExists("C:\\Configuration.txt")){
        var configFile= fso.OpenTextFile("C:\\Configuration.txt", 1, false)
        while(!configFile.AtEndOfStream) {
            var splitLine= configFile.ReadLine().split("::");
            configuration[splitLine[0]] = splitLine[1].replace("\\\\", "\\");
        }
        configFile.Close();
    }
    fso.close;
    runConfig(configuration);
}
function runConfig(configuration){
    var testDirectory, buildZipPath, dbName, dbServer, buildBranch, buildDir, patchPath;
    var toDo = "";
	testDirectory = (configuration.testDirectory + "\\").replace("\\\\","\\");
	buildZipPath = configuration.newBuildZipPath.replace("\\\\","\\")
	dbName = configuration.newDbName.replace("\\\\","\\")
	dbServer = configuration.upgradeDBServer.replace("\\\\","\\")
	buildBranch = configuration.upgradeBuildBranch
	patchPath = configuration.patchBuildZipPath.replace("\\\\","\\");
    document.dbExists = false;
    if(verifyConfig(testDirectory, dbName, dbServer)){
        if (confirm("Setup patch build??")){
            skm_LockScreen('LockOn');
            copyBuild(buildZipPath, testDirectory);
            document.buildDir = unzipBuild(buildZipPath, testDirectory);
            if(!document.dbExists){createDB(dbName, dbServer);}
            updateDBConfig(dbServer, dbName, buildBranch, document.buildDir);
            var buildStatus = true;
            if(buildBranch != "granite" && patchPath != ""){applyPatch(buildBranch, document.buildDir, patchPath, buildStatus);}
            updateConfig(buildBranch, document.buildDir);
            dropDB(buildBranch, document.buildDir);
            skm_LockScreen('LockOff');
        }
    }
}
function verifyConfig(testDirectory, dbName, dbServer){
    document.getElementById("verifyConfigurationLabel").style.display = "inline";
    var fso = new ActiveXObject("Scripting.FileSystemObject");
	if(!fso.FolderExists(testDirectory)){
    	if(confirm(testDirectory + " doesn't exists. Click 'Ok' to create it!")){
    		var a = fso.CreateFolder(testDirectory);
    		return true;
		}
		else{return false;}
	}
	fso.close;

    var connection = new ActiveXObject("ADODB.Connection") ;
    var connectionstring="Provider=SQLOLEDB;Data Source=" + dbServer + ";UID=sa;PASSWORD=Gw_123";
    connection.Open(connectionstring);
    var rs = new ActiveXObject("ADODB.Recordset");
    rs.Open("SELECT COUNT(NAME) as COUNT FROM SYS.DATABASES WHERE NAME= '"  + dbName + "'", connection);

	if(rs("COUNT").value > 0) {
        if (!confirm(dbName + " database already exists. Click 'Ok' to continue!")) {
            document.getElementById("verifyConfigurationLabel").style.display = "none";
            return false;
        }
        else{
        	document.dbExists = true;
            document.getElementById("verifyConfigurationLabel").style.display = "none";
            return true;
		}
    }
    else{
        document.getElementById("verifyConfigurationLabel").style.display = "none";
        return true;
	}
    rs.close();
    connection.close;
}
//*********************************Tests**************************
function titleVersionCheck(){
    var wsh = new ActiveXObject("WScript.Shell");
    var output = wsh.exec("node C:\\vmittal\\Self_Learning\\Demo-Project\\automation_project\\test_files\\title_test.js");
    wsh.close();
    var toPrint = output.StdOut.ReadAll();
    document.getElementById("spnTitleVersionDetail").innerText = 'Title:    ' + toPrint;
}
function createSubmissionTest(){
    var wsh = new ActiveXObject("WScript.Shell");
    var output = wsh.exec("node C:\\vmittal\\Self_Learning\\Demo-Project\\automation_project\\test_files\\create_submission_test.js");
    wsh.close();
    var toPrint = output.StdOut.ReadAll();
    document.getElementById("spnPolicyNumber").innerText = 'Policy number:   ' + toPrint;
}
function importSampleDataTest(){
    var wsh = new ActiveXObject("WScript.Shell");
    var output = wsh.exec("node C:\\vmittal\\Self_Learning\\Demo-Project\\automation_project\\test_files\\import_sample_data_test.js");
    wsh.close();
    var toPrint = output.StdOut.ReadAll();
    alert(toPrint);
    document.getElementById("spnImportSampleData").innerText = 'Import Status:   ' + toPrint;
}
function runTests() {
    var wsh = new ActiveXObject("WScript.Shell");
    wsh.run("C:\\vmittal\\Project\\SelfLearning\\GitHub\\automation_project\\test.bat");
    wsh.close();
}
