<?php
/**
 * PAYMENT TABLE: GIVEN? : STORE TO MEDICAL
 *                TAKEN? : MEDICAL TO STORE
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

$obj = new query_(); //Creating object of class query_ which is having database conncetivity and sql functions.
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = (array) json_decode(file_get_contents('php://input'));
}
/**
 * JSON:MED_NAME, QTY, MRP, PRICE_PERCENT, SUPPLY_TO, TYPE, TOT_AMOUNT, DATE
 */
$currTimeStamp = date('Y/m/d h:i:s');
$transactionID = date('Ymdhis');

$amountMEDICAL = 0;
$amountDISPENSARY = 0;
$clientSendedDate = '';

/**Received Request Contains three things
 * 1. selling_to: string
 * 2. sell_data:array_of_object
 * 3. sum_total:float
 */

// print_r($data["selling_to"]);
$sellingTo = $data['selling_to'];
$sellDataObject = $data['sell_data'];
$sumTotal = $data['sum_total'];
// if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] == true) {
    foreach ($sellDataObject as $object) {
        $queriesToAddData = [];
        $valuesForPrepareStmt = [];

        //Refering to each object from data
        $valuesArrGetting = sanatizeInputData((array)($object)); //Fetching array from object.
        //  print_r($valuesArrGetting);
        $clientSendedDate = $valuesArrGetting[globalVars::$SELLING_DATE];
        $otherDataToBeInserted = [
            globalVars::$TRANSACTION_NO => $transactionID,
            globalVars::$TIMESTAMP => $currTimeStamp,
            globalVars::$SELLING_TO=>$sellingTo
        ];
        $storeLogArr = assignValuesToArray(
            $valuesArrGetting,
            $otherDataToBeInserted
        );
        $queriesToAddData[] = $obj->insertData(
            globalVars::$store_supply,
            array_keys($storeLogArr)
        ); //Query to insery data in  store_log_supply_table
        // print_r(array_keys($storeLogArr));
        $valuesForPrepareStmt[] = array_values($storeLogArr);

        $resultRow = getRowofMedicineInStore(
            $obj,
            globalVars::$store_items,
            $valuesArrGetting[globalVars::$PRODUCT_ID],
            $valuesArrGetting[globalVars::$PACKAGE_TYPE],
            $valuesArrGetting[globalVars::$MRP]
        ); // GET ROW FROM STORE_ITEM TABLE BASED ON MED_ID which is matching with TYPE and MRP.
        /**UPDATE Quantity in STORE_ITEM ROW */
        // echo "Result Row\n";

        // print_r($resultRow);

        $updateQTY =
            $resultRow[globalVars::$QUANTITY] -
            $valuesArrGetting[globalVars::$QUANTITY]; //Here we are sure that we will get data as supply will be only from stock.
        // echo "Updated Qty:".$updateQty."\n";
        $qtyInStock = $resultRow[globalVars::$QUANTITY];
        $qtyReceive=$valuesArrGetting[globalVars::$QUANTITY];
        $serialNo = $resultRow[globalVars::$S_NO];
        $error_message .= "Updated qty $updateQty  Quantity In stock $qtyInStock  Quantity Receive $qtyReceive Serial No $serialNo \n";
        $updateQTY =
            $resultRow[globalVars::$QUANTITY] -
            $valuesArrGetting[globalVars::$QUANTITY]; //Here we are sure that we will get data as supply will be only from stock.

        // if($updateQTY==0){
        //     // echo "Update quantity is ".$updateQTY;
        //     $queriesToAddData[]=$obj->deleteData(
        //         globalVars::$store_items,
        //         array(globalVars::$S_NO)
        //     );
        //     $valuesForPrepareStmt[]=array($resultRow[globalVars::$S_NO]);
        //     // print_r($queriesToAddData);
        //     // print_r($valuesForPrepareStmt);
        // }else{
        $updateArr = [globalVars::$QUANTITY => $updateQTY];
        $queriesToAddData[] = $obj->updateData(
            globalVars::$store_items,
            array_keys($updateArr),
            globalVars::$S_NO
            // $resultRow[globalVars::$S_NO]
        );
        $valuesForPrepareStmt[]=array(
            $updateQTY,
            $resultRow[globalVars::$S_NO]
        );
        // }
        /**Delete row where quantity is 0 */
        $queriesToAddData[]=$obj->deleteData(
            globalVars::$store_items,
            array(globalVars::$QUANTITY)
                );
        $valuesForPrepareStmt[]=array(0);
        
        // $sellingTo = $valuesArrGetting[globalVars::$SELLING_TO];
        if ($sellingTo == globalVars::$SUPPLIER1) {
            $amountMEDICAL += $valuesArrGetting[globalVars::$TOTAL_AMOUNT];
        } else {
            $amountDISPENSARY += $valuesArrGetting[globalVars::$TOTAL_AMOUNT];
        }

        //  $keyMedName=array_keys($valuesArrGetting)[0]; //There is PRODUCT_NAME on 0th index. So we are fetching key from array for getting medicine id from database.
        // //  print_r ($valuesArrGetting);
        //  $Med_ID = getMedicineID($obj,globalVars::$medicine_list_table,$keyMedName,$valuesArrGetting[$keyMedName]);//Get Medicine ID from database.
    
     }
    //  print_r($valuesForPrepareStmt);

    //  echo "AmountMedical : ".$amountMEDICAL."\n";
    //  echo "AmountDispensary : ".$amountDISPENSARY."\n";

    /**Till here we have added queries for insert into store supply and update in stock table
     * Now, Make query for Trasaction Medicine Given.
     */
    $transactionArrayMed = array(
        globalVars::$TRANSACTION_NO   =>$transactionID,
        globalVars::$SUM_TOTAL        =>$amountMEDICAL,
        globalVars::$TIMESTAMP        =>$currTimeStamp,
        globalVars::$SELLING_TO       =>globalVars::$SUPPLIER1,
        globalVars::$SELLING_DATE     =>$clientSendedDate
    );
    $transactionArrayDisp = array(
        globalVars::$TRANSACTION_NO   =>$transactionID,
        globalVars::$SUM_TOTAL        =>$amountDISPENSARY,
        globalVars::$TIMESTAMP        =>$currTimeStamp,
        globalVars::$SELLING_TO       =>globalVars::$SUPPLIER2,
        globalVars::$SELLING_DATE     =>$clientSendedDate
    );

    if($amountMEDICAL!=0){
        $queriesToAddData[]=$obj->insertData(globalVars::$transactionTableName,array_keys($transactionArrayMed));
        $valuesForPrepareStmt[]=array_values($transactionArrayMed);
    }
    if($amountDISPENSARY!=0){
        $queriesToAddData[]=$obj->insertData(globalVars::$transactionTableName,$transactionArrayDisp);
        $valuesForPrepareStmt[]=array_values($transactionArrayDisp);
    }
    //  print_r($queriesToAddData);
    //  print_r($valuesForPrepareStmt);
    $executionResult=$obj->executeQueries($queriesToAddData,$valuesForPrepareStmt);
    // echo "executionResult".$executionResult;
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

error_log($error_message, 3, globalVars::$log_file);

// $log_file = "./my-errors.log";
  
//         // logging error message to given log file
//         $error_message ="loggegIN";
//         $log_file = "./sys.txt";
//         error_log($error_message, 3, $log_file);

?>
   