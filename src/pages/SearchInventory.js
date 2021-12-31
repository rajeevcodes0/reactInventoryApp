import React, { useContext, useReducer } from "react";
import Input from "../components/UI/Input";
import classes from "./SearchInventory.module.css";


import { Link } from "react-router-dom";

import AppManager from "../store/app-manager";

const searchStateReducer = (currentState, action) => {

  if (action.type === "changeSearchString") {
    let newShownMedicineNames = [];

    newShownMedicineNames = currentState.allMedicineNames.filter((medicine) => {
      //so that Disprin and disprin behave the same in search
      return medicine.product_name.toLowerCase().includes(action.value.toLowerCase());
    });

    return {
      allMedicineNames: currentState.allMedicineNames,
      shownMedicineNames: newShownMedicineNames,
      searchString: action.value,
    };
  }
  return {
    allMedicineNames: currentState.allMedicineNames,
    shownMedicineNames: [],
    searchString: "",
  };
};

function SearchInventory() {
  const AppManagerContext = useContext(AppManager);

  const medicineNamesFromAPI = AppManagerContext.appData.medicine_names;
  const [searchState, dispatchSearchState] = useReducer(searchStateReducer, {
    allMedicineNames:medicineNamesFromAPI,
    // allMedicineNames: medicineNamesJSON,
    shownMedicineNames: [],
    searchString: "",
  });

  const onChangeHandler = (event) => {
    let value = event.target.value.trim();
    dispatchSearchState({ type: "changeSearchString", value: value });
  };
  return (
    <div className={classes["search-inventory-container"]}>
      <div className={classes["search-box"]}>
        <Input
          id="search"
          name="Search Medicine"
          type="text"
          className={classes["input-container"]}
          onChange={onChangeHandler}
        ></Input>
      </div>
      <div className={classes["search-result-container"]}>
        {searchState.shownMedicineNames.map((medicine) => {
          return (
            <Link key={medicine.medicine_id} to={`/inventory/search/${medicine.medicine_id}`}>
              {medicine.product_name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default SearchInventory;
