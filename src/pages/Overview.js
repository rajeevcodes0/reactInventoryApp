import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Button from "../components/UI/Button";

import classes from "./Overview.module.css";

import AppManager from "../store/app-manager";

function Overview() {
  const AppManagerContext = useContext(AppManager);

  const outstandingAmount = AppManagerContext.appData.outstanding_amount;

  return (
    <div className={classes["overview-container"]}>
      <table>
        <thead>
          <tr>
            <th>Store Name</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Medical Store</td>
            <td>{outstandingAmount.medical}</td>
          </tr>
          <tr>
            <td>Dispensary</td>
            <td>{outstandingAmount.dispensary}</td>
          </tr>
        </tbody>
      </table>
      {/* <p>Medical Store :{moneyData.medicalStore}</p>
      <p>Dispensary:{moneyData.dispensary}</p> */}
      <ul>
        <Link className={classes["link-container"]} to="/inventory/search">
          <li>
            <span className={classes["icon-container"]}>
              <i className="fas fa-search"></i>
            </span>
            <Button name="Search Inventory"></Button>
          </li>
        </Link>
        <Link className={classes["link-container"]} to="/inventory/add">
          <li>
            <span className={classes["icon-container"]}>
              <i className="fas fa-plus"></i>
            </span>
            <Button name="Add To Inventory"></Button>
          </li>
        </Link>
        <Link className={classes["link-container"]} to="/inventory/book">
          <li>
            <span className={classes["icon-container"]}>
              <i className="fas fa-book-medical"></i>
            </span>
            <Button name="Log Book"></Button>
          </li>
        </Link>
        <Link className={classes["link-container"]} to="/inventory/payments">
          <li>
            <span className={classes["icon-container"]}>
              <i className="fas fa-money-check-alt"></i>
            </span>
            <Button name="Receive Payments"></Button>
          </li>
        </Link>
        <Link className={classes["link-container"]} to="/inventory/settings">
          <li>
            <span className={classes["icon-container"]}>
              <i class="fas fa-cogs"></i>
            </span>
            <Button name="Settings"></Button>
          </li>
        </Link>
        <Link
          className={classes["link-container"]} to="/inventory/transactions">
          <li>
            <span className={classes["icon-container"]}>
              <i class="fas fa-comment-dollar"></i>
            </span>
            <Button name="Transactions"></Button>
          </li>
        </Link>
      </ul>
    </div>
  );
}

export default Overview;
