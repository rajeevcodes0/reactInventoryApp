import React from 'react'
import Button from '../../../components/UI/Button';

import classes from './ProductItem.module.css';

function ProductItem(props) {
    console.log("rendering packageItems");

    let discountType ='';
    let discountValueNumber = parseFloat(props.discount);
    if(discountValueNumber>=0 && discountValueNumber<=5){
        discountType=classes["small-discount"];
        
    }else if(discountValueNumber>5 && discountValueNumber<=10){
        discountType=classes["medium-discount"];
    }else{
        discountType=classes["heavy-discount"];
    }
    return (
        <div className={props.className}>
            <p className="index">{props.index+1}.</p>
            <p className="name">{props.name}<span className={discountType}>({props.discount}%)</span></p>
            
            <Button name="x" onClick={props.onDelete} id={props.index}></Button>
        </div>
    )
}

export default ProductItem;
