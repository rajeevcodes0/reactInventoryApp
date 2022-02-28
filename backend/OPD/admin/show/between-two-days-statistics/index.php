<?php
session_start(); //start the session to use session variables
//include necessary files
require_once "../../../common.php";
require_once "../../../commonFunctions.php";
require_once "../../../database.php";
$obj = new query_();
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = (array) json_decode(file_get_contents('php://input'));
}

$dates = sanatizeInputData($data);
/**We need to return total new, total subsidised patient and total sale for received date */
function getDataBasedOnTwoDate($obj, $startDate, $endDate){
    $queryToGetData = $obj->getData( TABLE_PATIENT_ARRIVAL_INFO,
        'arrival_date, amount_paid'
    );    
    $queryToGetData.=" WHERE arrival_date between ? AND ?";
    // echo $queryToGetData;
    $result = $obj->executeQueryGetData($queryToGetData,array($startDate,$endDate));    
    // print_r($result);
    if($result){
        return processData($result);
    }else{
        return false;
    }
}
function processData($result){
    /**I am maintaining an associative array whose key is "date"
     * and values are an array which contains three things total_new, total_subsidised & total_sale
     * 
    */
    // print_r($result);
    $dateWiseData =[];
    for ($i=0; $i < count($result); $i++) { 
        $currentField["arrival_date"] =$result[$i]["arrival_date"]; 
        $currentField["amount_paid"]  =$result[$i]["amount_paid"];
        if($currentField["amount_paid"]!=0){
            $isNew = 0;
            $isSubsidised = 1;
        }else{
            $isNew = 1;
            $isSubsidised = 0;
        }
        if(!array_key_exists($currentField["arrival_date"], $dateWiseData)){ //If key doesn't exist means first data on that date
            $dateWiseData[$currentField["arrival_date"]] = array("total_new"=>$isNew, 
                                                                "total_subsidised"=>$isSubsidised,
                                                                "total_sale"=>$currentField["amount_paid"]
                                                            );
        }else{//Now as data is present on that date so data needs to be modified           
            
            $dateWiseData[$currentField["arrival_date"]]["total_new"] +=$isNew;
            $dateWiseData[$currentField["arrival_date"]]["total_subsidised"] +=$isSubsidised;
            $dateWiseData[$currentField["arrival_date"]]["total_sale"] +=$currentField["amount_paid"];
        }
    }//End forloop
    //Data which is to be send to client is different as we have prepared. So make data according to client need
    $dataToSend=[];
    foreach ($dateWiseData as $key => $value) {
        $dataToSend[]=array("date"=>$key,
                            "date_information"=>$value
                    );
    }
    return $dataToSend;

}


//  if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] == true) {

    $status = getDataBasedOnTwoDate($obj,$dates["start_date"],$dates["end_date"]);
    if(!$status){
        $status = array("status"=>false,"reason"=>"data_not_exist");
    }
// }else{
//     $status = array("status"=>false,"reason"=>"not_logged_in");  
// }
header('Content-type: application/json');
echo json_encode( $status );
?>