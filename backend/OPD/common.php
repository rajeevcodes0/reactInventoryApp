<?php
// header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
header("Access-Control-Allow-Origin: *");
// header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 86400');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
     
date_default_timezone_set("Asia/Kolkata");
/**Define table names */
define("TABLE_PATIENT_INFO","opd_patient_info");
define("TABLE_PATIENT_ARRIVAL_INFO","opd_patient_arrival_info");
define("TABLE_FEE_AND_DAYS","opd_fee_days");
define("TABLE_ADDRESSES","opd_addresses");
/**Define common names */
define("PATIENT_ID"     ,"patient_id");
define("FIRST_NAME"     ,"first_name");
define("LAST_NAME"      ,"last_name");
define("ADDRESS"        ,"address");
define("GENDER"         ,"gender");
define("CONTACT_NUMBER" ,"contact_number");
define("ARRIVAL_DATE"   ,"arrival_date");
define("AGE"            ,"age");
define("FEE"            ,"fee");
define("NO_OF_DAYS"     ,"no_of_days");
define("REVISITING_DATE","revisiting_date");
define("RETURNING_DATE" ,"returning_date");
define("CURRENT_DATE"   ,"current_date");
define("LAST_ARRIVAL_DATE","last_arrival_date");
define("START_DATE"     ,"start_date");
define("END_DATE"       ,"end_date");
?>