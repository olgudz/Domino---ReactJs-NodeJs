import React from 'react';
import Tile from '../Tile/Tile';
import './Deck.css';

const deck = (props) => (
        !props.isEmpty ?
                <div className="Deck">
                        <Tile styles={""} click={props.click} />
                </div> : <div className="Deck" />
);

export default deck;