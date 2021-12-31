import React, { useContext, useEffect, useState } from 'react'

import AppManager from '../../../store/app-manager';
import PackageItem from './PackageItem';
import classes from './ShowPackages.module.css';

function ShowPackages() {
    const AppManagerContext = useContext(AppManager);
    const [packageList, setPackageList] = useState(false);
    const getData = async ()=>{
        const response = await fetch("https://genxtutorial.com/api2/package-type/show/index.php");
        const responseJSON = await response.json();

        
        //setting the array to the state
        setPackageList(responseJSON);
    }
    
    useEffect(()=>{
        getData();
    },[])
    console.log(packageList);


    const deletePackageAPICall = async (data)=>{
        const response = await fetch("https://genxtutorial.com/api2/package-type/delete/index.php",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(data)
        })

        const responseJSON = await response.json();

        if(responseJSON.status){
            AppManagerContext.showPrompt("success","Package Deleted");
            AppManagerContext.updateAppData();
        }else{
            AppManagerContext.showPrompt("error","Some Error Occurred");
        }
    }
    const onDeleteHandler = (e)=>{
        const targetIndex = parseInt(e.target.dataset.id);
        //targetPackageName is the name of the package to be deleted
        const targetPackageName = packageList[targetIndex];

        let newPackageList = packageList.filter((packageName,index)=>{
            return targetIndex!=index;
        })
        setPackageList(newPackageList);

        const dataToSendToServer = {
            package_type:targetPackageName
        }
        deletePackageAPICall(dataToSendToServer);
    }
    return (
        <div className={classes['show-packages-container']}>
            {packageList?packageList.map((packageName,index)=>{
                return (
                  <PackageItem
                    name={packageName}
                    index={index}
                    className={classes["package-item-container"]}
                    onDelete={onDeleteHandler}
                  />
                );
            }):<h1>Loading</h1>}
        </div>
    )
}

export default ShowPackages
