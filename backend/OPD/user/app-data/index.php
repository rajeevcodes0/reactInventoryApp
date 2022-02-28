<?php
session_start(); //start the session to use session variables
//include necessary files
require_once "../../common.php";
require_once "../../commonFunctions.php";
require_once "../../database.php";
$obj = new query_();
// Response:
// {
// 	"fee":"200",
// 	"no-of-days":"10",
// 	"addresses":["",""]
// }
/**Fucntion return an array of fee and no_of_days */
function getFeeAndDays($obj){
    $queryToGetData = $obj->getData(
        TABLE_FEE_AND_DAYS,
        '*'
    );
    $result = $obj->executeQueryGetData($queryToGetData,'');
    if($result){
        $fee=$result[0][FEE];
        $NO_OF_DAYS = $result[0][NO_OF_DAYS];
    }
    return array("fee"=>$fee,"no_of_days"=>$NO_OF_DAYS);
}
/**Funciton return addresses */
function getAddress($obj){
    $queryToGetData = $obj->getData(
        TABLE_ADDRESSES,
        ADDRESS
    );
    $result = $obj->executeQueryGetData($queryToGetData,'');
    $addresses = [];
    for ($i=0; $i < count($result); $i++) { 
        # code...
        $addresses[]=(string)($result[$i]["address"]);
        
    }
    return $addresses;
}
//  if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] == true) {
        $feeAndDays = getFeeAndDays($obj);
        $feeAndDays["addresses"]= getAddress($obj);
        $status =$feeAndDays;
// }else{
//     $status = array("status"=>false,"reason"=>"not_logged_in");  
// }
header('Content-type: application/json');
echo json_encode( $status );
?>