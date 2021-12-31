//importing React and required hooks.
import React, { useReducer, useContext, useEffect } from "react";

//importing UI elements
import GroupedRadio from "../components/UI/GroupedRadio";

import Input from "../components/UI/Input";
import Select from "../components/UI/Select";
import Button from "../components/UI/Button";

//importing styles
import classes from "../pages/AddMedicine.module.css";


//importing the context
import AppManager from "../store/app-manager";

//form reducer function
const formReducer = (currentState, action) => {
  if (action.type === "reset-form") {
    return {
      enteredMedicineName: "",
      enteredMedicineQuantity: "",
      selectedMedicineType: action.allMedicineTypes[0],
      enteredPricePerQuantity: "",
      isMedicineFree: false,
      isFormValid: false,
    };
  }
  if (action.type === "name-change") {
    let isFormValid = false;

    if (
      action.value.length > 0 &&
      currentState.enteredMedicineQuantity > 0 &&
      currentState.selectedMedicineType &&
      currentState.enteredPricePerQuantity > 0
    ) {
      isFormValid = true;
    }

    let searchResult = [];

    for (let i = 0; i < action.allMedicineNames.length; i++) {
      if (
        action.value &&
        action.allMedicineNames[i].product_name
          .toLowerCase()
          .includes(action.value.toLowerCase())
      ) {
        searchResult.push(action.allMedicineNames[i].product_name);
      }
    }

    return {
      enteredMedicineName: action.value,
      enteredMedicineQuantity: currentState.enteredMedicineQuantity,
      selectedMedicineType: currentState.selectedMedicineType,
      enteredPricePerQuantity: currentState.enteredPricePerQuantity,
      isMedicineFree: currentState.isMedicineFree,
      searchResult: searchResult,
      isFormValid: isFormValid,
    };
  }

  if (action.type === "search-result-clicked") {
    let isFormValid = false;
    if (
      currentState.enteredMedicineName.length > 0 &&
      currentState.enteredMedicineQuantity > 0 &&
      currentState.selectedMedicineType &&
      currentState.enteredPricePerQuantity > 0
    ) {
      isFormValid = true;
    }
    return {
      enteredMedicineName: action.value,
      enteredMedicineQuantity: currentState.enteredMedicineQuantity,
      selectedMedicineType: currentState.selectedMedicineType,
      enteredPricePerQuantity: currentState.enteredPricePerQuantity,
      isMedicineFree: currentState.isMedicineFree,
      searchResult: [],
      isFormValid: isFormValid,
    };
  }

  if (action.type === "medicine-type-changed") {
    let isFormValid = false;
    if (
      currentState.enteredMedicineName.length > 0 &&
      currentState.enteredMedicineQuantity > 0 &&
      currentState.selectedMedicineType &&
      currentState.enteredPricePerQuantity > 0
    ) {
      isFormValid = true;
    }
    return {
      enteredMedicineName: currentState.enteredMedicineName,
      enteredMedicineQuantity: currentState.enteredMedicineQuantity,
      selectedMedicineType: action.value,
      enteredPricePerQuantity: currentState.enteredPricePerQuantity,
      isMedicineFree: currentState.isMedicineFree,
      searchResult: [],
      isFormValid: isFormValid,
    };
  }

  if (action.type === "is-medicine-free-changed") {
    let isFormValid = false;
    if (
      currentState.enteredMedicineName.length > 0 &&
      currentState.enteredMedicineQuantity > 0 &&
      currentState.selectedMedicineType &&
      currentState.enteredPricePerQuantity > 0
    ) {
      isFormValid = true;
    }
    return {
      enteredMedicineName: currentState.enteredMedicineName,
      enteredMedicineQuantity: currentState.enteredMedicineQuantity,
      selectedMedicineType: currentState.selectedMedicineType,
      enteredPricePerQuantity: currentState.enteredPricePerQuantity,
      isMedicineFree: action.value === "Free" ? true : false,
      searchResult: [],
      isFormValid: isFormValid,
    };
  }

  if (action.type === "medicine-quantity-changed") {
    let isFormValid = false;
    if (
      currentState.enteredMedicineName.length > 0 &&
      parseInt(action.value.trim()) > 0 &&
      currentState.selectedMedicineType &&
      currentState.enteredPricePerQuantity > 0
    ) {
      isFormValid = true;
    }
    return {
      enteredMedicineName: currentState.enteredMedicineName,
      enteredMedicineQuantity: action.value.trim(),
      selectedMedicineType: currentState.selectedMedicineType,
      enteredPricePerQuantity: currentState.enteredPricePerQuantity,
      isMedicineFree: action.value === "Free" ? true : false,
      searchResult: [],
      isFormValid: isFormValid,
    };
  }

  if (action.type === "quantity-price-changed") {
    let isFormValid = false;

    if (
      currentState.enteredMedicineName.length > 0 &&
      currentState.enteredMedicineQuantity > 0 &&
      currentState.selectedMedicineType &&
      parseInt(action.value.trim()) > 0
    ) {
      isFormValid = true;
    }

    return {
      enteredMedicineName: currentState.enteredMedicineName,
      enteredMedicineQuantity: currentState.enteredMedicineQuantity,
      selectedMedicineType: currentState.selectedMedicineType,
      enteredPricePerQuantity: action.value,
      isMedicineFree: currentState.isMedicineFree,
      searchResult: [],
      isFormValid: isFormValid,
    };
  }
};

