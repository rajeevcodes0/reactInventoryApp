<?php
/**
 * Here we'll get data to add new patient in OPD
 *
 */
session_start(); //start the session to use session variables
//include necessary files
require_once "../../../common.php";
require_once "../../../commonFunctions.php";
require_once "../../../database.php";
$obj = new query_();

/**
 * Insert data to patient inforamtion table which contains only details about patient.
 * */
function insertPatientInfo($obj,$patientData){
    $patientInfoData = array(
        PATIENT_ID        => $patientData[PATIENT_ID],
        FIRST_NAME        => $patientData[FIRST_NAME],
        LAST_NAME         => $patientData[LAST_NAME],
        ADDRESS           => $patientData[ADDRESS],
        AGE               => $patientData[AGE],
        GENDER            => $patientData[GENDER],
        CONTACT_NUMBER    => $patientData[CONTACT_NUMBER]
    );
    $queryToAddData = $obj->insertData(
        TABLE_PATIENT_INFO,
        array_keys($patientInfoData)
    );
    // echo $queryToAddData."\n";
    $valuesToAddData = array_values($patientInfoData);
    // print_r($valuesToAddData);
    $result = $obj->executeQueryInsertData($queryToAddData,$valuesToAddData);
    return $result;

}
/**
 * Insert data to patient arrival info table which contains arrival info and fee of patient.
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
//  if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] == true) {
    $patientData = sanatizeInputData($data);
    $resultInsertPatientInfo = insertPatientInfo($obj,$patientData);
    if($resultInsertPatientInfo){
        $resultInsertPatientArrivalInfo = insertPatientArrivalInfo($obj,$patientData[PATIENT_ID]
                            ,$patientData[FEE],$patientData[ARRIVAL_DATE]);
        if($resultInsertPatientArrivalInfo){
            $status = array("status"=>true);
        }
    }else{
        $status = array("status"=>false,"reason"=>"duplicate_patient_id");
    }                         
//}else{

//}
header('Content-type: application/json');
echo json_encode( $status );

?>