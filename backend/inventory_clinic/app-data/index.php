<?php
// header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
header("Access-Control-Allow-Origin: *");
// header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 86400');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
      
session_start();
require_once '../database.php';
require_once '../commonFunctions.php';
require_once '../common.php';
/**
 * Response: 
 * { outstamding_amount:{ medical_store: amount, dispensary: amount},
 *   medicine_name:[{name:Medicine_name,id:medicine_id}],               Updated: [{name:Medicine_name,id:medicine_id,}],
 *   medicine_type:["carton","box"],
 *   inventory_data:[{}],
 *         
 */
date_default_timezone_set("Asia/Kolkata");
$obj= new query_();
$queriesToAddData;
$valuesForPrepareStmt;
$bundleArrayToSend=[];

//  if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] == true) {
    //1. Calculate Outstanding_amount
    //1.1. Calculate medicine_given_amount
    $receive_template_arr = globalVars::$SUM_TOTAL.','.globalVars::$SELLING_TO;
    $queriesToAddData = $obj->getData(globalVars::$transactionTableName,
                                        "sum(".globalVars::$SUM_TOTAL.") as total_price",
                                        array(globalVars::$SELLING_TO)
                        );
    $valuesForPrepareStmt=globalVars::$SUPPLIER1;
    $amountMedicalStore = getRow($obj,globalVars::$transactionTableName,$queriesToAddData,$valuesForPrepareStmt);
    // print_r($amountMedicalStore);
    $queriesToAddData = $obj->getData(globalVars::$transactionTableName,
                                        "sum(".globalVars::$SUM_TOTAL.") as total_price",
                                        array(globalVars::$SELLING_TO)
                        );
    $valuesForPrepareStmt=globalVars::$SUPPLIER2;
    $amountDispensary = getRow($obj,globalVars::$transactionTableName,$queriesToAddData,$valuesForPrepareStmt);
    // print_r($amountDispensary);
    /**Get received Payment  */
    
    $queriesToAddData = $obj->getData(globalVars::$paymentTransactionTable,
                                        "sum(".globalVars::$RECEIVE_AMOUNT.") as receive_amount",
                                        array(globalVars::$MONEY_RECEIVE_FROM)
                        );
    $valuesForPrepareStmt=globalVars::$SUPPLIER1;
    $amountMedicalStoreReceived = getRow($obj,globalVars::$paymentTransactionTable,$queriesToAddData,$valuesForPrepareStmt);
    // print_r($amountMedicalStore);
    $queriesToAddData = $obj->getData(globalVars::$paymentTransactionTable,
                                        "sum(".globalVars::$RECEIVE_AMOUNT.") as receive_amount",
                                        array(globalVars::$MONEY_RECEIVE_FROM)
                        );
    $valuesForPrepareStmt=globalVars::$SUPPLIER2;
    $amountDispensaryReceived = getRow($obj,globalVars::$paymentTransactionTable,$queriesToAddData,$valuesForPrepareStmt);
    // echo $amountMedicalStore["total_price"] ." am paymnet Medical ". $amountMedicalStoreReceived["receive_amount"]." rece\n";
    // echo $amountDispensary["total_price"]  ." -".  $amountDispensaryReceived["receive_amount"]."\n";
    $amountMedicalStore["total_price"] = $amountMedicalStore["total_price"] - $amountMedicalStoreReceived["receive_amount"];
    $amountDispensary["total_price"] = $amountDispensary["total_price"] - $amountDispensaryReceived["receive_amount"];
    
    if(!$amountMedicalStore["total_price"]){
        $amountMedicalStore["total_price"] = 0;
    }
    if(!$amountDispensary["total_price"]){
        $amountDispensary["total_price"] = 0;
    }
    // echo $amountMedicalStore["total_price"];
    // echo $amountDispensary["total_price"]  ;
    $bundleArrayToSend["outstanding_amount"]=array(
        globalVars::$SUPPLIER1=>$amountMedicalStore["total_price"],
        globalVars::$SUPPLIER2=>$amountDispensary["total_price"]
    );
    /**2. Medicine Names: get all medicine name with id from product list */
    $queriesToAddData = $obj->getData(globalVars::$medicine_list_table,
                            globalVars::$PRODUCT_NAME.",".globalVars::$PRODUCT_ID.",".globalVars::$DISCOUNT
    );
    $con=$obj->connect();
    $result=$con->query($queriesToAddData);    
    $medicine_names = array();
    while($rows = $result->fetch_assoc()){
        $medicine_names[]=$rows;
    }
    $bundleArrayToSend["medicine_names"]=$medicine_names;
    // print_r(json_encode($bundleArrayToSend));
    /**3. Invetory Data: Get all stock available items from store_items*/
    $columsToGet = globalVars::$PRODUCT_ID.", "
                        .globalVars::$PRODUCT_NAME.", "
                        .globalVars::$QUANTITY.", "
                        .globalVars::$MRP.", "
                        .globalVars::$PACKAGE_TYPE.", "
                        .globalVars::$IS_FREE;
    $queriesToAddData = $obj->getData(globalVars::$store_items,
                            $columsToGet
    );
    // echo $queriesToAddData."\n";
    $result = $con->query($queriesToAddData) or die($con->error);   
    $inventoryData = array();
    while($rows = $result->fetch_assoc()){
        $inventoryData[]=$rows;
    }
    
    // print_r($inventoryData);
    $bundleArrayToSend["inventory_data"]=$inventoryData;
    // print_r(json_encode($bundleArrayToSend));
    
    
     /**4. Package types  */
    $queriesToAddData = $obj->getData(globalVars::$package_types_table,
                          '*'
    );
    $con=$obj->connect();
    $result=$con->query($queriesToAddData);    
    $product_types = [];
    while($rows = $result->fetch_assoc()){
        $product_types[]=$rows[globalVars::$PACKAGE_TYPE];
    }
    $bundleArrayToSend["package_types"]=array_values($product_types);
    
    header('Content-type: application/json');
    echo json_encode( $bundleArrayToSend );
//  }else{
//     $error_message = "$currTimeStamp |User:$clientIP |Statement Execution Failed User Login\n";
//     error_log($error_message, 3, $log_file);
// }

?>