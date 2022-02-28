<?php
// header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
header("Access-Control-Allow-Origin: *");
// header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 86400');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
     
/**
 * Here We will get JSON of two fields: Transaction_NO and fieldName
 * Field name will tell on which table we need to delete. 
 * Field name = "medicine_given" or "medicine_add"
 * 
 */

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
$transactionNo = ($values[globalVars::$TRANSACTION_NO]);
$fieldName = ($values["field_name"]);
$con=$obj->connect();
if($fieldName=="medicine_given"){
/**
 * 1. Get all rows from store_logs_supply where transaction_no
 * 2. Loop thought received rows-> Add quantity to stock
 * 3. Delete rows from store_logs_supply where transaction_no
 * 4. Delete row from transaction_medicine_given where transaction_no;
 */
 //1. Get all rows from store_logs_supply where transaction_no
  $queryToGetAllRows = $obj->getData(globalVars::$store_supply,
                        '*',
                        array(globalVars::$TRANSACTION_NO)                        
                        );
  $stmt = $con->prepare($queryToGetAllRows);
  $stmt->bind_param('s',$transactionNo);                        
  $stmt->execute();
  $resultOfGetAllRows = $stmt->get_result();
  $con->begin_transaction();
  //2. Loop thought received rows-> Add quantity to stock
  $resultStmt = [];
  while($rowOfInventory = $resultOfGetAllRows->fetch_assoc()){
      /*
      Here two things to do. i.) Get quantity from stock where medicine_id MRP TYPE 
                          ii.) insert updated quantity to stock where medicine_id MRP TYPE 
     * */
    $field_=globalVars::$S_NO.', '.globalVars::$QUANTITY.' ';//We need S_NO(For detecting where to update) and quantity(For Updatation). 
     $query = $obj->getData( globalVars::$store_items,
                        $field_,
                        array(
                            globalVars::$PRODUCT_ID,
                            globalVars::$PACKAGE_TYPE,
                            globalVars::$MRP
                        )
    );
    $stmt2 = $con->prepare($query);
    $stmt2->bind_param('sss',$rowOfInventory[globalVars::$PRODUCT_ID],
                             $rowOfInventory[globalVars::$PACKAGE_TYPE],
                             $rowOfInventory[globalVars::$MRP]);
    $stmt2->execute();
    $result2 = $stmt2->get_result();
    $fetchedRow2 = $result2->fetch_assoc();
    $quantityInStock = $fetchedRow2[globalVars::$QUANTITY];
    $s_no_from_stock = $fetchedRow2[globalVars::$S_NO];
    ////Perform Updation of quantity in stock
    $updatedQuantity = $quantityInStock + $rowOfInventory[globalVars::$QUANTITY];//Calculating quantiy which is quantity in stock - quantity of deleting row.
    $queriesForUpdation = $obj->updateData(globalVars::$store_items,
                                             array(globalVars::$QUANTITY),
                                            globalVars::$S_NO
    );
    $stmtUpdate = $con->prepare($queriesForUpdation);
    // echo $queriesForExecution;
    // echo " Set quantity : ".$updatedQuantity." S_NO ".$s_no_from_stock."\n";
    $stmtUpdate->bind_param('ss',$updatedQuantity,$s_no_from_stock);
    $resultStmt[] = $stmtUpdate->execute();
  }

    //3. Delete rows from store_logs_supply where transaction_no
   $queryForDeletion = $obj->deleteData(globalVars::$store_supply,
                        array(globalVars::$TRANSACTION_NO));

    $stmtDelete1 = $con->prepare($queryForDeletion);
    // echo $queriesForExecution;
    $stmtDelete1->bind_param('s',$transactionNo);
    $resultStmt[] = $stmtDelete1->execute();
    
  //4. Delete row from transaction_medicine_given where transaction_no;
  $queryForDeletion2 = $obj->deleteData(globalVars::$transactionTableName,
            array(globalVars::$TRANSACTION_NO));

    $stmtDelete2 = $con->prepare($queryForDeletion2);
    // echo $queriesForExecution;
    $stmtDelete2->bind_param('s',$transactionNo);
    $resultStmt[] = $stmtDelete2->execute();

    $ans = true;
    // print_r($resultStmt);
    for ($i=0; $i < count($resultStmt); $i++) { 
     $ans=$ans and $resultStmt[$i];   
    }

    if($ans)
    {
        $con->commit();
        // echo "\nData is commited\n";
        $statusReport = array("status"=>true);
    }else{
        $con->rollback();
        $statusReport = array("status"=>false,"reason"=>"internal_server_error");
    }

}else //medicine_add
{
    /**
     * 1. Get all rows from store_logs_insert where transaction_no
     * 2. Loop thought received rows-> Subtract quantity from stock
     * 3. Delete rows from store_logs_insert where transaction_no
     * 4. Delete row from transaction_medicine_add where transaction_no;
     */
     //1. Get all rows from store_logs_supply where transaction_no
     $queryToGetAllRows = $obj->getData(globalVars::$inventory_insert,
     '*',
     array(globalVars::$TRANSACTION_NO)                        
     );
    $stmt = $con->prepare($queryToGetAllRows);
    $stmt->bind_param('s',$transactionNo);                        
    $stmt->execute();
    $resultOfGetAllRows = $stmt->get_result();
    $con->begin_transaction();
    //2. Loop thought received rows-> Add quantity to stock
    $resultStmt = [];
    while($rowOfInventory = $resultOfGetAllRows->fetch_assoc()){
    /*
    Here two things to do. i.) Get quantity from stock where medicine_id MRP TYPE 
       ii.) insert updated quantity to stock where medicine_id MRP TYPE 
    * */
    $field_=globalVars::$S_NO.', '.globalVars::$QUANTITY.' ';//We need S_NO(For detecting where to update) and quantity(For Updatation). 
    $query = $obj->getData( globalVars::$store_items,
     $field_,
     array(
         globalVars::$PRODUCT_ID,
         globalVars::$PACKAGE_TYPE,
         globalVars::$MRP
     )
    );
    $stmt2 = $con->prepare($query);
    $stmt2->bind_param('sss',$rowOfInventory[globalVars::$PRODUCT_ID],
          $rowOfInventory[globalVars::$PACKAGE_TYPE],
          $rowOfInventory[globalVars::$MRP]);
    $stmt2->execute();
    $result2 = $stmt2->get_result();
    $fetchedRow2 = $result2->fetch_assoc();
    $quantityInStock = $fetchedRow2[globalVars::$QUANTITY];
    $s_no_from_stock = $fetchedRow2[globalVars::$S_NO];
    ////Perform Updation of quantity in stock
    $updatedQuantity = $quantityInStock - $rowOfInventory[globalVars::$QUANTITY];//Calculating quantiy which is quantity in stock - quantity of deleting row.
    $queriesForUpdation = $obj->updateData(globalVars::$store_items,
                          array(globalVars::$QUANTITY),
                         globalVars::$S_NO
    );
    $stmtUpdate = $con->prepare($queriesForUpdation);
    // echo $queriesForExecution;
    // echo " Set quantity : ".$updatedQuantity." S_NO ".$s_no_from_stock."\n";
    $stmtUpdate->bind_param('ss',$updatedQuantity,$s_no_from_stock);
    $resultStmt[] = $stmtUpdate->execute();
    }

    //3. Delete rows from store_logs_supply where transaction_no
    $queryForDeletion = $obj->deleteData(globalVars::$inventory_insert,
     array(globalVars::$TRANSACTION_NO));

    $stmtDelete1 = $con->prepare($queryForDeletion);
    // echo $queriesForExecution;
    $stmtDelete1->bind_param('s',$transactionNo);
    $resultStmt[] = $stmtDelete1->execute();

    //4. Delete row from transaction_medicine_add where transaction_no;
    $queryForDeletion2 = $obj->deleteData(globalVars::$transactionMedicineAdd,
    array(globalVars::$TRANSACTION_NO));

    $stmtDelete2 = $con->prepare($queryForDeletion2);
    // echo $queriesForExecution;
    $stmtDelete2->bind_param('s',$transactionNo);
    $resultStmt[] = $stmtDelete2->execute();

    $ans = true;
    // print_r($resultStmt);
    for ($i=0; $i < count($resultStmt); $i++) { 
    $ans=$ans and $resultStmt[$i];   
    }

    if($ans)
    {
    $con->commit();
    // echo "\nData is commited\n";
    $statusReport = array("status"=>true);
    }else{
    $con->rollback();
    $statusReport = array("status"=>false,"reason"=>"internal_server_error");
}



}
header('Content-type: application/json');
echo json_encode( $statusReport );


?>
