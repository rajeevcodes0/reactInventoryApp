import React, { useContext } from "react";

import { Link, useLocation } from "react-router-dom";

import classes from './BottomNavigation.module.css';

import AppManager from "../../store/app-manager";

function BottomNavigation() {
    const location = useLocation();
    const AppManagerContext = useContext(AppManager);
  return (
    <div className={classes["bottom-navigation-container"]}>
      <ul>
        <li className={location.pathname==="/inventory" && classes['current-location']}>
          <Link to="/inventory" >
            <span>
              <i className="fas fa-home"></i>
            </span>
          </Link>
        </li>
        <li className={location.pathname==="/inventory/search" && classes['current-location']}>
          <Link to="/inventory/search" >
            <span >
              <i className="fas fa-search"></i>
            </span>
          </Link>
        </li>
        <li className={location.pathname==="/inventory/add" && classes['current-location']}>
          <Link to="/inventory/add" >
            <span>
              <i className="fas fa-plus"></i>
            </span>
          </Link>
        </li>
        <li className={`${location.pathname==="/inventory/book" && classes['current-location']} ${AppManagerContext.logBookState.logBookType && classes['log-book-not-empty']}`}>
          <Link to="/inventory/book" >
            <span>
              <i className="fas fa-book-medical"></i>
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default BottomNavigation;
