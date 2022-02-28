<?php
function sanatizeInputData($data){
    $dataArr=array();
    foreach($data as $key=>$val){
        $dataArr[$key]=htmlspecialchars($val);
    }
    return $dataArr;
}

?>