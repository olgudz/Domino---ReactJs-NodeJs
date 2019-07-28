import React from 'react';
import './PlayerData.css';


const playerData = (props) => {
    return (
        <div className="PlayerData">
            {props.children}
        </div>
    );
};

export default playerData;