<?php
session_start(); //start the session to use session variables
//include necessary files
require_once "../../../common.php";
require_once "../../../commonFunctions.php";
require_once "../../../database.php";
$obj = new query_();
/**
 * Return all patient data based on received first_name, last_name and address;
 * 
 */

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = (array) json_decode(file_get_contents('php://input'));
}

function getAllPatientInfo($obj,$receivedNameAddress){//receivedNameAddress contains first_name, last_name & address
    $firstName = $receivedNameAddress[FIRST_NAME];
    $lastName  = $receivedNameAddress[LAST_NAME];
    $address   = $receivedNameAddress[ADDRESS];
    $queryToGetData = $obj->getData(
        TABLE_PATIENT_INFO,
        '*',
        array(FIRST_NAME,LAST_NAME,ADDRESS)   
    );
    // echo $queryToGetData;
    $valuesToBind = array($firstName,$lastName,$address); 
    $result = $obj->executeQueryGetData($queryToGetData,$valuesToBind);    
    if($result){
        return $result;
    }else{
        return false;
    }
}



//  if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] == true) {

    $receivedNameAddress = sanatizeInputData($data);
    $patientInfo = getAllPatientInfo($obj,$receivedNameAddress);
    if($patientInfo){
        $status = $patientInfo;
    }else{
        $status = array("status"=>false,"reason"=>"No Patient exist");
    }

// }else{
//     $status = array("status"=>false,"reason"=>"not_logged_in");  
// }



header('Content-type: application/json');
echo json_encode( $status );
?>