import React, { useContext } from 'react'
import Button from '../UI/Button';

import classes from './AddToInventoryLog.module.css';
import AppManager from '../../store/app-manager';

function AddToInventoryLog(props) {
    const AppManagerContext = useContext(AppManager);
    let data = props.data;
    return (
        <div className={classes["log-container"]}>
              <div className={classes["log-header"]}>
                <div className={classes["header-data"]}>
                  <p className={classes["log-id"]}>{data.logID + 1}</p>
                  <p className={classes["medicine-name"]}>{data.product_name}</p>
                </div>
                <div className={classes["cancel-button-container"]}>
                  <Button
                    className={classes["cancel-button-container"]}
                    name="X"
                    id={data.logID}
                    onClick={AppManagerContext.removeFromLog}
                  ></Button>
                </div>
              </div>
              <div className={classes["log-body"]}>
                <p>Qty:{data.medicineQuantity}</p>
                <p>Type:{data.medicineType}</p>
                <p>
                  Price: ₹{data.pricePerQuantity}/{data.medicineType}
                </p>
                <p>Total: ₹{data.total}</p>
                <p
                  className={
                    data.isMedicineFree ? classes["free"] : classes["paid"]
                  }
                >
                  {data.isMedicineFree ? "Free" : "Paid"}
                </p>
              </div>
            </div>
    )
}

export default AddToInventoryLog
