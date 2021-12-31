import React, { useContext } from 'react'
import { useReducer } from 'react'
import Button from '../../components/UI/Button'
import Input from '../../components/UI/Input'
import Select from '../../components/UI/Select'

import classes from './ReceivePayments.module.css';

import AppManager from '../../store/app-manager'


const formStateReducer = (currentState, action)=>{
    if(action.type==="amount-change"){
        let newAmount = parseInt(action.value);
        let isAmountValid = newAmount>0?true:false
        console.log("is amount valid",isAmountValid);
        return{
            ...currentState,
            amount:newAmount,
            isAmountValid: isAmountValid,
            isFormValid: isAmountValid && currentState.isFromValid && currentState.isDateValid
        }
    }
    if(action.type==="from-change"){
        let newFrom = action.value;
        let isFromValid = action.value!=="---";
        console.log("is from valid",isFromValid);
        return{
            ...currentState,
            from:newFrom,
            isFromValid: isFromValid,
            isFormValid: isFromValid && currentState.isAmountValid && currentState.isDateValid
        }
    }
    if(action.type==="date-change"){
        let newDate = action.value;
        let isDateValid = action.value!==null;
        console.log("isdatevalid", isDateValid);
        return{
            ...currentState,
            date:newDate,
            isDateValid: isDateValid,
            isFormValid: isDateValid && currentState.isAmountValid && currentState.isFromValid
        }
    }

    if(action.type==='reset'){
        console.log("resetting payment data");
        return {
            amount:"",
            isAmountValid:false,
            from:"---",
            isFromValid:false,
            date:"",
            isDateValid:false,
    
            isFormValid:false
        } 
    }
    //if all fails, this will be returned
    //this is used to that app doesn't break
    return {
        amount:null,
        isAmountValid:false,
        from:null,
        isFromValid:false,
        date:null,
        isDateValid:false,

        isFormValid:false
    }
}
function ReceivePayments() {

    const AppManagerContext = useContext(AppManager);
    
    const[formState, formStateDispatch] = useReducer(formStateReducer,{
        amount:null,
        isAmountValid:false,
        from:null,
        isFromValid:false,
        date:null,
        isDateValid:false,
        
        isFormValid:false
    })


    const sendPaymentDataToServer = async (data)=>{
        const response = await fetch("https://genxtutorial.com/api2/payment/payment-receive/index.php",{
            method:"POST",
            headers:{"Content-Type":'application/json'},
            body:JSON.stringify(data)
        })

        const responseJSON = await response.json();

        if(responseJSON.status){
            AppManagerContext.showPrompt("success","Payment Taken");
            formStateDispatch({type:"reset"});
            AppManagerContext.updateAppData();
        }else{
            AppManagerContext.showPrompt("error","Couldn't Receive Payment");
        }

    }
    const formOnSubmitHandler = (e)=>{
        e.preventDefault();
        console.log("form submitted");

        //the API requires us to send all the payments into an array
        let paymentArray = [];

        let receiveFrom = "";

        if(formState.from==="Medical Store"){
            receiveFrom="medical"
        }else if(formState.from==="Dispensary"){
            receiveFrom="dispensary"
        }

        console.log(formState.date)
        let paymentObject = {
            total_amount:formState.amount,
            receive_from:receiveFrom,
            money_receive_date:formState.date
        };

        paymentArray.push(paymentObject);

        sendPaymentDataToServer(paymentArray);
    }

    const amountOnChangeHandler = (e)=>{
        formStateDispatch({type:"amount-change",value:e.target.value})
        console.log("amount changed");
    }
    const fromOnChangeHandler = (e)=>{
        formStateDispatch({type:"from-change",value:e.target.value})
        console.log("from changed");
    }
    const dateOnChangeHandler = (e)=>{
        formStateDispatch({type:"date-change",value:e.target.value})
        console.log("date changed");
    }

    console.log(formState.isFormValid)
    return (
      <div className={classes["receive-payments-container"]}>
        <form onSubmit={formOnSubmitHandler}>
          <div className={classes["receive-payments-section"]}>
            <Input
              name="Amount"
              type="number"
              value={formState.amount}
              onChange={amountOnChangeHandler}
              className={classes["input-container"]}
            ></Input>
          </div>

          <div className={classes["receive-payments-section"]}>
            <p>From</p>
            <Select
              options={["---", "Medical Store", "Dispensary"]}
              value={formState.from === null ? "---" : formState.from}
              onChange={fromOnChangeHandler}
            />
          </div>

          <div className={classes["receive-payments-section"]}>
            <Input
              name="Date"
              type="date"
              value={formState.date}
              onChange={dateOnChangeHandler}
              className={classes["input-container"]}
            ></Input>
          </div>

          <Button
            name="Submit"
            type="submit"
            disabled={!formState.isFormValid}
            className={
              formState.isFormValid
                ? classes["submit-button-active"]
                : classes["submit-button-disabled"]
            }
            disabled={formState.isFormValid ? false : true}
          ></Button>
        </form>
      </div>
    );
}

export default ReceivePayments
