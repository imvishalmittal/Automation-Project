var d = new Date();
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
		buildZipPath = document.getElementById("newBuildZipPath").value
		dbName = document.getElementById("newDbName").value
		dbServer = document.getElementById("upgradeDBServer").value
		dbServer = dbServer.replace("\\\\","\\")
		buildBranch = document.getElementById("upgradeBuildBranch").value
		patchPath = document.getElementById("patchBuildZipPath").value
	}
	if (confirm("Setup patch build??")){
		skm_LockScreen('LockOn');	
		copyBuild(buildZipPath, testDirectory);
		var buildDir = unzipBuild(buildZipPath, testDirectory);			
		createDB(dbName, dbServer);
		updateDBConfig(dbServer, dbName, buildBranch, buildDir);
		var buildStatus = true;
		applyPatch(buildBranch, buildDir, patchPath, buildStatus);
		updateConfig(buildBranch, buildDir);
		dropDB(buildBranch, buildDir);
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
	var zipFileName = fso.GetFileName(buildZipPath)
	if(zipFileName == ""){zipFileName = prompt("Please provide build zip filename to be unzipped!!");}
	var cmdLine = "7z x -o" + testDirectory + zipFileName.replace(".zip", "") + " " + testDirectory + zipFileName;	
	document.getElementById("imgUpgunzBuild").style.display = "inline";
	var wsh = new ActiveXObject("WScript.Shell");
	wsh.Run(cmdLine, 1, true);
	var buildDir = testDirectory + zipFileName.replace(".zip", "") + "\\"
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
	var zipFileName = fso.GetFileName(patchPath)

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
	cmdLineDevStart = buildDir + "\\bin\\gwpc.bat dev-start"
    	
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
