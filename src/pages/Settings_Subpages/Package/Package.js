import React from 'react';
import {Switch,Link,Route, useLocation} from 'react-router-dom';
import ShowPackages from './ShowPackages';
import AddPackage from  './AddPackages';

import classes from './Package.module.css';
import Button from '../../../components/UI/Button';

function Package() {
    const location = useLocation().pathname;
    console.log("rendering package");
    return (
      <div className={classes["package-container"]}>
        <div className={classes["heading"]}>
          <h1>Packages Settings</h1>
        </div>

        <div className={classes["tabs-container"]}>
          <ul>

            <Link to="/inventory/settings/packages">
              <li
                className={`${classes["tab"]} ${
                  location === "/inventory/settings/packages" &&
                  classes["active-tab"]
                }`}
              >
                <Button name="Show"></Button>
              </li>
            </Link>

            <Link to="/inventory/settings/packages/add">
              <li
                className={`${classes["tab"]} ${
                  location === "/inventory/settings/packages/add" &&
                  classes["active-tab"]
                }`}
              >
                <Button name="Add"></Button>
              </li>
            </Link>
          </ul>
        </div>

        
        <div className={classes['tab-content-container']}>
          <Switch>

            <Route
              path="/inventory/settings/packages"
              exact
              component={ShowPackages}
            />

            <Route
              path="/inventory/settings/packages/add"
              exact
              component={AddPackage}
            />

          </Switch>
        </div>
      </div>
    );
}

export default Package
