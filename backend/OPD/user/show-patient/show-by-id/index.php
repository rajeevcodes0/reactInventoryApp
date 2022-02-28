<?php
session_start(); //start the session to use session variables
//include necessary files
require_once "../../../common.php";
require_once "../../../commonFunctions.php";
require_once "../../../database.php";
$obj = new query_();
/**
 * Return patient data based on received patient_id;
 * 
 */

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = (array) json_decode(file_get_contents('php://input'));
}

function getPatientInfo($obj,$patientId){
    $queryToGetData = $obj->getData(
        TABLE_PATIENT_INFO,
        '*',
        array(PATIENT_ID)   
    );
    // echo $queryToGetData; 
    $result = $obj->executeQueryGetData($queryToGetData,array($patientId));    
    if($result){
        return $result[0];
    }else{
        return false;
    }
}



//  if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] == true) {

    $patientId = sanatizeInputData($data);
    $patientInfo = getPatientInfo($obj,$patientId[PATIENT_ID]);
    if($patientInfo){
        $status = $patientInfo;
    }else{
        $status = array("status"=>false,"reason"=>"ID not exist");
    }

// }else{
//     $status = array("status"=>false,"reason"=>"not_logged_in");  
// }



header('Content-type: application/json');
echo json_encode( $status );
?>