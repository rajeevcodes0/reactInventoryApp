import React from 'react'

//creates a drop down
//receives the following:
//1.options(an array)
//2.onChange function
//3.a className
//4.value(the current value)
function Select(props) {
    
    let optionsHolder = [];
    for(let i=0;i<props.options.length;i++){
        //Math.random can cause problems in the future
        let newOption = (
          <option
            value={props.options[i]}
            key={Math.random()}
            hidden={props.options[i] === "---" ? true : false}
          >
            {props.options[i]}
          </option>
        );
        optionsHolder.push(newOption);
    }
    return (
        <select className={props.className} onChange={props.onChange} value={props.value}>
            {optionsHolder}
        </select>
    )
}

export default Select
