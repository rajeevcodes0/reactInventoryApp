import React from 'react'

import classes from './TransactionItem.module.css';

//it receives few things
function TransactionItem(props) {
    const transactionType = props.transaction.type;
    const transactionData = props.transaction.data;

    return (
      <div className={`${classes["transaction-item-container"]} ${props.className}`}>
        {props.showDeleteButton && (
          <div className={classes["delete-button-container"]}>
            <button
              data-transaction_no={transactionData.transaction_no}
              data-field_name={transactionType}
              onClick={props.onDelete}
            >
              x
            </button>
          </div>
        )}
        {transactionType === "medicine_add" ? (
          <React.Fragment>
            <table>
              <tbody>
                <tr>
                  <td>Add</td>
                  <td>Added To Inventory</td>
                </tr>
                <tr>
                  <td>Amount</td>
                  <td>{`₹ ${transactionData.sum_total}`}</td>
                </tr>
                <tr>
                  <td>Entry Made At</td>
                  <td>{transactionData.timestamp}</td>
                </tr>
              </tbody>
            </table>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <table>
              <tbody>
                <tr>
                  <td>Type</td>
                  <td>Sold</td>
                </tr>
                <tr>
                  <td>To</td>
                  <td>{transactionData.selling_to}</td>
                </tr>
                <tr>
                  <td>Amount</td>
                  <td>{`₹ ${transactionData.sum_total}`}</td>
                </tr>
                <tr>
                  <td>Entry Made At</td>
                  <td>{transactionData.timestamp}</td>
                </tr>
                <tr>
                  <td>Date</td>
                  <td>{transactionData.selling_date}</td>
                </tr>
              </tbody>
            </table>
          </React.Fragment>
        )}
      </div>
    );
}

export default TransactionItem
