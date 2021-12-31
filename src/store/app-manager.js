import React, { useEffect } from "react";

import { useState } from "react";
import { useHistory } from "react-router";
import { useReducer } from "react";

const AppManager = React.createContext({
  appData:{
    outstanding_amount: {
        medical: 0,
        dispensary: 0
    },
    medicine_names: [
        {
            product_name: "combiflam",
            medicine_id: 1
        }
    ],
    inventory_data: [
        {
            medicine_id: 1,
            product_name: "combiflam",
            quantity: 47,
            MRP: 500,
            package_type: 'carton',
            is_free: 0
        }
    ]
},
  setAppDataHandler:()=>{},
  updateAppData:()=>{},
  isLoggedIn: () => {},
  logInHandler: () => {},
  logOutHandler: () => {},
  logBookState: {},
  addToInventoryAddLog: () => {},
  removeFromLog: () => {},
  sellFromInventoryAddLog: () => {},
  clearLogBook: () => {},
  sellingToOnChangeHandler:()=>{},
  sellingDateOnChangeHandler:()=>{},
  discountOnChangeHandler:()=>{},

  promptState: {
    isPromptShown: false,
    message: null,
    selectedClassName: null,
  },

  showPrompt: (messageType, message) => {},

  sellingFromInventoryPushDataToServer:()=>{},
  addingToInventoryPushDataToServer:()=>{}

});

const logBookReducer = (currentState, action) => {
  if (action.type === "add-to-inventory") {
    if (currentState.logBookType === null) {
      currentState.logBookType = "add-to-inventory";
    }

    //we just add a logID to the received data, for identifying the log while removal
    action.value.logID = currentState.logBookAddToInventoryData.length;
    currentState.logBookAddToInventoryData.push(action.value);

    return {
      ...currentState,
    };
  }

  if (action.type === "remove-from-log-book") {
    if (currentState.logBookType === "add-to-inventory") {
      let newLogBookData = currentState.logBookAddToInventoryData.filter(
        (data) => {
          //here value is the id to be removed
          return action.value !== data.logID;
        }
      );
      //if after removing, we have no element left, then set the type of logbook to null
      let logBookType =
        newLogBookData.length > 0 ? currentState.logBookType : null;
      let newState = {
        ...currentState,
        logBookType: logBookType,
        logBookAddToInventoryData: newLogBookData,
      };
      return newState;
    } else {
      // in case the we are selling we should remove from SellFromInventoryLog
      let newLogBookData = currentState.logBookSellData.filter((data) => {
        //here value is the id to be removed
        return action.value !== data.logID;
      });
      //if after removing, we have no element left, then set the type of logbook to null
      let logBookType =
        newLogBookData.length > 0 ? currentState.logBookType : null;
      let newState = {
        ...currentState,
        logBookType: logBookType,
        logBookSellData: newLogBookData,
      };
      return newState;
    }
  }

  if (action.type === "sell-from-inventory") {
    if (currentState.logBookType === null) {
      currentState.logBookType = "sell-from-inventory";
    }
    //we copy the whole data, since = operator doesn't copy deeply
    let newLogBookSellData = currentState.logBookSellData.map((data) => {
      return data;
    });

    for (let i = 0; i < newLogBookSellData.length; i++) {
      //if the medicine already exists in the sell log
      if (newLogBookSellData[i].medicine === action.value.medicine) {
        //then update it
        newLogBookSellData[i].quantity = action.value.quantity;
        //then exit the function
        return {
          ...currentState,
          logBookSellData: newLogBookSellData,
        };
      }
    }

    //if the medicine is not found in the sell log,and we are still inside the function, then make a new entry
    //before making the entry add a logID to delete logs.
    action.value.logID = newLogBookSellData.length;
    newLogBookSellData.push(action.value);

    return {
      ...currentState,
      logBookSellData: newLogBookSellData,
    };


  }

  if ((action.type === "clear-log-book")) {
    return {
      logBookType: null,
      logBookAddToInventoryData: [],
      logBookSellData: [],
      sellingTo:"---",
      sellingDate:null
    };
  }

  if(action.type==="selling-to-changed"){
    console.log("selling-to-changed inside reducer")
    return{
      ...currentState,
      sellingTo:action.value
    }
  }

  if(action.type==="selling-date-changed"){
    return{
      ...currentState,
      sellingDate:action.value
    }
  }

  if(action.type==="discount-changed"){
    return{
      ...currentState,
      discount:action.value
    }
  }
};

