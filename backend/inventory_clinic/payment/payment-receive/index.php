<?php
/**
 * PAYMENT RECEIVING ENTRY: CURRENTLY TWO ENTRIES: TYPE= MEDICAL/DISPENSARY
 */
// header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
header("Access-Control-Allow-Origin: *");
// header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 86400');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
      

session_start();
require_once '../../database.php';
require_once '../../common.php';
date_default_timezone_set("Asia/Kolkata");
$obj= new query_();
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents('php://input'));
}
$statusReport=array();

$currTimeStamp = date("Y/m/d h:i:s");
$transactionID = date("Ymdhis");
$queriesToAddData=[];
$valuesForPrepareStmt=[];
// if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] == true) {
    foreach ($data as $object){        
        $values = get_object_vars($object);    
        $paymentArr = array(
            globalVars::$TRANSACTION_NO=>$transactionID,
            globalVars::$RECEIVE_AMOUNT=>$values[globalVars::$RECEIVE_AMOUNT],
            globalVars::$TIMESTAMP=>$currTimeStamp,
            globalVars::$MONEY_RECEIVE_FROM=>$values[globalVars::$MONEY_RECEIVE_FROM],
            globalVars::$MONEY_RECEIVE_DATE=>$values[globalVars::$MONEY_RECEIVE_DATE]
        
        );
        $queriesToAddData[] = $obj->insertData(globalVars::$paymentTransactionTable,array_keys($paymentArr));
        $valuesForPrepareStmt[] = array_values($paymentArr);
        $executionResult = $obj->executeQueries($queriesToAddData,$valuesForPrepareStmt);
    if($executionResult){
        
        $statusReport = array("status"=>true);
    }else{
        $statusReport = array("status"=>false,"reason"=>"internal_server_error");
    }
 }
// }else{
//     $statusReport = array("status"=>false,"reason"=>"not_logged_in");  
// }
header('Content-type: application/json');
echo json_encode( $statusReport );
?>