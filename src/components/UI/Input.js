import React from "react";

const Input = (props) => {
  return (
    <div className={props.className}>
      <label htmlFor={props.id}>{props.name}</label>
      <input
        id={props.id}
        type={props.type}
        min={props.min}
        onChange={props.onChange}
        value={props.value}
        required={props.required && "required"}
        autoComplete="off"
      ></input>
    </div>
  );
};

export default Input;
