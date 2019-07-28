import React from 'react';
import './StatisticItem.css';

const statisticItem = (props) => (
    <li className="StatisticItem">
          {props.children}{props.value}
    </li>
);

export default statisticItem;