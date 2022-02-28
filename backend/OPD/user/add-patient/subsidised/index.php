<?php
/**
 * Here we'll get data to add subsidised patient in OPD
 *
 */
session_start(); //start the session to use session variables
//include necessary files
require_once "../../../common.php";
require_once "../../../commonFunctions.php";
require_once "../../../database.php";
$obj = new query_();


/**
 * Insert data to patient arrival info table which contains arrival info and fee as 0 of patient.
 */
function insertPatientArrivalInfo($obj,$patinetId,$fee,$arrivalDate){    
    $queryToAddData = $obj->insertData(
        TABLE_PATIENT_ARRIVAL_INFO,
        array(PATIENT_ID,'amount_paid',ARRIVAL_DATE)
    );
    // echo $queryToAddData."\n";
    $valuesToAddData = array($patinetId,$fee,$arrivalDate);
    // print_r($valuesToAddData);
    $result = $obj->executeQueryInsertData($queryToAddData,$valuesToAddData);
    return $result;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {//Get data only is request_method is post
    $data = json_decode(file_get_contents('php://input'));
}
// {
// 	"patient_id":"12121",
// 	"revisiting_date":"2021-11-19",
// 	"fee":"0"
// }
//  if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] == true) {
    $patientData = sanatizeInputData($data);
    
    $resultInsertPatientArrivalInfo = insertPatientArrivalInfo($obj,$patientData[PATIENT_ID]
                        ,$patientData[FEE],$patientData[REVISITING_DATE]);
    if($resultInsertPatientArrivalInfo){
        $status = array("status"=>true);
    
    }else{
        $status = array("status"=>false,"reason"=>"Some Internal Error");
    }                         
//}else{

//}
header('Content-type: application/json');
echo json_encode( $status );

?>