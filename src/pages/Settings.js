import React from 'react'

import classes from './Settings.module.css';
import {Link} from 'react-router-dom';

function Settings() {
    return (
      <div className={classes['settings-container']}>
        <div className={classes['heading']}>
          <h1>Settings</h1>
        </div>
        <div className={classes['settings-links-container']}>
          <div className={classes['link-container']}>
            <i class="fas fa-archive"></i>
            <Link to="/inventory/settings/packages">Package</Link>
          </div>
          <div className={classes['link-container']}>
            <i class="fas fa-boxes"></i>
            <Link to="/inventory/settings/products">Products</Link>
          </div>
        </div>
      </div>
    );
}

export default Settings
