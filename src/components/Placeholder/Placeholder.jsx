import React from 'react';
import './Placeholder.css';

const placeholder = (props) => {
    let classes = [props.classes, "Placeholder"];
    let classesString = classes.join(" ");

    let styles = {
        position: "absolute",
        left: props.xPos,
        top: props.yPos
    };
    return (
        <div
          name={props.name}
          className={classesString}
          style={styles}
          onClick={props.click}></div>
    );
};

export default placeholder;
