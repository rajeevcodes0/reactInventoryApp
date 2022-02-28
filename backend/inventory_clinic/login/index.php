<?php
// header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
header("Access-Control-Allow-Origin: *");
// header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 86400');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
      

require_once "../database.php";
require_once "../common.php";
require_once "../commonFunctions.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = (array)json_decode(file_get_contents('php://input'));
}

$data = sanatizeInputData($data);

$obj = new query_();
$query = $obj->getData("users",'*',array("user_name"));
// print_r($query);
$con = $obj->connect();
$stmt = $con->prepare($query);
$stmt->bind_param("s",$data["username"]);
$log_file = globalVars::$log_file;
$clientIP = getUserIP(); 
$currTimeStamp = date('Y/m/d h:i:s');
if($stmt->execute()){
    $result = $stmt->get_result(); // get the mysqli result
    $userResult = $result->fetch_assoc(); // fetch data
    // var_dump($userResult);
    // var_dump($data);
    $user_name = $data['username'];
    $password = $data['password'];
    if(!$userResult)
    {
        $data = array("status"=>false,"reason"=>"wrong_credentials");
        $error_message = "$currTimeStamp |User:$clientIP|Wrong data entered".$user_name.",".$password."\n";
        error_log($error_message, 3, $log_file); 
        
    }else{
        if($password===$userResult["password"])
        {
            session_start();
            $data = array("status"=>true);
            $_SESSION['logged_in'] = true;
            $log_message = "$currTimeStamp |User:$clientIP| LoggedIn\n";
            error_log($log_message, 3, $log_file);

        }else{
            $data = array("status"=>false,"reason"=>"wrong_credentials");
            $error_message = "$currTimeStamp |User:$clientIP|Wrong data entered".$user_name.",".$password."\n";
            error_log($error_message, 3, $log_file);
        }
    }
}else{
    $data = array("status"=>false,"reason"=>"internal_server_error");
    $error_message = "$currTimeStamp |User:$clientIP |Statement Execution Failed User Login\n";
    error_log($error_message, 3, $log_file);
}
header('Content-type: application/json');
echo json_encode( $data );
?>