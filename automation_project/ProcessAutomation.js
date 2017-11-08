var d = new Date();
var testFlow = "";
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
function runConfig(id){
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
}
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
function startServer(buildDir) {
	var wsh, cmdLineDevStart;
	if (buildDir == undefined){var buildDir = prompt("Please provide build directory path:\n(like: C:\\test\\PolicyCenter807\\PolicyCenter\\)");}	
	cmdLineDevStart = buildDir + "\\bin\\gwpc.bat dev-start";
    	
	wsh = new ActiveXObject("WScript.Shell");	
	document.getElementById("imgUpgStrtSrvr").style.display = "inline";
	wsh.Run(cmdLineDevStart);//, 1, true);
	//wsh.close;
	if(pingServer('8180')){document.getElementById("imgUpgStrtSrvr").src = "resources/check-mark.gif";}	
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
function pingServer(port) {
	for (var i = 0 ; i <= 15 ; i++) {
		var wsh = new ActiveXObject("WScript.Shell");
		var status = wsh.exec("netstat -aon");// + port);
		wsh.close;

		if (status.StdOut.ReadAll().indexOf("0.0.0.0:" + port) >=0){
			return true;
			break;}
		//else{alert("Server not yet started at port - " + port + ". Time elapsed: " + i + "mins.")}
		sleep(60000);
	}
}
function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}
function titleVersionCheck(){
	var wsh = new ActiveXObject("WScript.Shell");
	var output = wsh.exec("node C:\\vmittal\\Self_Learning\\Demo-Project\\automation_project\\test_files\\title_test.js");
	wsh.close;
	var toPrint = output.StdOut.ReadAll();
	document.getElementById("spnTitleVersionDetail").innerText = 'Title:    ' + toPrint;
}
function createSubmissionTest(){
	var wsh = new ActiveXObject("WScript.Shell");
	var output = wsh.exec("node C:\\vmittal\\Self_Learning\\Demo-Project\\automation_project\\test_files\\create_submission_test.js");
	wsh.close;
	var toPrint = output.StdOut.ReadAll();
	document.getElementById("spnPolicyNumber").innerText = 'Policy number:   ' + toPrint;
}
function importSampleDataTest(){
	var wsh = new ActiveXObject("WScript.Shell");
	var output = wsh.exec("node C:\\vmittal\\Self_Learning\\Demo-Project\\automation_project\\test_files\\import_sample_data_test.js");
	wsh.close;
	var toPrint = output.StdOut.ReadAll();
	alert(toPrint);
	document.getElementById("spnImportSampleData").innerText = 'Import Status:   ' + toPrint;
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
    if(fso.fileExists("C:\\Configuration.csv")){fso.DeleteFile("C:\\Configuration.csv");}
    newFile = fso.OpenTextFile("C:\\Configuration.csv", 8, true);
    newFile.WriteLine("testDirectory," + testDirectory);
    newFile.WriteLine("newBuildZipPath," + buildZipPath);
    newFile.WriteLine("newDbName," + dbName);
    newFile.WriteLine("upgradeDBServer," + dbServer);
    newFile.WriteLine("upgradeBuildBranch," + buildBranch);
    newFile.WriteLine("patchBuildZipPath," + patchPath);
    newFile.close();
    fso.close;
}
function loadConfiguration(){
    var fso = new ActiveXObject("Scripting.FileSystemObject");
    if(fso.fileExists("C:\\Configuration.csv")){
    	var configFile= fso.OpenTextFile("C:\\Configuration.csv", 1, false)
        while(!configFile.AtEndOfStream) {
            var splitLine= configFile.ReadLine().split(",");
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
	document.getElementById("buttonSet").style.visibility = "hidden";
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
	else if(selection == "Policy Issuance"){
    	document.getElementById(inputParamId).value = "Account#";
        document.getElementById(outputParamId).value = "Policy#"
	}
	else if(selection == "Policy Change"){
        document.getElementById(inputParamId).value = "Policy*#; AddDays*#"
        document.getElementById(outputParamId).value = "Submission#"
        if(x!=2){
        	document.getElementById(inputParamId).value = "AddDays*#";
            document.getElementById(inputParamId).style.backgroundColor = 'white';
            document.getElementById(inputParamId).readOnly = false;
        }
	}

	if(x!=2 && selection !="Policy Change"){document.getElementById(inputParamId).value = "";}
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
        for (var i = 1 ; i < toDeleteRowsCount1 ; i++){
            toDeleteFromTable1.deleteRow(i);
        }
        var toDeleteRowsCount2 = document.getElementById("testCasesList").rows.length
        var toDeleteFromTable2 = document.getElementById("testCasesList");
        for (var j = 1 ; j < toDeleteRowsCount2 ; j++){
            toDeleteFromTable2.deleteRow(j);
        }
        document.getElementById("testCreatorTable").style.visibility = "hidden";
        document.getElementById("addToListButton").style.visibility = "hidden";
        document.getElementById("buttonSet").style.visibility = "visible";
        alert("Test added to list!!!");
    }
    else{
        alert("One or More missing transactions!!!");
    }
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
        while (!existingFile.AtEndOfStream) {
            var lineContent = existingFile.ReadLine();
            var splitLineContent = lineContent.split(",");
            var row = table.insertRow();
            row.insertCell(0).innerHTML = splitLineContent[0];
            row.insertCell(1).innerHTML = splitLineContent[1];
            row.insertCell(2).innerHTML = "<button id='remove' onClick='addRemoveTransactionRow(this.id, \"" + (document.getElementById("testCasesList").rows.length - 1) + "\", \"testCasesList\")'>-</button>"
        }
        existingFile.close();
    }
    fso.close();
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
function navigateToPage(title) {

}