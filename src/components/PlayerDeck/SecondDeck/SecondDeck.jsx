import React from 'react';
import './SecondDeck.css';
import Tile from '../../Tile/Tile';

const secondDeck = (props) => {
    const cards = [];
    for (let i = 0; i < props.deck; i++) {
        cards.push(
            <Tile
                isActive="false"
                styles=""
                key={Math.random()}
                tileName="back"
                click="" />);
    }
    return (
        <div className="SecondWrapper">
            <div className="SecondDeck">
            <div className="SecondName">{props.name}</div>
                {cards}
            </div>
        </div>
    );
}

export default secondDeck;