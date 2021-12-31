import React, { useState } from "react";
import Button from "../UI/Button";
import Input from "../UI/Input";

import { useContext } from "react";

import AppManager from "../../store/app-manager";

import classes from "./LoginForm.module.css";

const LoginForm = () => {
  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
  const AppManagerContext = useContext(AppManager);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    setIsLoginButtonDisabled(true);
    const username = event.target[0].value.trim();
    const password = event.target[1].value.trim();

    const userEnteredLoginInfo = {
      username: username,
      password: password,
    };

    AppManagerContext.logInHandler(userEnteredLoginInfo);
  };
  return (
    <div className={classes["login-form-container"]}>
      <form onSubmit={onSubmitHandler}>
        <Input
          id="username"
          name="Enter Username"
          type="text"
          className={classes["input-container"]}
        ></Input>
        <Input
          id="password"
          name="Enter Password"
          type="password"
          className={classes["input-container"]}
        ></Input>
        <Button
          name="LogIn"
          className={
            isLoginButtonDisabled
              ? classes["login-button-disabled"]
              : classes["login-button-active"]
          }

          disabled={isLoginButtonDisabled}
        ></Button>
      </form>
    </div>
  );
};

export default LoginForm;
