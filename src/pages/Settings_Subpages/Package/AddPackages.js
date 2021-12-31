import React, { useContext, useState } from 'react'
import Button from '../../../components/UI/Button';
import Input from '../../../components/UI/Input';

import classes from './AddPackages.module.css';

import AppManager from '../../../store/app-manager';

function AddPackages() {
    const AppManagerContext = useContext(AppManager);
    const [packageName, setPackageName] = useState("");

    const packageNameOnChangeHandler = (e)=>{
        const newValue = e.target.value;
        setPackageName(newValue);
    }

    const addPackageAPICall = async(data)=>{
        const response = await fetch("https://genxtutorial.com/api2/package-type/add/index.php",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(data)
        })

        const responseJSON = await response.json();

        if(responseJSON.status){
            AppManagerContext.showPrompt("success","Package Added");
            AppManagerContext.updateAppData();
        }else{
            AppManagerContext.showPrompt("error","Some Error Occurred");
        }
    }
    const onSubmitHandler = (e)=>{
        e.preventDefault();
        const dataToSendToServer = {
            package_type:packageName
        }
        addPackageAPICall(dataToSendToServer);

        setPackageName("");

    }
    return (
      <div className={classes['add-packages-container']}>
        <form onSubmit={onSubmitHandler}>
          <Input name="Enter Package Name" onChange={packageNameOnChangeHandler} className={classes['input-container']} value={packageName}></Input>
          <Button name="Submit" type="submit" disabled={packageName?false:true}></Button>
        </form>
      </div>
    );
}

export default AddPackages
