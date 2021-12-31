import React from 'react'


//context related imports
import { useContext } from "react";
import AppManager from "./store/app-manager";



//importing constituting components
import Header from "./components/utils/Header";
import LoginForm from "./components/utils/LoginForm";
import LoggedInContent from "./components/utils/LoggedInContent";
import Prompt from './components/utils/Prompt';

//importing stylesheet
import classes from "./App.module.css";
import BottomNavigation from './components/utils/BottomNavigation';


function App() {
  //importing the context
  const AppManagerContext = useContext(AppManager);
  return (
    <div className={classes["app-flex-container"]}>
      <div className={classes["app"]}>
        <Header/>
        {AppManagerContext.promptState.isPromptShown && <Prompt/>}
        <div className={classes["app-body"]}>
          {!AppManagerContext.isLoggedIn?<LoginForm />:<LoggedInContent/>}
          {AppManagerContext.isLoggedIn && <BottomNavigation/>}
        </div>
      </div>
    </div>
  );
}

export default App;
