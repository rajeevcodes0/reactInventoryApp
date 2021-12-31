import React, { useEffect, useState, useContext } from 'react'
import TransactionItem from './TransactionItem';

import classes from './LastTransaction.module.css';

import AppManager from '../../store/app-manager';

function LastTransaction() {

    const AppManagerContext = useContext(AppManager);

    const [lastTransactionData, setLastTransactionData] = useState(false);
    const [lastTransactionDataHasBeenDeleted, setLastTransactionDataHasBeenDeleted] = useState(false);

    const getLastTransactionData = async ()=>{
        const response = await fetch(
          "https://genxtutorial.com/api2/transactions/show/index.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              no_of_transactions: 1,
            }),
          }
        );
        const responseJSON = await response.json();

        console.log(responseJSON);
        setLastTransactionData(responseJSON);
    }
    useEffect(()=>{
        getLastTransactionData();
    },[])

    const deleteTransactionAPICall = async (data)=>{

      const response = await fetch("https://genxtutorial.com/api2/transactions/delete/index.php",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(data)
      })

      const responseJSON = await response.json();

      if(responseJSON.status){
        AppManagerContext.showPrompt("success","Log Deleted");
      }
    }


    const onDeleteHandler = (e)=>{
      const transaction_no = e.target.dataset.transaction_no;
      const field_name = e.target.dataset.field_name;

      const dataToSendToServer = {
        transaction_no:transaction_no,
        field_name:field_name
      }

      deleteTransactionAPICall(dataToSendToServer);
      setLastTransactionDataHasBeenDeleted(true);
    }
    return (
      <div className={classes['last-transaction-container']}>


        {lastTransactionDataHasBeenDeleted && <div className={classes['is-item-deleted-container']}>
          
          Last Transaction Has Been Deleted
          </div>}
        {lastTransactionData   && !lastTransactionDataHasBeenDeleted &&  (

          <TransactionItem
            transaction={lastTransactionData}
            showDeleteButton={true}
            onDelete = {onDeleteHandler}
          />

        )}
        {!lastTransactionData && !lastTransactionDataHasBeenDeleted && "Loading..."}
      </div>
    );
}

export default LastTransaction
