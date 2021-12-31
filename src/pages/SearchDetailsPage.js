import React, { useContext, useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { Link } from "react-router-dom";


import AppManager from "../store/app-manager";

import classes from "./SearchDetailsPage.module.css";

function SearchDetailsPage() {
  const params = useParams();
  const medicineID = parseInt(params.id);

  const AppManagerContext = useContext(AppManager);


  const [medicineData, setMedicineData] = useState(false);
  const [allMedicineTypeState, setAllMedicineTypeState] = useState([]);

  useEffect(() => {
    //deducing the data to be shown

    //name of the medicine
    let medicineName = "";

    //first we will create an array that contains the name of all medicines
    const allMedicineNames = AppManagerContext.appData.medicine_names;

    //we also separate the inventory data
    const inventoryData = AppManagerContext.appData.inventory_data;

    //then we extract all the distinct medicine types
    let allMedicineType = [];

    for(let i=0;i<inventoryData.length;i++){
      if(!allMedicineType.includes(inventoryData[i].package_type) ){
        allMedicineType.push(inventoryData[i].package_type);
      }
    }

    
    //finding the count for each quantity type of this medicine

    //then we find the name of the current medicine with the requested ID
    for (let i = 0; i < allMedicineNames.length; i++) {
     
      if (parseInt(allMedicineNames[i].medicine_id) === medicineID) {

        medicineName = allMedicineNames[i].product_name;
      }
    }

    //then we find the count of each type of medicine
    let typeCountArray = [];
    for (let i = 0; i < allMedicineType.length; i++) {
      let type = allMedicineType[i];
      let typeCount = 0;
      for (let j = 0; j < inventoryData.length; j++) {
        
        if (
          parseInt(inventoryData[j].medicine_id) === medicineID &&
          inventoryData[j].package_type === type
        ) {
          
          typeCount++;
        }
      }
      typeCountArray.push(typeCount);
    }

    //then setting this data as the state, which will help us show it
    setMedicineData({
      name: medicineName,
      typeCountArray: typeCountArray,
    });

    setAllMedicineTypeState(allMedicineType);
  }, []);

  
  return (
    <React.Fragment>
      {/* don't render this if medicine data  is empty */}
      {medicineData && (
        <div className={classes["search-data-container"]}>
          <p className={classes["medicine-name"]}>{medicineData.name}</p>
          <p className={classes["in-inventory-text"]}>In Inventory</p>

          {/* show the type and its quantity */}
          <div className={classes["quantity-type-data-container"]}>
            {medicineData.typeCountArray.map((count, i) => {
              if (count !== 0) {
                return (
                  <Link to={`/inventory/sell/${medicineID}/${allMedicineTypeState[i]}`}>
                    <div className={classes["quantity-type-data"]}>
                      <p className={classes["quantity-name"]}>
                        {allMedicineTypeState[i]}
                      </p>
                      <p className={classes["quantity-count"]}>{count}</p>
                    </div>
                  </Link>
                );
              }
            })}
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default SearchDetailsPage;
