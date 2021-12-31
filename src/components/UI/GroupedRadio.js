import React from "react";

function GroupedRadio(props) {

  //name = name that should be present in all radios for it to work
  //labelNameList = list of all names to be displayed in labels
  let radioHolder = [];

  const onChangeHandler = (e) => {
      props.onChange(e.target.value);
  };

  for (let i = 0; i < props.labelNameList.length; i++) {
    let newRadio = (
      <React.Fragment key={Math.random()}>
        <input
          name={props.name}
          id={i.toString()}
          type="radio"
          key={Math.random()}
          value={props.labelNameList[i]}
          checked={props.selectedOption===props.labelNameList[i]}
          onChange={onChangeHandler}
        ></input>
        <label htmlFor={i.toString()} key={Math.random()} onChange={onChangeHandler}>
          {props.labelNameList[i]}
        </label>
      </React.Fragment>
    );

    radioHolder.push(newRadio);
  }
  return <div className={props.className}>{radioHolder}</div>;
}

export default GroupedRadio;
