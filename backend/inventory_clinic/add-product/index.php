<?php
// // header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
// header("Access-Control-Allow-Origin: *");
// // header('Access-Control-Allow-Credentials: true');
// header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
// header('Access-Control-Max-Age: 86400');
// header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
      
// session_start();
// require_once '../database.php';
// require_once '../commonFunctions.php';
// require_once '../common.php';
// $obj= new query_();
// if ($_SERVER["REQUEST_METHOD"] == "POST") {
//     $data = json_decode(file_get_contents('php://input'));
// }
// //access data: We'll get JSON of two data i.e. medicine name and category
// $tableName = globalVars::$medicine_list_table;
// $queriesToAddData = [];
// $valuesForPrepareStmt = [];
// $status=false;
// $executionResult = false;
// $medinceAlreadyExist = false;
// $query = $obj->insertData(
//         $tableName,
//         array(globalVars::$PRODUCT_NAME,globalVars::$CATEGORY)
// );
// $con = $obj->connect();
// $stmt = $con->prepare($query);
// foreach ($data as $object){        
//     $values = sanatizeInputData(get_object_vars($object));
//     // print_r($values);
//     $Med_ID = getMedicineID($obj,
//         globalVars::$medicine_list_table,
//         globalVars::$PRODUCT_NAME,
//         $values[globalVars::$PRODUCT_NAME
//     ]);
//     if(!$Med_ID){//If not filled already (Unique medicine enter)
//         $stmt->bind_param("ss", $values[globalVars::$PRODUCT_NAME],$values[globalVars::$CATEGORY]);
//         $executionResult=$stmt->execute();        
//         if(!$executionResult){
//             break;
//         }else{
//             $product_name =  $values[globalVars::$PRODUCT_NAME];
//             $error_message = "$product_name Added | ";
//         }
//     }else{
//         $medinceAlreadyExist = true;
//     }
// }
// $currTimeStamp = date('Y/m/d h:i:s');
            
// if($executionResult){
//     $statusReport = array("status"=>true);
//     $error_message = $currTimeStamp.$error_message."\n";    
// }else{
//     $statusReport = array("status"=>false,"reason"=>"Internal_server_error");
//     $error_message = "$currTimeStamp |$con->error |Error in stmt execution ";
//     if($medinceAlreadyExist){
//         $statusReport = array("status"=>false,"reason"=>"Medicine already exist");
//     }
// }
// error_log($error_message, 3, globalVars::$log_file);
// header('Content-type: application/json');
// echo json_encode( $statusReport );
?>