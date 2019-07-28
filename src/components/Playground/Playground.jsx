import React from 'react';
import './Playground.css';
import Board from '../../containers/Board/Board';

const playground = (props) => (
    <div className="Playground" >
        <Board
            board={props.board}
            active={props.active}
            possibleChoices={props.possibleChoices}
            click={props.click}
        />
    </div>
);

export default playground;