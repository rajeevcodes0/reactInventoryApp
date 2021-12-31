import React, { useContext } from 'react'
import Button from '../UI/Button';

import classes from './SellFromInventoryLog.module.css';
import AppManager from '../../store/app-manager';

function SellFromInventoryLog(props) {
    const AppManagerContext = useContext(AppManager);
    let data = props.data;
    return (
        <div className={classes["log-container"]}>
              <div className={classes["log-header"]}>
                <div className={classes["header-data"]}>
                  <p className={classes["log-id"]}>{data.logID + 1}</p>
                  <p className={classes["medicine-name"]}>{data.medicine.product_name}</p>
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
                <p>Qty:{data.quantity}</p>
                <p>Type:{data.medicine.package_type}</p>
                <p>
                  Price: ₹{data.medicine.MRP}/{data.medicine.package_type}
                </p>
                <p>Total: ₹{data.medicine.MRP * data.quantity}</p>
              </div>
            </div>
    )
}

export default SellFromInventoryLog;
