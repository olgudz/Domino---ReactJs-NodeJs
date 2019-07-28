import React from 'react';
import Button from '../../Button/Button';
import './GameData.css';

const gameData = (props) =>  {
        let joinBtn = <Button btnType="Success ButtonSmall" click={props.join}>Join</Button>;
        let deleteBtn = null;
        let active = 'no';
        if(props.creatorName === props.playerName) {
            deleteBtn = <Button btnType="Danger ButtonSmall" click={props.remove}>Delete</Button>;
        }
       
        if (props.active) {
            joinBtn = null;
            deleteBtn = null;
            active = 'yes';
        }
        return (
            <div className="GameData" >
                <div><span className="Underlined">Name:</span> {props.gameName} </div>
                <div><span className="Underlined">Creator:</span> {props.playerName} </div>
                <div><span className="Underlined">Active:</span> {active}</div>
                <div><span className="Underlined">Players:</span> 
                {props.numOfPlayers}/{props.maxPlayers}</div>
                {deleteBtn}
                {joinBtn}
            </div >
        );
}

export default gameData;