import React from 'react'
import Button from '../../../components/UI/Button';

function PackageItem(props) {
    console.log("rendering packageItems");
    console.log(props.className);
    return (
        <div className={props.className}>
            <p className="index">{props.index+1}.</p>
            <p className="name">{props.name}</p>
            
            <Button name="x" onClick={props.onDelete} id={props.index}></Button>
        </div>
    )
}

export default PackageItem
