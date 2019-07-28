import React from 'react';
import StaticticItems from './StaticticItems/StatisticItems';

import './Statistic.css';

const statistic = (props) => {
    let winner = "";
    if(props.winner === props.data.name){
        winner = "First Place"
    }
    else if(props.winner2 === props.data.name){
        winner = "Second Place"
    }
    else{
        winner = "Last Place"
    }
    return (
        <div className={props.className}>
        <StaticticItems
            winner={winner}
            name={props.data.name}
            turns={props.data.turns}
            average={props.data.average}
            drawFromStock={props.data.drawFromStock}
            score={props.data.score} />
    </div>
    )
};

export default statistic;