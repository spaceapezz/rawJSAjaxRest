<?php
/*
Brian Reza Smith

main controller to provide RESTful interactions 
with mysql db.
	-initializes db connection
	-loads functions.php
	-parses requested url
	-uses switch case to call appropriate functions
	depending on parsed URI and http request type.
 */
	include("connect.php");
	include("functions.php");

	//determine http request type
	//and whether it is in regard to entire table
	//or single record

	$requestMethod = $_SERVER['REQUEST_METHOD'];
	$uriArray = explode('/', $_SERVER['REQUEST_URI']);
	if(count($uriArray) == 3)
	{
		$dataMode = "collection";
		$resource = $uriArray[1];
	}
	else
	{
		$dataMode = "document";
		$resource = $uriArray[1];
		$document = $uriArray[2];
	}

	
	$data = json_decode(file_get_contents('php://input'), true);
	switch($requestMethod){
		case "GET":
			if($dataMode == "collection")
			{
				getAllRecords($myPDO, $resource);
			}
			else
			{
				getSingleRecord($myPDO, $resource, "name", $document);
			}
			break;
		case "POST":
			if (preg_match("/'\s*'/", $data['name']) == 0)
			{
				$sql = "SELECT * from $resource WHERE name = " . $data['name'];
				$statement = $myPDO->prepare($sql);
				$statement->execute();
				$matchCount = $statement->rowCount();
				//if record doesnt exist, create a new entry in db
				if($matchCount == 0)
				{
					insertRecord($myPDO, $resource, $data);
				}
				//else if a single entry exists with same name, update it
				else if($matchCount == 1)
				{
					updateRecord($myPDO, $resource, $data, "name", $data["name"]);
				}
				else
				{
					error_log("error: attempting to post but not 0(create) or 1(update) entries in db");
				}
			}
			else
			{
				error_log("attempting to post with no primary key");
			}
			break;
		case "DELETE":
			$pk = array_keys($data)[0];
			$pkVal = $data[$pk];
			deleteSingleRecord($myPDO, $resource, $pk, $pkVal);
			break;
			
		default:
			getAll($myPDO, $resource);
	}


?>
