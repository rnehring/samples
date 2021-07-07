<?php
	session_start();

	$DBServer = '10.10.9.9';
	$DBUser   = 'root';
	$DBPass   = '';
	$DBName   = 'dev_labels';
	$conn 		= new mysqli($DBServer, $DBUser, $DBPass, $DBName);
	
	# AJAX ROUTER:
	# PULL FUNCTION CALL FROM AJAX REQUEST
	# ---------------------------------------------------------------------------
		if($_POST['function'] == "addPart"){
			addPart();
		}
		if($_POST['function'] == "getSDR"){
			getSDR();
		}
		if($_POST['function'] == "getWall"){
			getWall();
		}
		if($_POST['function'] == "getCTSSizes"){
			getCTSSizes();
		}
		if($_POST['function'] == "getIPSSizes"){
			getIPSSizes();
		}
		if($_POST['function'] == "getFactor"){
			getFactor();
		}
	# ---------------------------------------------------------------------------
	# ---------------------------------------------------------------------------

	# HELPER FUNCTION:  ADDS PART TO DB
	function addPart(){
		global $conn;
		
		$addPartSQL="INSERT INTO polyvalve_part_details(Company, Part, Size, sdr, sdr_value, Material, Material_Code, Factor, CSA_Logo, Description_Not_Used) VALUES('PV', '" . $_POST['partnum'] . "','" . $_POST['size'] . "\"','" . $_POST['sdr'] . "','" . $_POST['sdrval'] . "','" . $_POST['material'] . "','" . $_POST['materialcode'] . "','" . $_POST['factor'] . "','"  . $_POST['csa'] . "','" . $_POST['description'] . "')";
		
		$addPart=$conn->query($addPartSQL);
		echo "success";
	}

	# HELPER FUNCTION: GET SDR VALUES
	function getSDR(){
		global $conn;
		$getSDRSql = "SELECT DISTINCT sdr FROM factors WHERE type = 'IPS' AND diameter = '" . $_POST['size'] . "'";
		$SDRs=$conn->query($getSDRSql);
		while($r = mysqli_fetch_assoc($SDRs)) {
			$sdrs[] = $r['sdr'];
		}
		echo json_encode($sdrs);
	}

	# HELPER FUNCTION:  GET WALL THICKNESS SIZES FOR CTS VALVES
	function getWall(){
		global $conn;
		$getWallSql = "SELECT DISTINCT wall FROM factors WHERE type='CTS' AND diameter = '" . $_POST['size'] . "'";
		$walls=$conn->query($getWallSql);
		while($r = mysqli_fetch_assoc($walls)) {
			$allwalls[] = $r['wall'];
		}
		echo json_encode($allwalls);
	}

	# HELPER FUNCTION:  GET CTS VALVE DIAMETERS
	function getCTSSizes(){
		global $conn;
		$getCTSSizeSQL = "SELECT DISTINCT diameter FROM factors WHERE type='CTS'";
		$ctsSizes=$conn->query($getCTSSizeSQL);
		while($r = mysqli_fetch_assoc($ctsSizes)) {
			$cts[] = $r['diameter'];
		}
		echo json_encode($cts);
	}

	# HELPER FUNCTION:  GET IPS VALVE DIAMETERS
	function getIPSSizes(){
		global $conn;
		$getIPSSizeSQL = "SELECT DISTINCT diameter FROM factors WHERE type='IPS'";
		$ipsSizes=$conn->query($getIPSSizeSQL);
		while($r = mysqli_fetch_assoc($ipsSizes)) {
			$ips[] = $r['diameter'];
		}
		echo json_encode($ips);
	}

	# HELPER FUNCTION:  CALCULATE FACTOR
	function getFactor(){
		global $conn;
		
		if($_POST['sdr'] == "SDR"){
			$factorSQL = "SELECT factor FROM factors WHERE diameter ='" . $_POST['size'] . "' AND type='IPS' AND sdr='" . $_POST['sdrval'] . "'";
		}
		else if($_POST['sdr'] == "Wall"){
			$factorSQL = "SELECT factor FROM factors WHERE diameter ='" . $_POST['size'] . "' AND type='CTS' AND wall='" . $_POST['sdrval'] . "'";
		}
		
		$factor=$conn->query($factorSQL);
		$r = mysqli_fetch_assoc($factor);
		echo $r['factor'];
	}

?>