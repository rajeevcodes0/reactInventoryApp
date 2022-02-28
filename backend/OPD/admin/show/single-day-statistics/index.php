<?php
session_start(); //start the session to use session variables
//include necessary files
require_once "../../../common.php";
require_once "../../../commonFunctions.php";
require_once "../../../database.php";
$obj = new query_();
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = (array) json_decode(file_get_contents('php://input'));
}

$currentDate = sanatizeInputData($data);
/**We need to return total new, total subsidised patient and total sale for received date */
function getDataBasedOnDate($obj, $date){
    $queryToGetData = $obj->getData(
        TABLE_PATIENT_ARRIVAL_INFO,
        'amount_paid',
        array(ARRIVAL_DATE)
    );
    // echo $queryToGetData;
    $result = $obj->executeQueryGetData($queryToGetData,array($date));    
    if($result){
        return $result;
    }else{
        return false;
    }
}
//  if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] == true) {

    $dataOfPatients = getDataBasedOnDate($obj,$currentDate["current_date"]);
    // print_r($dataOfPatients);
    //if data present on given date in database prepare total new, total subsidised, total sale
    //login: If fee is 0-> subsidised, Greater than 0-> new , Sales = sum of all new
    if($dataOfPatients){
        $totalNew=0;
        $totalSubsidised=0;
        $totalSale = 0;
        for ($i=0; $i < count($dataOfPatients); $i++) { 
            $amount_paid= $dataOfPatients[$i]['amount_paid'];
            if($amount_paid==0){
                $totalNew++;
            }else if($amount_paid>0){
                $totalSubsidised++;
                $totalSale+=$amount_paid;
            }
        }
        // echo "\nTotal New : ".$totalNew;
        // echo "\nTotal Subsidised : ".$totalSubsidised;
        // echo "\nTotal  Sale : ".$totalSale;
        $arrayToSend["total_new"]=$totalNew;
        $arrayToSend["total_subsidised"]=$totalSubsidised;
        $arrayToSend["total_sale"]=$totalSale;
        $status=$arrayToSend;
    }else{
        $arrayToSend["total_new"]=0;
        $arrayToSend["total_subsidised"]=0;
        $arrayToSend["total_sale"]=0;
        $status=$arrayToSend;
    }
// }else{
//     $status = array("status"=>false,"reason"=>"not_logged_in");  
// }
header('Content-type: application/json');
echo json_encode( $status );
?>