import React from 'react';
import './Header.css';
import Logo from '../Logo/Logo';
import Deck from '../Deck/Deck';
import Button from '../Button/Button';

const header = (props) => {
    if (props.login) {
        return (
            <header className="Header">
                <Logo />
            </header>
        )
    }
    else if (props.active) {
        const minutes =  Math.floor(props.time / 60);
        const seconds = Math.floor(props.time % 60);
        const updatedTime = minutes +":"+seconds;
        return (
            <header className="Header">
                <Logo />
                <div className="Names">
                    <div className='Current'>{props.msg2}</div>
                </div>
                <Deck
                    isEmpty={props.isEmpty}
                    click={props.click} />
                <div className="HeaderStatistic">
                    <div className="StatItem">TIME : {updatedTime}</div>
                    <div className="StatItem">TURNS: {props.turns}</div>
                    <div className="StatItem">AVG  : {props.average}</div>
                    <div className="StatItem">PULLS: {props.drawFromStock}</div>
                    <div className="StatItem">SCORE: {props.score}</div>
                </div>
            </header>
        )
    }
    else {
        return (
            <header className="Header withButtons">
                <Logo />
                <Button
                    btnType={"Danger"}
                    click={props.returnToLobby}>
                    RETURN TO LOBBY
                    </Button>
            </header>
        );
    }
}

export default header;