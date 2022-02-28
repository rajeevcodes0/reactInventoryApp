<?php 
date_default_timezone_set("Asia/Kolkata");
/**Define tables here */
class globalVars{
public static $medicine_list_table="product_list2";
public static $package_types_table="product_types_list";
public static $inventory_insert = "store_logs_insert";
public static $store_supply = "store_logs_supply";
public static $store_items ="stock";
public static $transactionMedicineAdd = "transaction_medicine_add";
public static $transactionTableName = "transaction_medicine_given";
public static $paymentTransactionTable= "transaction_money_taken";
public static $log_file ="./serverlogs.log";
/** Common Attribute Names in TABLE*/
public static $S_NO           ="s_no"         ;
public static $PRODUCT_ID     ="medicine_id"  ;
public static $PRODUCT_NAME   ="product_name" ;
public static $QUANTITY       ="quantity"     ;
public static $MRP            ="MRP"          ;
public static $DISCOUNT       ="discount"     ;
public static $SELLING_TO     ="selling_to"   ;
public static $PACKAGE_TYPE   ="package_type" ;
public static $TIMESTAMP      ="timestamp"    ;
public static $TRANSACTION_NO ="transaction_no";
public static $SELLING_DATE   ="selling_date" ;
public static $TOTAL_AMOUNT   = "total_price" ;
public static $SUM_TOTAL      ="sum_total"    ;
public static $IS_FREE        ="is_free"      ;
public static $CATEGORY       ="category"     ;
public static $MONEY_RECEIVE_DATE="money_receive_date" ;
public static $MONEY_RECEIVE_FROM="receive_from" ;
public static $RECEIVE_AMOUNT="total_amount" ;

/**SELLING TO NAMES */

public static $SUPPLIER1 = "medical";
public static $SUPPLIER2 = "dispensary";

}

?>