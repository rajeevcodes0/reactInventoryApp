<?php
session_start(); //start the session to use session variables
//include necessary files
require_once "../../common.php";
require_once "../../commonFunctions.php";
require_once "../../database.php";
$obj = new query_();
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = (array) json_decode(file_get_contents('php://input'));
}

$data = sanatizeInputData($data);
function updateFields($obj,$updateFee,$updateNoOfDays){
    $query = $obj->updateData(
        TABLE_FEE_AND_DAYS,
        array(FEE,NO_OF_DAYS),
        "s_no"
    );
    $valuesToBind = array($updateFee,$updateNoOfDays,1);
    $affectedRows = $obj->executeQueryUpdateData($query,$valuesToBind);
    if($affectedRows>=1){
        return true;
    }else{
        return false;
    }
    
}


//  if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] == true) {
    $result = updateFields($obj,$data[FEE],$data[NO_OF_DAYS]);
    if($result){
        $status = array("status"=>true);   
    }else{
        $status = array("status"=>false,"reason"=>"duplicate");  
    }
// }else{
//     $status = array("status"=>false,"reason"=>"not_logged_in");  
// }
header('Content-type: application/json');
echo json_encode( $status );
?>