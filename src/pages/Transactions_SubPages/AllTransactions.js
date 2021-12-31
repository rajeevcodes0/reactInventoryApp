import React, { useEffect, useState } from 'react';

import TransactionItem from './TransactionItem';
import classes from './AllTransactions.module.css';

function AllTransactions() {
    const [allTransactionsData, setAllTransactionsData] = useState(false);

    const getAllTransactionsData = async ()=>{
        const response = await fetch(
          "https://genxtutorial.com/api2/transactions/show/index.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              no_of_transactions: "all",
            }),
          }
        );
        const responseJSON = await response.json();

        console.log(responseJSON);
        setAllTransactionsData(responseJSON);
    }
    useEffect(()=>{
        getAllTransactionsData();
    },[])
    return (
      <div className={classes["all-transactions-container"]}>
        {allTransactionsData
          ? allTransactionsData.map((transaction) => {
              return (
                <TransactionItem
                  transaction={transaction}
                  className={
                    transaction.type === "medicine_add"
                      ? classes["add-log"]
                      : classes["sell-log"]
                  }
                />
              );
            })
          : "Loading..."}
      </div>
    );
}

export default AllTransactions
