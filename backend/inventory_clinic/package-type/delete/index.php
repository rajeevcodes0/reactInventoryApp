<?php
// header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
header("Access-Control-Allow-Origin: *");
// header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 86400');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
      
session_start();
require_once '../../database.php';
require_once '../../commonFunctions.php';
require_once '../../common.php';
date_default_timezone_set("Asia/Kolkata");
$obj= new query_();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = (array)json_decode(file_get_contents('php://input'));
}

// if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] == true) {
    $values = sanatizeInputData($data);    
    // print_r($values);
    $tableName = globalVars::$package_types_table;
    
    $query = $obj->deleteData(
        $tableName,
        array(globalVars::$PACKAGE_TYPE)
    );
    $con = $obj->connect();
    $stmt = $con->prepare($query);
    $stmt->bind_param("s", $values[globalVars::$PACKAGE_TYPE]);
    $result = $stmt->execute();
    if($result){
        $statusReport = array("status"=>true);
    }else{
        $statusReport = array("status"=>false,"reason"=>"internal_server_error");
    }
    
    header('Content-type: application/json');
    echo json_encode( $statusReport );

?>