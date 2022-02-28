<?php
/**
 * This is the file where medicine inserting work will be done. 
 * Insert to store_log_insert table. Simultaneously perform addintion of quantity of medicine in store table. 
 * NOW there can be condition that MRP can be different even name and type are same.
 * So we need to maintain different records
 */
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
date_default_timezone_set("Asia/Kolkata");
$obj= new query_();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $dataReceived = (array)json_decode(file_get_contents('php://input'));
}
// if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] == true) {
    // echo "Welcome to the member's area, " . $_SESSION['username'] . "!";

// We need to calculate here MED_ID, TRANSACT_NO, TIMESTAMP
$currTimeStamp = date("Y/m/d h:i:s");
$transactionID = date("Ymdhis");
$data = $dataReceived["add_data"];
$sum_total = $dataReceived["sum_total"];
$status=true;
foreach ($data as $object){        
    $queriesToAddData = [];
    $valuesForPrepareStmt = [];
    $values = sanatizeInputData(get_object_vars($object));    
    // print_r($values);
    // $key=array_keys($values)[0];//0 is the first index if change the JSON then write accordingly.
    // // echo "KEY :".$key."value:".$values[$key]."<br>";
    
    /**
     * GET MEDICINE ID FROM DATABASE
     */
    $Med_ID = getMedicineID($obj,
        globalVars::$medicine_list_table,
        globalVars::$PRODUCT_NAME,
        $values[globalVars::$PRODUCT_NAME
    ]);
    //  echo "Medicine ID is:".$Med_ID."  ";
    
    /**
     * INSERT INTO STORE LOGS: MED_ID,*[RECEIVED ARRAY]*, TIMESTAMP, TRANSACT_NO
     */
    $med = array(globalVars::$PRODUCT_ID=>$Med_ID); 
    $values = $med + $values;
    $values[globalVars::$TIMESTAMP]=$currTimeStamp;
    $values[globalVars::$TRANSACTION_NO]=$transactionID;
    $queriesToAddData[] = $obj->insertData(
        globalVars::$inventory_insert,
        array_keys($values)
        );

    //echo "Table insert result : ".$result;
    $valuesForPrepareStmt[] = array_values($values);
    /**
    * UPDATE STORE ITEMS: CHECK ENTRY IN STORE TABLE WITH MED_NAME AND TYPE,
    * IF EXIST: UPDATE QUANTITY THERE
    * ELSE: INSERT INTO STORE TABLE
    */
    $result=getRowofMedicineInStore(
        $obj,
        globalVars::$store_items,
        $Med_ID,
        $values[globalVars::$PACKAGE_TYPE],
        $values[globalVars::$MRP]
    );
    // echo "MEDICINE EXIST OR NOT : ";
    // print_r($result);
    // // echo "PRINTING VALUES ARRAY: ";
    // // print_r($values);
    if($result==0){//CASE: IFNOT EXIST
        // echo "\nCASE: IFNOT EXIST\n";
        $storeArr = array(
            globalVars::$PRODUCT_ID     =>$Med_ID,
            globalVars::$PRODUCT_NAME   =>$values[globalVars::$PRODUCT_NAME],
            globalVars::$QUANTITY       =>$values[globalVars::$QUANTITY    ],
            globalVars::$MRP            =>$values[globalVars::$MRP         ],
            globalVars::$PACKAGE_TYPE   =>$values[globalVars::$PACKAGE_TYPE],
            globalVars::$IS_FREE        =>$values[globalVars::$IS_FREE      ]
        );
        $queriesToAddData[] = $obj->insertData(
                globalVars::$store_items,
                array_keys($storeArr)
            );
        $valuesForPrepareStmt[]=array_values(
            array_values($storeArr));
    //     echo "MEDICINE NOT EXIST : \n";
    //     print_r($resultIns);
    }else{//CASE: DATA EXIST, UPDATE BASED ON S_NO
        $updateQTY = $values[globalVars::$QUANTITY] +
         $result[globalVars::$QUANTITY];
        $updateArr=array(
            globalVars::$QUANTITY=>$updateQTY
        );
        $queriesToAddData[]=$obj->updateData(
                    globalVars::$store_items,
                    array_keys($updateArr),
                    globalVars::$S_NO
                    // $result[globalVars::$S_NO]
                );
        $valuesForPrepareStmt[] = array(
            $updateQTY,
            $result[globalVars::$S_NO]
        );
    }
   

   
    // print_r($queriesToAddData);
    // print_r($valuesForPrepareStmt);
    $executionResult = $obj->executeQueries($queriesToAddData,$valuesForPrepareStmt);
    if($executionResult){
        $statusReport = array("status"=>true);
    }else{
        $statusReport = array("status"=>false,"reason"=>"internal_server_error");
    }
}
$transactionArrayInvent = array(
    globalVars::$TRANSACTION_NO   =>$transactionID,
    globalVars::$SUM_TOTAL        =>$sum_total,
    globalVars::$TIMESTAMP        =>$currTimeStamp,
    
);
$queriesToAddDataTransaction[] = $obj->insertData(globalVars::$transactionMedicineAdd,array_keys($transactionArrayInvent));
$valuesForPrepareStmtTransaction[]=array_values($transactionArrayInvent);
$executionResult = $obj->executeQueries($queriesToAddDataTransaction,$valuesForPrepareStmtTransaction);
    if($executionResult){
        $statusReport = array("status"=>true);
    }else{
        $statusReport = array("status"=>false,"reason"=>"internal_server_error");
    }
// }else{
//     $statusReport = array("status"=>false,"reason"=>"not_logged_in");  
// }
header('Content-type: application/json');
echo json_encode( $statusReport );
?>