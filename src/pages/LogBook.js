import React from "react";

import AppManager from "../store/app-manager";
import { useContext } from "react";

import Select from '../components/UI/Select'
import Input from '../components/UI/Input';

import classes from "./LogBook.module.css";
import Button from "../components/UI/Button";
import AddToInventoryLog from "../components/utils/AddToInventoryLog";
import SellFromInventoryLog from "../components/utils/SellFromInventoryLog";

function LogBook() {
  const AppManagerContext = useContext(AppManager);

  //holds the total amount of medicines being added
  let addToInventoryTotalSum = 0;

  for (
    let i = 0;
    i < AppManagerContext.logBookState.logBookAddToInventoryData.length;
    i++
  ) {
    addToInventoryTotalSum +=
      AppManagerContext.logBookState.logBookAddToInventoryData[i].total;
  }

  let sellFromInventoryTotalSum = 0;

  for (let i = 0;i < AppManagerContext.logBookState.logBookSellData.length;i++) {
    sellFromInventoryTotalSum +=
      AppManagerContext.logBookState.logBookSellData[i].quantity *
      AppManagerContext.logBookState.logBookSellData[i].medicine.MRP;

  }

  sellFromInventoryTotalSum =
    sellFromInventoryTotalSum -
    (sellFromInventoryTotalSum * AppManagerContext.logBookState.discount)/100;

    console.log(sellFromInventoryTotalSum);

  let heading = "";
  if (AppManagerContext.logBookState.logBookType === "add-to-inventory") {
    heading = "Adding To Inventory";
  } else if (
    AppManagerContext.logBookState.logBookType === "sell-from-inventory"
  ) {
    heading = "Selling From Inventory";
  }

  const sellingFromInventoryOnSubmitHandler = ()=>{
    console.log("selling from inventory push to server called");
    AppManagerContext.sellingFromInventoryPushDataToServer();
    

  }
  const addingToInventoryOnSubmitHandler = ()=>{
    console.log("adding to inventory push to server called");
    AppManagerContext.addingToInventoryPushDataToServer();
    
  }

  const isSubmitButtonActive =
    AppManagerContext.logBookState.sellingTo !== "---" &&

    AppManagerContext.logBookState.sellingDate != null &&
    AppManagerContext.logBookState.sellingDate != "" &&

    AppManagerContext.logBookState.discount!=null &&
    AppManagerContext.logBookState.discount!=="" &&
    !Number.isNaN(AppManagerContext.logBookState.discount)

  console.log(AppManagerContext.logBookState.discount!=null,AppManagerContext.logBookState.discount!=="",!Number.isNaN(AppManagerContext.logBookState.discount))
  return (
    <div className={classes["log-book-container"]}>
      <h1 className={classes["log-book-heading"]}>{heading}</h1>

      {/* show the clear log button only when there is some content */}
      {AppManagerContext.logBookState.logBookType != null && (
        <Button
          name="Clear Log Book"
          className={classes["clear-log-book-button"]}
          onClick={AppManagerContext.clearLogBook}
        />
      )}

      {AppManagerContext.logBookState.logBookType === "sell-from-inventory" && (
        <div className={classes['selling-to-and-selling-date-container']}>

          <div className={classes['selling-to-and-selling-date-section']}>
            <p>Selling To:</p>
            <Select
              options={["---", "medical store(BABLU)", "dispensary(SECCO)"]}
              value={AppManagerContext.logBookState.sellingTo}
              onChange={AppManagerContext.sellingToOnChangeHandler}
            ></Select>
          </div>

          <div className={classes['selling-to-and-selling-date-section']}>
            <p>Selling Date:</p>
            <Input type="date" onChange={AppManagerContext.sellingDateOnChangeHandler}></Input>
          </div>

          <div className={classes['selling-to-and-selling-date-section']}>
            <p>Discount:</p>
            <Input type="number" onChange={AppManagerContext.discountOnChangeHandler}></Input>
          </div>
        </div>
      )}
      {AppManagerContext.logBookState.logBookType === null && (
        <p className={classes["no-content-message"]}>
          The Log Book Is Empty. Add Some Logs.
        </p>
      )}

      {/* showing sell logs */}
      {AppManagerContext.logBookState.logBookType === "sell-from-inventory" &&
        AppManagerContext.logBookState.logBookSellData.map((data) => {
          return <SellFromInventoryLog key={Math.random()} data={data} />;
        })}

      {/* showing add logs */}
      {AppManagerContext.logBookState.logBookType === "add-to-inventory" &&
        AppManagerContext.logBookState.logBookAddToInventoryData.map((data) => {
          return <AddToInventoryLog key={Math.random()} data={data} />;
        })}

      {/* show the total sum  and submit button only when there is something in the log book */}
      {AppManagerContext.logBookState.logBookType === "add-to-inventory" && (
        <div className={classes["total-sum-container"]}>
          <p>Sum Total</p>
          <p>₹{addToInventoryTotalSum}</p>
          <Button
            onClick={addingToInventoryOnSubmitHandler}
            className={classes["log-book-submit-button-active"]}
            name="Submit"
          ></Button>
        </div>
      )}

      {AppManagerContext.logBookState.logBookType === "sell-from-inventory" && (
        <div className={classes["total-sum-container"]}>
          <p>Sum Total</p>
          <p>₹{sellFromInventoryTotalSum}</p>
          <Button
            onClick={sellingFromInventoryOnSubmitHandler}
            className={
              isSubmitButtonActive
                ? classes["log-book-submit-button-active"]
                : classes["log-book-submit-button-disabled"]
            }
            name="Submit"
            disabled={isSubmitButtonActive?false:true}
          ></Button>
        </div>
      )}
    </div>
  );
}

export default LogBook;
