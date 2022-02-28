<?php
// A file that contains comman used function in all files.
require_once 'database.php';
require_once 'common.php';
/*
    checkDuplicate($tableName, $valueArr): It checks if value already is in table or not. 
    If present return true otherwise false.
*/


function checkDuplicate($tableName,$valueArr){
    $obj=new query_();    
    $result = $obj->getData($tableName,'*',$valueArr);
    if(count($result)>0 && $result!=0){
        return true;
    }
    else{
        
        return false;
    }
}
/**Return medicine id using medicine name */
function getMedicineID($obj,$tableName,$medicineKey,$medicineName){
    $medicineArr = array($medicineKey); 
    $query = $obj->getData($tableName,'*',$medicineArr);
    $con = $obj->connect();
    $stmt = $con->prepare($query);
    $stmt->bind_param("s",$medicineName);
    if($stmt->execute()){
        $result = $stmt->get_result(); // get the mysqli result
        $medID = $result->fetch_assoc(); // fetch data
        $key = globalVars::$PRODUCT_ID;
        return $medID[$key];
    }else{
        return false;
    }
    // return ($result[0]["MED_ID"]);
}
/**It returns row of stock item */
function getRowofMedicineInStore($obj,$tableName,$PROD_ID,$TYPE,$MRP){
    // $medicineArr = array(globalVars::$PRODUCT_ID=>$PROD_ID, globalVars::$PACKAGE_TYPE=>$TYPE,globalVars::$MRP=>$MRP);
    $medicineArr = array(globalVars::$PRODUCT_ID, globalVars::$PACKAGE_TYPE,globalVars::$MRP);
    $result = $obj->getData($tableName,'*',$medicineArr);        
    $con = $obj->connect();
    $stmt = $con->prepare($result);
    $stmt->bind_param("sss",$PROD_ID,$TYPE,$MRP);
    $stmt->execute();
    $result = $stmt->get_result();
    // var_dump($result->fetch_assoc());
    return $result->fetch_assoc(); // fetch data ;

}
function assignValuesToArray($values,$otherData)
{
    //lets create an array to return.
    $storeLogArr = array(
        globalVars::$PRODUCT_ID    =>$values    [globalVars::$PRODUCT_ID    ],  
        globalVars::$PRODUCT_NAME  =>$values    [globalVars::$PRODUCT_NAME  ],     
        globalVars::$QUANTITY      =>$values    [globalVars::$QUANTITY      ],     
        globalVars::$MRP           =>$values    [globalVars::$MRP           ],     
        globalVars::$DISCOUNT      =>$values    [globalVars::$DISCOUNT      ],     
        globalVars::$SELLING_TO    =>$otherData [globalVars::$SELLING_TO    ],     
        globalVars::$PACKAGE_TYPE  =>$values    [globalVars::$PACKAGE_TYPE  ],     
        globalVars::$TIMESTAMP     =>$otherData [globalVars::$TIMESTAMP     ],  
        globalVars::$TOTAL_AMOUNT  =>$values    [globalVars::$TOTAL_AMOUNT  ],     
        globalVars::$TRANSACTION_NO=>$otherData [globalVars::$TRANSACTION_NO],  
        globalVars::$SELLING_DATE  =>$values [globalVars::$SELLING_DATE]  
    ); 
    return $storeLogArr;
}
function sanatizeInputData($data){
    $dataArr=array();
    foreach($data as $key=>$val){
        $dataArr[$key]=htmlspecialchars($val);
    }
    return $dataArr;
}
function getUserIP() {
    if( array_key_exists('HTTP_X_FORWARDED_FOR', $_SERVER) && !empty($_SERVER['HTTP_X_FORWARDED_FOR']) ) {
        if (strpos($_SERVER['HTTP_X_FORWARDED_FOR'], ',')>0) {
            $addr = explode(",",$_SERVER['HTTP_X_FORWARDED_FOR']);
            return trim($addr[0]);
        } else {
            return $_SERVER['HTTP_X_FORWARDED_FOR'];
        }
    }
    else {
        return $_SERVER['REMOTE_ADDR'];
    }
}
function getRow($obj,$tableName,$query,$values){    
    $con = $obj->connect();
    $stmt = $con->prepare($query);
    $noOfValues = str_repeat('s', count($values)); //types
    // print_r($query);
    // print_r($values);
    $stmt->bind_param($noOfValues,$values);
    if($stmt->execute()){
        $result = $stmt->get_result(); // get the mysqli result
        $getRowfromResult = $result->fetch_assoc(); // fetch data
        // print_r($getRowfromResult);
        return $getRowfromResult;
    }
    
}
?>