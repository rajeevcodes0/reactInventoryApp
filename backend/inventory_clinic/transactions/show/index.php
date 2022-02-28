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
$flag=0;//Using for seperator with 1/all.


// if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] == true) {
    $values = sanatizeInputData($data);  
    $no_of_transactions =($values["no_of_transactions"]);
        //Getting two columns first transacti on no and second table information. (sorted)
    $query = "SELECT * FROM(
        select transaction_no,'medicine_given' WhichTBL from transaction_medicine_given
        union
        select transaction_no,'inventory_add' WhichTBL from transaction_medicine_add
        )X ORDER BY transaction_no DESC";
    $con=$obj->connect();
    if($no_of_transactions==1){
        $flag=1;
        $query.=" LIMIT 1 ";
        $result=$con->query($query);    
        $row = $result->fetch_assoc();//We are getting last transaction either done in inventory or selling data
        //Now fetch details from corresponding table. 
        // print_r($row);
        $transaction_no = $row["transaction_no"];
        if($row["WhichTBL"]=="medicine_given"){
            $query = "SELECT transaction_no, sum_total, timestamp, selling_to, selling_date
             FROM transaction_medicine_given WHERE transaction_no=$transaction_no";
             $result=$con->query($query);    
            //  $resultWithObjectNameSingle["medicine_given"] = $result->fetch_assoc(); 
            $resultWithObjectNameSingle["type"] = "medicine_given"; 
            $resultWithObjectNameSingle["data"] = $result->fetch_assoc(); 
            $productSingle=$resultWithObjectNameSingle;
        }
        else{
          $query = "SELECT transaction_no, sum_total, timestamp 
          FROM transaction_medicine_add WHERE transaction_no=$transaction_no";   
          $result=$con->query($query);    
        //   $resultWithObjectName2Single["medicine_add"] = $result->fetch_assoc(); 
        $resultWithObjectNameSingle["type"] = "medicine_add"; 
        $resultWithObjectNameSingle["data"] = $result->fetch_assoc(); 
        $productSingle=$resultWithObjectNameSingle;
        }
        
        // print_r($row);
    }else if($no_of_transactions=="all"){
        $flag=2;
        $result=$con->query($query);    
        while($rows = $result->fetch_assoc()){
            $transaction_no = $rows["transaction_no"];
            if($rows["WhichTBL"]=="medicine_given"){
                $query = "SELECT transaction_no, sum_total, timestamp, selling_to, selling_date
                 FROM transaction_medicine_given WHERE transaction_no=$transaction_no";
                $resultInnerQuery=$con->query($query);    
                $resultWithObjectName["type"]="medicine_given";
                $resultWithObjectName["data"] = $resultInnerQuery->fetch_assoc();     
                $products[] = $resultWithObjectName;
            }
            else{
              $query = "SELECT transaction_no, sum_total, timestamp 
              FROM transaction_medicine_add WHERE transaction_no=$transaction_no";   
              $resultInnerQuery=$con->query($query);    
              $resultWithObjectName["type"]="medicine_add";
              $resultWithObjectName["data"] = $resultInnerQuery->fetch_assoc();     
              $products[] = $resultWithObjectName;
            }
            
        }
    }

    
    header('Content-type: application/json');
    if($flag==1){
        echo json_encode( $productSingle );
    }else if($flag==2){    
        echo json_encode( $products );
    }


?>