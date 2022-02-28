<?php
session_start(); //start the session to use session variables
//include necessary files
require_once "../../../common.php";
require_once "../../../commonFunctions.php";
require_once "../../../database.php";
$obj = new query_();
/**
 * Return all patient data based on received address;
 * 
 */

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = (array) json_decode(file_get_contents('php://input'));
}

function getAllPatientInfo($obj,$receivedAddress){
    $queryToGetData = $obj->getData(
        TABLE_PATIENT_INFO,
        '*',
        array(ADDRESS)   
    );
    // echo $queryToGetData; 
    $result = $obj->executeQueryGetData($queryToGetData,array($receivedAddress));    
    if($result){
        return $result;
    }else{
        return false;
    }
}



//  if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] == true) {

    $receivedAddress = sanatizeInputData($data);
    $patientInfo = getAllPatientInfo($obj,$receivedAddress[ADDRESS]);
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