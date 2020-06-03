<?php

/*
   function implementations for RESTful db operations to be used in conjunction with index.php.
   index.php will have knowledge of request type and whether it is for single record (document mode) or entire collection related to resource (collection mode)

   includes:
   	**[REQUESTTYPE: GET, DATAMODE: collection]
		getAllRecords(PDOobject, resourceString)->echo JSON
	**[REQUESTTYPE: GET, DATAMODE: document]
		getSingleRecord(PDOobject, resourceString, primaryKeyString, primaryKeyValueString)-> echo JSON
	**[REQUESTTYPE: POST]
		insertRecord(PDOobject, resourceString, dataAssociativeArray)
	**[REQUESTTYPE: PUT]
		updateRecord(PDOobject, resourceString, dataAssociativeArray, primaryKeyString, primaryKeyValueString)
	**[REQUESTTYPE: DELETE]
		deleteSingleRecord(PDOobject, resourceString, primaryKeyString, primaryKeyValueSTring)
	
 */

function getAllRecords($thePDO, $resource)
{
	$sql = "SELECT * from $resource";
	$statement = $thePDO->prepare($sql);
	$statement->execute();
	echo json_encode($statement->fetchAll(PDO::FETCH_ASSOC));	

}

function getSingleRecord($thePDO, $resource, $pk, $pkVal)
{
	$sql = "SELECT * FROM $resource WHERE $pk = '$pkVal'";
	$statement = $thePDO->prepare($sql);
	$statement->execute();
	echo json_encode($statement->fetchAll(PDO::FETCH_ASSOC));	
}


function insertRecord($thePDO, $resource, $dataArray)
{
	$sql = "";
	$colString = "";
	$valString = "";

	foreach(array_keys($dataArray) as $col)
	{
		//error_log(sprintf("%s => %s", $col, $dataArray[$column]));
		$colString .= sprintf("%s,", $col);
		$valString .= sprintf("%s,", ($dataArray[$col]));
	}
	$colString = substr($colString, 0, strlen($colString)-1);
	$valString = substr($valString, 0, strlen($valString)-1);

	$sql = sprintf("INSERT INTO %s (%s) VALUES (%s)", $resource, $colString, $valString);
	$statement = $thePDO->prepare($sql);
	$statement->execute();
}
function updateRecord($thePDO, $resource, $dataArray, $pk, $pkVal)
{
	$sql = "";
	$updateString = "";

	foreach(array_keys($dataArray) as $col)
	{
		$updateString .= sprintf("%s = %s,", $col, $dataArray[$col]);	
	}
	$updateString = substr($updateString, 0, strlen($updateString)-1);
	
	$sql = sprintf("UPDATE %s SET %s WHERE %s = %s", $resource, $updateString, $pk, $pkVal);
	$statement = $thePDO->prepare($sql);
	$statement->execute();
}


function deleteSingleRecord($thePDO, $resource, $pk, $pkVal)
{
	$sql = "DELETE FROM $resource WHERE $pk = '$pkVal'";
	$statement = $thePDO->prepare($sql);
	$statement->execute();
}


?>
