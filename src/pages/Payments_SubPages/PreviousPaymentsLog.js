import React from 'react'
import Button from '../../components/UI/Button'

import classes from './PreviousPaymentsLog.module.css';

function PreviousPaymentLog(props) {
    

    return (
      <div className={classes["previous-payments-log-container"]}>
        <div className={classes["cancel-button-container"]}>
          <Button name="X" id={props.data.transaction_no} onClick={props.onDelete}></Button>
        </div>
        <table>
          <tbody>
            <tr>
              <td>Transaction No:</td>
              <td>{props.data.transaction_no}</td>
            </tr>
            <tr>
              <td>Amount:</td>
              <td>{props.data.total_amount}</td>
            </tr>
            <tr>
              <td>Received From:</td>
              <td>{props.data.receive_from}</td>
            </tr>
            <tr>
              <td>Date:</td>
              <td>{props.data.money_receive_date}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
}

export default PreviousPaymentLog
