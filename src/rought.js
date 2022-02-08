import { useState } from "react/cjs/react.development";

function GrandPerson (){
    const [age,setAge] = useState(99);

    const [childInputValue,setChildInputValue] = useState(0);

    function liftState(value){
        setChildInputValue(value)
    }

    <Person liftState={liftState}/>
}




function Person(props){

    
    const [inputValue, setInputValue] = useState("Sachin");

    props.liftState(inputValue)

    inputOnChangeHandler = (e)=>{
        let value = e.target.value;
        setInputValue(value);
    }

    return (
      <React.Fragment>
        <input onChange={inputOnChangeHandler()} value={inputValue}></input>
      </React.Fragment>
    );
}


