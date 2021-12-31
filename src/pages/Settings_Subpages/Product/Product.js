import React from 'react';
import {Switch,Link,Route, useLocation} from 'react-router-dom';
import ShowProducts from './ShowProducts';
import AddProducts from './AddProducts';

import classes from './Product.module.css';
import Button from '../../../components/UI/Button';

function Product() {
    const location = useLocation().pathname;
    console.log("rendering package");
    return (
      <div className={classes["package-container"]}>
        <div className={classes["heading"]}>
          <h1>Products Settings</h1>
        </div>

        <div className={classes["tabs-container"]}>
          <ul>

            <Link to="/inventory/settings/products">
              <li
                className={`${classes["tab"]} ${
                  location === "/inventory/settings/products" &&
                  classes["active-tab"]
                }`}
              >
                <Button name="Show"></Button>
              </li>
            </Link>

            <Link to="/inventory/settings/products/add">
              <li
                className={`${classes["tab"]} ${
                  location === "/inventory/settings/products/add" &&
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
              path="/inventory/settings/products"
              exact
              component={ShowProducts}
            />

            <Route
              path="/inventory/settings/products/add"
              exact
              component={AddProducts}
            />

          </Switch>
        </div>
      </div>
    );
}

export default Product
