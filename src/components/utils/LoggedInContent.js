import React, { useContext } from "react";
import { useEffect } from "react";

import {Switch, Route} from "react-router-dom";
import Overview from "../../pages/Overview";
import SearchInventory from "../../pages/SearchInventory";
import AddMedicine from "../../pages/AddMedicine";
import LogBook from "../../pages/LogBook";

import classes from './LoggedInContent.module.css';
import SearchDetailsPage from "../../pages/SearchDetailsPage";
import SellMedicine from "../../pages/SellMedicine";
import Payments from '../../pages/Payments';

import AppManager from "../../store/app-manager";
import Settings from "../../pages/Settings";
import Package from '../../pages/Settings_Subpages/Package/Package';
import Product from '../../pages/Settings_Subpages/Product/Product';
import Transactions from "../../pages/Transactions";


function LoggedInContent() {

  const AppManagerContext = useContext(AppManager);
  

  const fetchAppData = async ()=>{
    const response  = await fetch("https://genxtutorial.com/api2/app-data/index.php");
    const responseJSON = await response.json();
    
    AppManagerContext.setAppDataHandler(responseJSON);
  }

  useEffect(()=>{
    //fetching the app data when a user logsIn
    fetchAppData();
  },[])

  return (
    <div className={classes['loggedin-content-container']}>
      {/* since we already wrapped our whole app inside a router,
       we don't need to use router here */}
       {/*Also we will only show the loggedin content when we have the data,otherwise the app will crash */}
       {AppManagerContext.appData?
       <Switch>
        <Route path="/inventory" exact component={Overview}></Route>
        <Route path="/inventory/search" exact component={SearchInventory}></Route>
        <Route path="/inventory/search/:id" exact component={SearchDetailsPage}></Route>
        <Route path="/inventory/add" exact component={AddMedicine}></Route>
        <Route path="/inventory/book" exact component={LogBook}></Route>
        <Route path="/inventory/sell/:id/:type" exact component={SellMedicine}></Route>

        <Route path="/inventory/payments"  component={Payments}></Route>

        <Route path="/inventory/settings"  exact component={Settings}></Route>
        <Route path="/inventory/settings/packages"  component={Package}></Route>
        <Route path="/inventory/settings/products"  component={Product}></Route>

        <Route path="/inventory/transactions"  component={Transactions}></Route>

      </Switch>
      :
      <h1>Loading</h1>}
       
      
    </div>
  );
}

export default LoggedInContent;
