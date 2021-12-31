import React, { useContext } from "react";
import { useParams } from "react-router";

import classes from "./SellMedicine.module.css";


import SellableItem from "../components/utils/SellableItem";
import AppManager from "../store/app-manager";

function SellMedicine() {
  const AppManagerContext = useContext(AppManager);

  //the array bellow, contains objects, that have medicine names and there ids
  const allMedicineNames = AppManagerContext.appData.medicine_names;

  //inventory data
  const inventoryData = AppManagerContext.appData.inventory_data;

  let params = useParams();
  let medicineID = parseInt(params.id);
  let medicineType = params.type;
  let medicineName = "";

  

  for(let i=0;i<allMedicineNames.length;i++){
    if(parseInt(allMedicineNames[i].medicine_id)===medicineID){
      medicineName=allMedicineNames[i].product_name;
    }
  }

  let searchResult = [];
  searchResult = inventoryData.filter((data) => {
    if (
      parseInt(data.medicine_id) === medicineID &&
      data.package_type === medicineType
    ) {
      return true;
    } else {
      return false;
    }
  });


  return (
    <div className={classes["sell-medicine-page-container"]}>
      <p className={classes['medicine-name-and-type-container']}>{`${medicineName} ${medicineType}s in the inventory`}</p>
      {searchResult.map((sellableItemData) => {
        return (
          <SellableItem
            data = {sellableItemData}
            className={classes['sellable-item-container']}
            key={Math.random()}
          ></SellableItem>
        );
      })}
    </div>
  );
}

export default SellMedicine;
