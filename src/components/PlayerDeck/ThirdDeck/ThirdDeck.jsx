import React from 'react';
import './ThirdDeck.css';
import Tile from '../../Tile/Tile';

const thirdDeck = (props) => {
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
    const name = props.name ? props.name : ""
    return (
        <div className="ThirdWrapper">
            <div className="ThirdDeck">
            <div className="ThirdName">{name}</div>
                {cards}
            </div>
        </div>
    );
}

export default thirdDeck;