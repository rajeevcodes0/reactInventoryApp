import React, { useContext, useState, useReducer } from 'react'
import Button from '../../../components/UI/Button';
import Input from '../../../components/UI/Input';

import classes from './AddProducts.module.css';

import AppManager from '../../../store/app-manager';

function formReducer (currentState, action){
    if (action.type === "product_name_changed") {
      let newState = {
        ...currentState,
      };

      newState.productName = action.value;
      return newState;
    }
    if(action.type==="discount_changed"){
        let discount = parseFloat(action.value);



        //we check if the discount entered is a number and is more than or equal to 0
        let isDiscountValid = false;
        if(!isNaN(discount) && discount>=0){
            isDiscountValid=true;
        }

        let newState = {
            ...currentState
        }

        newState.discount=action.value;
        newState.isDiscountValid= isDiscountValid;

        return newState;
    }

    if(action.type==='reset'){
        return {
            productName:"",
            discount:"",
            isDiscountValid: false
        }
    }
}

function AddProducts() {

    const [formState, formDispatch] = useReducer(formReducer, {
        productName:"",
        discount:"",
        isDiscountValid: false
    })

    const AppManagerContext = useContext(AppManager);

    const productNameOnChangeHandler = (e)=>{

        formDispatch({type:"product_name_changed", value:e.target.value});
    }

    const discountOnChangeHandler = (e)=>{
        formDispatch({type:"discount_changed",value:e.target.value});
    }

    const addPackageAPICall = async(data)=>{
        const response = await fetch("https://genxtutorial.com/api2/product/add/index.php",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(data)
        })


        const responseJSON = await response.json();


        if(responseJSON.status){
            AppManagerContext.showPrompt("success","Product Added");
            AppManagerContext.updateAppData();
        }else{
            if(responseJSON.reason==="Medicine already exist"){
                AppManagerContext.showPrompt("error","Medicine already exists");
            }else if(responseJSON.reason==="Internal Server Error"){
                AppManagerContext.showPrompt("error","Internal Server Error");
            }else{
                AppManagerContext.showPrompt("error","Some serious error occurred");
            }
            
        }
    }
    const onSubmitHandler = (e)=>{
        e.preventDefault();
        const dataToSendToServer = {
            product_name:formState.productName,
            discount:formState.discount
        }

        addPackageAPICall(dataToSendToServer);
        formDispatch({type:"reset"});

    }
    return (
      <div className={classes['add-packages-container']}>
        <form onSubmit={onSubmitHandler}>
          <Input name="Product Name" onChange={productNameOnChangeHandler} className={classes['input-container']} value={formState.productName}></Input>
          <Input name="Discount" onChange={discountOnChangeHandler} className={classes['input-container']} value={formState.discount}></Input>
          <Button name="Submit" type="submit" disabled={formState.productName && formState.isDiscountValid?false:true}></Button>
        </form>
      </div>
    );
}

export default AddProducts;