function AddMedicine() {
  //creating the context
  const AppManagerContext = useContext(AppManager);

  const allMedicineNames = AppManagerContext.appData.medicine_names;

  //all the inventory data, will be used to all the different types of medicines
  let inventoryData = AppManagerContext.appData.inventory_data;

  //holds all the types of medicines, like bottle, carton, strip etc
  let allMedicineTypes = AppManagerContext.appData.package_types;
  console.log(allMedicineTypes)

  //finding the distinct types of medicines
  // for(let i=0;i<inventoryData.length;i++){
  //   if(!allMedicineTypes.includes(inventoryData[i].package_type) ){
  //     allMedicineTypes.push(inventoryData[i].package_type);
  //   }
  // }


  const [formState, dispatchForm] = useReducer(formReducer, {
    enteredMedicineName: "",
    enteredMedicineQuantity: "",
    selectedMedicineType: allMedicineTypes[0],
    enteredPricePerQuantity: "",
    isMedicineFree: false,
    isFormValid: false,
  });

  const onSubmitHandler = (e) => {
    e.preventDefault();
  };

  const nameOnChangeHandler = (e) => {
    let value = e.target.value;
    dispatchForm({ type: "name-change", value: value.trim() , allMedicineNames:allMedicineNames});
  };

  const searchResultClickHandler = (e) => {
    let value = e.target.innerText;
    dispatchForm({ type: "search-result-clicked", value: value });
  };

  const medicineTypeOnChangeHandler = (e) => {
    

    dispatchForm({ type: "medicine-type-changed", value: e.target.value });
  };

  const isMedicineFreeOnChangeHandler = (value) => {
    dispatchForm({ type: "is-medicine-free-changed", value: value });
  };

  const medicineQuantityOnChangeHandler = (e) => {
    dispatchForm({ type: "medicine-quantity-changed", value: e.target.value });
  };

  const quantityPriceOnChangedHandler = (e) => {
    dispatchForm({ type: "quantity-price-changed", value: e.target.value });
  };

  const submitMedicineHandler = () => {

    //data of the newly added medicine
    const newMedicineData = {
    product_name : formState.enteredMedicineName,
    medicineQuantity : formState.enteredMedicineQuantity,
    medicineType : formState.selectedMedicineType,
    pricePerQuantity : formState.enteredPricePerQuantity,
    isMedicineFree : formState.isMedicineFree,
    total : formState.enteredMedicineQuantity* formState.enteredPricePerQuantity
    };

    
    AppManagerContext.addToInventoryAddLog(newMedicineData);
    // AppManagerContext.showPrompt("success","Medicine Added To Log Book");
    dispatchForm({type:"reset-form",allMedicineTypes:allMedicineTypes});
  };

  return (
    <div className={classes["add-medicine-container"]}>
      <h2>Add To Inventory</h2>
      <form onSubmit={onSubmitHandler}>
        <Input
          id="medicine_name"
          name="Medicine Name"
          type="text"
          className={classes["input-container"]}
          onChange={nameOnChangeHandler}
          value={formState.enteredMedicineName}
          required={true}
        ></Input>

        {formState.enteredMedicineName && formState.searchResult.length > 0 && (
          <div className={classes["search-result-container"]}>
            <ul>
              
              {formState.searchResult.map((result,index) => {
                if(index>4){
                  return;
                }
                return (
                  <li onClick={searchResultClickHandler} key={Math.random()}>
                    {result}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        <Input
          id="medicine_quantity"
          name="Medicine Quantity"
          type="number"
          min={0}
          className={classes["input-container"]}
          required={true}
          onChange={medicineQuantityOnChangeHandler}
          value={formState.enteredMedicineQuantity}
        ></Input>

        <Select
          options={allMedicineTypes}
          className={classes["select-quantity-type-button"]}
          onChange={medicineTypeOnChangeHandler}
          value={formState.selectedMedicineType}
        ></Select>

        <Input
          id="price"
          name="MRP"
          type="number"
          className={classes["input-container"]}
          required={true}
          onChange={quantityPriceOnChangedHandler}
          value={formState.enteredPricePerQuantity}
        ></Input>

        <GroupedRadio
          name="isFree"
          labelNameList={["Paid", "Free"]}
          className={classes["grouped-radio"]}
          //   this means check the first input when it is created
          selectedOption={formState.isMedicineFree ? "Free" : "Paid"}
          onChange={isMedicineFreeOnChangeHandler}
        ></GroupedRadio>

        <Button
          name="Add To Book"
          className={`${classes["add-to-book-button"]} ${
            formState.isFormValid
              ? classes["add-to-book-button-active"]
              : classes["add-to-book-button-disabled"]
          }`}
          type="submit"
          disabled={!formState.isFormValid}
          onClick={submitMedicineHandler}
        ></Button>
      </form>
    </div>
  );
}

export default AddMedicine;
