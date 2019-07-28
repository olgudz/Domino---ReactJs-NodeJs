import React from 'react';
import './FirstDeck.css';
import Tile from '../../Tile/Tile';

const firstDeck = (props) => {
    const deck = props.deck;
    let cards = [];
    let styles = "";
    let isActive = "";
    let button = null;
    if (props.deck !== null) {
        for (let i = 0; i < deck.length; i++) {
            if (props.active === deck[i]) {
                isActive = "Active";
            }
            else {
                isActive = "";
            }
            cards.push(
                <Tile
                    isActive={isActive}
                    styles={styles}
                    key={deck[i]}
                    tileName={deck[i]}
                    click={props.click} />);
        }
    }


    return (
        <div className="FirstDeck">
            <div className="FirstName">{props.name}</div>
            {cards}
            {button}
        </div>
    );
}

export default firstDeck;