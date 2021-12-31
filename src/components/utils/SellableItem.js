import React, { useContext, useReducer } from "react";
import { useState } from "react";

import Button from "../UI/Button";
import Input from "../UI/Input";

import classes from "./SellableItem.module.css";

import AppManager from "../../store/app-manager";

const formReducer = (currentState, action) => {
  let newState = {};
  if (action.type === "quantity-changed") {
    newState = {
      ...currentState,
      quantity: parseInt(action.value),
    };
    if (
      newState.quantity > 0 &&
      newState.quantity <= currentState.medicineData.quantity
    ) {
      newState.isFormValid = true;
    } else {
      newState.isFormValid = false;
    }
    return newState;
  }
  return {
    isFormValid: false,
    quantity: null,
  };
};

function SellableItem(props) {
  const AppManagerContext = useContext(AppManager);
  const [isSellingThisItem, setIsSellingThisItem] = useState(false);
  const [formState, formDispatch] = useReducer(formReducer, {
    isFormValid: false,
    quantity: null,
    medicineData: props.data,
  });

  const sellButtonOnClickHandler = () => {
    setIsSellingThisItem((prevState) => {
      return !prevState;
    });
  };

  const formOnSubmitHandler = (e) => {
    e.preventDefault();

    //the new sell log that we will send to the log book
    //it has two properties, one the actual medicine data, to update the quantity, in case the user changes it
    let newSellLog = {
      medicine: props.data,
      quantity: formState.quantity,
    };

    //We must check if we are not adding-to-inventory, while selling
    if (AppManagerContext.logBookState.logBookType === "add-to-inventory") {
      AppManagerContext.showPrompt(
        "error",
        "You can't sell and add simultaneously, please clear the log book first",
        5000
      );
    } else {
      //if everything is ok, submit the newSellLog to the array where we have all the sell logs
      AppManagerContext.sellFromInventoryAddLog(newSellLog);
      AppManagerContext.showPrompt("success", "Medicine Added To Book");
    }
  };

  const quantityOnChangeHandler = (e) => {
    let value = e.target.value;
    formDispatch({ type: "quantity-changed", value: value });
  };

  return (
    //   isSelling class is added to show in column view
    <div
      className={`${classes["sellable-item-container"]} ${
        isSellingThisItem && classes["is-selling"]
      }`}
    >
      <div className={classes["sellable-item-data-info"]}>
        <p>{`₹${props.data.MRP}(${props.data.quantity})`}</p>

        <div className={classes["sell-button-container"]}>
          <Button
            name={isSellingThisItem ? "X" : "Sell"}
            onClick={sellButtonOnClickHandler}
            className={`${
              isSellingThisItem
                ? classes["cancel-selling-button"]
                : classes["is-selling-button"]
            }`}
          ></Button>
        </div>
      </div>

      {isSellingThisItem && (
        <div className={classes["select-medicine-quantity-form"]}>
          <form onSubmit={formOnSubmitHandler}>
            <Input
              name="Enter Quantity:"
              onChange={quantityOnChangeHandler}
            ></Input>
            <Button
              className={`${
                formState.isFormValid
                  ? classes["is-active"]
                  : classes["is-disabled"]
              }`}
              name="Submit"
              disabled={!formState.isFormValid}
            ></Button>
          </form>
        </div>
      )}
    </div>
  );
}

export default SellableItem;
