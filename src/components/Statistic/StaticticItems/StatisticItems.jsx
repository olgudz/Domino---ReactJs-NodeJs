import React from 'react';
import StatisticItem from './StatisticItem/StatisticItem';
import './StatisticItems.css';

const statisticItems = (props) => {
    return (
        <ul className="StatisticItems">
            <div className="Winner">{props.winner}</div>
            <StatisticItem value={props.name}>Player: </StatisticItem>
            <StatisticItem value={props.turns}>Turns: </StatisticItem>
            <StatisticItem value={props.average}>Average Time: </StatisticItem>
            <StatisticItem value={props.drawFromStock}>Pull from stock: </StatisticItem>
            <StatisticItem value={props.score}>Score: </StatisticItem>
        </ul>
    );
};

export default statisticItems;