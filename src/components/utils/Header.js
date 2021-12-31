import React from "react";

import { useContext } from "react";

import classes from "./Header.module.css";

import AppManager from "../../store/app-manager";

import Button from "../UI/Button";

const Header = () => {
  const AppManagerContext = useContext(AppManager);

  const onClickHandler = () => {
    AppManagerContext.logOutHandler();
  };

  return (
    <div className={classes["header-container"]}>
      <h1>Hello Doctor</h1>
      {AppManagerContext.isLoggedIn && (
        <Button
          onClick={onClickHandler}
          name="Log Out"
          className={classes["logout-button"]}
        ></Button>
      )}
    </div>
  );
};

export default Header;
