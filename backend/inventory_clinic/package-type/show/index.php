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

// if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] == true) {
 /**5. Package types SHOW */
 $queriesToGetData = $obj->getData(globalVars::$package_types_table,
 '*'
);
$con=$obj->connect();
$result=$con->query($queriesToGetData);    
$product_types = [];
while($rows = $result->fetch_assoc()){
$product_types[]=$rows[globalVars::$PACKAGE_TYPE];
}

header('Content-type: application/json');
echo json_encode( $product_types );

//}
?>