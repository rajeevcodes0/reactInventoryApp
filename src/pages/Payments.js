import React from 'react'
import {Switch,Route, Link} from 'react-router-dom';
import Button from '../components/UI/Button';
import classes from './Payments.module.css';

import PreviousPayments from './Payments_SubPages/PreviousPayments';
import ReceivePayments from './Payments_SubPages/ReceivePayments';
import {useLocation} from 'react-router-dom';

function Payments() {
    const location = useLocation().pathname;
    

    return (
        <div className={classes["payments-container"]}>
            <div className={classes['heading']}>
                <p>Payments</p>
            </div>
            <div className={classes['tabs-container']}>
                <ul>
                    <Link to="/inventory/payments">
                        <li className={`${classes["tab"]} ${location==="/inventory/payments" && classes['active-tab']}`}>
                            <Button name="Receive"></Button>
                        </li>
                    </Link>
                    <Link to="/inventory/payments/previous">
                    <li className={`${classes["tab"]} ${location==="/inventory/payments/previous" && classes['active-tab']}`}>
                            <Button name="Previous"></Button>
                        </li>
                    </Link>
                </ul>
            </div>
            <div className={classes['tab-content-container']}>
                <Switch>
                    <Route path="/inventory/payments" exact component={ReceivePayments}></Route>
                    <Route path="/inventory/payments/previous" exact component={PreviousPayments}></Route>
                </Switch>
            </div>
        </div>
    )
}

export default Payments
