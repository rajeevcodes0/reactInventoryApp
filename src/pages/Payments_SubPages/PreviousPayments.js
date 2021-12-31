import React,{useState,useEffect, useContext} from 'react'

import PreviousPaymentsLog from './PreviousPaymentsLog';

import classes from './PreviousPayments.module.css';

import AppManager from '../../store/app-manager';

function PreviousPayments() {
    const AppManagerContext = useContext(AppManager);
    console.log("rendering previous payments")
    const[previousPaymentsData, setPreviousPaymentsData] = useState(false);
    const getPreviousPaymentsDataFromServer = async ()=>{
        const response = await fetch("https://genxtutorial.com/api2/payment/show-all-payments/index.php");
        const responseJSON = await response.json();

        setPreviousPaymentsData(responseJSON.reverse());
        
    }
    useEffect(()=>{
        getPreviousPaymentsDataFromServer();
    },[])
    console.log("data updated", previousPaymentsData);

    const deleteLog = async (transactionNumber)=>{
        let dataToSend = {transaction_no:transactionNumber};
        let response = await fetch("https://genxtutorial.com/api2/payment/delete-payment/index.php",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(dataToSend)
        });
        let responseJSON = await response.json();
        if(responseJSON.status){
            AppManagerContext.showPrompt("success","Log Deleted");
        }
    }
    const logOnDeleteHandler = (e)=>{
        deleteLog(e.target.dataset.id);

        let transactionNumber = parseInt(e.target.dataset.id);

        let newList = previousPaymentsData.filter((data)=>{
            console.log(data.transaction_no,transactionNumber);
            return parseInt(data.transaction_no) !== transactionNumber
        })
        setPreviousPaymentsData(newList);
    }
    return (
        <div className={classes['previous-payments-container']}>
            {
                
                previousPaymentsData?previousPaymentsData.map((data)=>{
                    return <PreviousPaymentsLog key={Math.random()} data={data} onDelete={logOnDeleteHandler}/>
                }):<h1>Loading...</h1>
            }
        </div>
    )
}

export default PreviousPayments
