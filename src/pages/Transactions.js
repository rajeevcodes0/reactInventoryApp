import React from 'react'
import {Link,Switch,Route, useLocation} from 'react-router-dom';

import LastTransaction from './Transactions_SubPages/LastTransaction';
import AllTransactions from './Transactions_SubPages/AllTransactions';

import classes from './Transactions.module.css';

function Transactions() {
    const location = useLocation().pathname;
    return (
      <div className={classes["transactions-container"]}>
        <h1>Transactions</h1>
        <ul className={classes["links-container"]}>
          {/* we show the last transaction  to delete when we are on /transactions */}
          <Link
            to="/inventory/transactions"
            className={`${
              location === "/inventory/transactions" && classes["active-link"]
            } ${classes["link"]}`}
          >
            <li>Last</li>
          </Link>
          <Link
            to="/inventory/transactions/all"
            className={`${
              location === "/inventory/transactions/all" &&
              classes["active-link"]
            } ${classes["link"]}`}
          >
            <li>All</li>
          </Link>
        </ul>
        <Switch>
          {/* we don't use exact when there are subpages to be show with the same link */}
          <div className={classes['link-content-container']}>
            <Route
              path="/inventory/transactions"
              exact
              component={LastTransaction}
            ></Route>
            <Route
              path="/inventory/transactions/all"
              exact
              component={AllTransactions}
            ></Route>
          </div>
        </Switch>
      </div>
    );
}

export default Transactions