const promptReducer = (currentState, action) => {
  if (action.type === "show-prompt") {
    let selectedClassName = "";
    if (action.value.messageType === "success") {
      selectedClassName = "prompt-success";
    } else {
      selectedClassName = "prompt-error";
    }
    return {
      isPromptShown: true,
      message: action.value.message,
      selectedClassName: selectedClassName,
    };
  }

  if (action.type === "hide-prompt") {
    return {
      isPromptShown: false,
      message: "",
      selectedClassName: "",
    };
  }
};
export const AppManagerProvider = (props) => {

  
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(()=>{
    if(localStorage.getItem("isLoggedIn")==="true"){
      setIsLoggedIn(true);
    }
    if(!navigator.onLine){
      showPrompt("error"," No Internet Connection",10000)
    }
  },[])
  //if the user refreshes or comes back while still logged in, he shouldn't have to log in
  

  //appData is the data we receive when we log, it contains all the data that we need in the app
  //we set it to false, because we will show the overview content only when we have the app data,
  //empty object is treated as true, hence we turn it into false
  const [appData, setAppData] = useState(false);
  console.log(appData);
  const updateAppData = async ()=>{
    console.log("appDataBeingUpdated");
    const response  = await fetch("https://genxtutorial.com/api2/app-data/index.php");
    const responseJSON = await response.json();
    setAppData(responseJSON);
  }

  const [logBookState, logBookDispatch] = useReducer(logBookReducer, {
    logBookType: null,
    logBookAddToInventoryData: [],
    logBookSellData: [],
    sellingTo:"---",
    sellingDate:"",
    discount:null,
  });


  //the classes used in the reducer below are global
  const [promptState, promptDispatch] = useReducer(promptReducer, {
    isPromptShown: false,
    message: null,
    selectedClassName: "",
  });

  const showPrompt = (messageType, message, time = 2000) => {
    promptDispatch({
      type: "show-prompt",
      value: { messageType: messageType, message: message },
    });

    setTimeout(() => {
      promptDispatch({ type: "hide-prompt" });
    }, time);
  };



  //this function gets called when we receive the data using useEffect in loggedInComponent component
  const setAppDataHandler = (appData)=>{
    setAppData(appData);
  }

  //adds a log  to log book when we are adding a medicine to inventory
  const addToInventoryAddLog = (data) => {
    //check if the log is already present
    let isPresent = false;


    let newValue = data;

    for(let i=0;i<logBookState.logBookAddToInventoryData.length;i++){
      let valueToExamine = logBookState.logBookAddToInventoryData[i];
      if (
        newValue.product_name === valueToExamine.product_name &&
        newValue.pricePerQuantity === valueToExamine.pricePerQuantity &&
        newValue.medicineType === valueToExamine.medicineType
      ) {

        isPresent=true;
        showPrompt("error","A Similar Log Is Already Present",3000);
        return;
      }
    }

    if (logBookState.logBookType === "sell-from-inventory") {
      showPrompt(
        "error",
        "You can't sell and add simultaneously, please clear the log book first",
        5000
      );
      return;
    } else {
      showPrompt("success", "Medicine Added To Log Book");
      logBookDispatch({ type: "add-to-inventory", value: data });
    }
  };

  //adds a sell log to the log book
  const sellFromInventoryAddLog = (data) => {
    //the data object would have two things, the object for which we added the quantity
    //and the quantity
    //We will first search if the object exists, if it does, then we will update the quantity
    //otherwise we will add the new entry

    if (logBookState.logBookType === "add-to-inventory") {
      showPrompt(
        "error",
        "You can't sell and add simultaneously, please clear the log book first",
        5000
      );
      return;
    }
    logBookDispatch({ type: "sell-from-inventory", value: data });
  };

  //removes a log from the log book
  const removeFromLog = (e) => {
    let logID = parseInt(e.target.dataset.id);
    logBookDispatch({ type: "remove-from-log-book", value: logID });
  };

  const clearLogBook = () => {
    logBookDispatch({ type: "clear-log-book" });
  };

  //handles the value of selling-to(medical or dispensary) 
  const sellingToOnChangeHandler = (e)=>{
   
    logBookDispatch({type:"selling-to-changed",value:e.target.value});
  }

  const sellingDateOnChangeHandler = (e)=>{
    logBookDispatch({type:"selling-date-changed",value:e.target.value});
  }

  const discountOnChangeHandler = (e)=>{
    
    if(e.target.value===""){
      e.target.value="0";
    }
    if( !Number.isNaN( parseFloat(e.target.value) )){
      console.log(parseFloat(e.target.value), "called");
      logBookDispatch({type:"discount-changed",value:parseFloat(e.target.value)});
    }
  }

  //we use useHistory hook to use inside the logOutHandler
  const history = useHistory();

  const logInHandler = async (userEnteredLoginInfo) => {

  
    const response = await fetch(
      "https://genxtutorial.com/api2/login/index.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userEnteredLoginInfo),
      }
    );

    const responseJSON = await response.json();

    if (responseJSON.status) {
      
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn","true");
    } else {
      
      showPrompt("error", "Wrong Login Credentials");
    }
    
  };

  const logOutHandler = () => {
    //we should change the address to '/' when we log out.

    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    history.push("/inventory");
    fetch("https://genxtutorial.com/api2/logout/index.php");
  };



  //a function that will be used to send data to the server, it will be asynchronous
  const sendToServerFunction = async (address,method,data)=>{
    console.log("hey im being called");

    // console.log(data);
    // console.log("sending to server");
    // console.log("data before", data);

    const newData = JSON.stringify(data);
    console.log("data after stringify", newData);

    const response = await fetch(address,{
      method:method,
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(data)
    })

    const responseJSON = await response.json();
    // console.log(responseJSON);
    //once the data have been sent to the server update it
    updateAppData();
    //then clear the logBook
    clearLogBook();

    //if the response is true, show a dialogue of success
    if(responseJSON.status){
      showPrompt("success","Data Submitted To Server")
    }
  }

  const sellingFromInventoryPushDataToServer = ()=>{

    //this is an array that will contain all the translatory objects
    let sellFromInventoryDataArray=[];

    for(let i = 0;i<logBookState.logBookSellData.length;i++){
      let translatoryObject = {
        medicine_id:parseInt(logBookState.logBookSellData[i].medicine.medicine_id),
        package_type:logBookState.logBookSellData[i].medicine.package_type,
        product_name:logBookState.logBookSellData[i].medicine.product_name,
        // quantity:parseInt(logBookState.logBookSellData[i].medicine.quantity)
        quantity:parseInt(logBookState.logBookSellData[i].quantity),
        MRP:parseFloat(logBookState.logBookSellData[i].medicine.MRP),
        discount:0,
        total_price:parseFloat(logBookState.logBookSellData[i].medicine.MRP * logBookState.logBookSellData[i].quantity),
        selling_date:logBookState.sellingDate
      }

      sellFromInventoryDataArray.push(translatoryObject);
    }

    //we calculate the total price to be sent to the server
    let sumTotal = 0;

    for(let i=0;i<sellFromInventoryDataArray.length;i++){
      sumTotal+=sellFromInventoryDataArray[i].total_price;
    }
    
    let sendToServerData = {
      selling_to:logBookState.sellingTo==="medical store(BABLU)"?'medical':"dispensary",
      sell_data:sellFromInventoryDataArray,
      sum_total:sumTotal
    }

    console.log(sendToServerData);

    console.log(sendToServerData);

    
    sendToServerFunction("https://genxtutorial.com/api2/log-book-sell-data/index.php","POST",sendToServerData);
    console.log(sellFromInventoryDataArray);
    console.log(logBookState.logBookSellData);
   
  }

  const addingToInventoryPushDataToServer = ()=>{
    console.log(logBookState.logBookAddToInventoryData);


    //this is an array that contains all the translatory objects
    let addToInventoryDataArray=[];

    for(let i=0;i<logBookState.logBookAddToInventoryData.length;i++){
      let translatoryObject = {
        product_name:logBookState.logBookAddToInventoryData[i].product_name,
        quantity:logBookState.logBookAddToInventoryData[i].medicineQuantity,
        MRP:logBookState.logBookAddToInventoryData[i].pricePerQuantity,
        discount:1,
        total_price:logBookState.logBookAddToInventoryData[i].total,
        is_free:logBookState.logBookAddToInventoryData[i].isMedicineFree,
        package_type:logBookState.logBookAddToInventoryData[i].medicineType
      }
      addToInventoryDataArray.push(translatoryObject);
    }

    //we calculate the total price to be sent to the server
    let sumTotal = 0;

    for(let i=0;i<addToInventoryDataArray.length;i++){
      sumTotal+=addToInventoryDataArray[i].total_price;
    }

    //the object that we will send to the server
    let sendToServerData={
      add_data:addToInventoryDataArray,
      sum_total:sumTotal
    }

    sendToServerFunction(
      "https://genxtutorial.com/api2/log-book-add-to-inventory-data/index.php",
      "POST",
      sendToServerData
    )
    
  }

  return (
    <AppManager.Provider
      value={{
        
        appData:appData,
        setAppDataHandler:setAppDataHandler,
        updateAppData:updateAppData,

        isLoggedIn: isLoggedIn,
        logInHandler: logInHandler,
        logOutHandler: logOutHandler,

        logBookState: logBookState,
        addToInventoryAddLog: addToInventoryAddLog,
        removeFromLog: removeFromLog,
        sellFromInventoryAddLog: sellFromInventoryAddLog,
        clearLogBook: clearLogBook,
        sellingToOnChangeHandler:sellingToOnChangeHandler,
        sellingDateOnChangeHandler:sellingDateOnChangeHandler,
        discountOnChangeHandler:discountOnChangeHandler,

        promptState: promptState,
        showPrompt: showPrompt,

        sellingFromInventoryPushDataToServer:sellingFromInventoryPushDataToServer,
        addingToInventoryPushDataToServer:addingToInventoryPushDataToServer
        
      }}
    >
      {props.children}
    </AppManager.Provider>
  );
};

export default AppManager;
