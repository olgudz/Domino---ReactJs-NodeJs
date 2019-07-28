import React, { Component, Fragment } from 'react';
import Statistic from '../../components/Statistic/Statistic';
import Playground from '../../components/Playground/Playground';
import FirstDeck from '../../components/PlayerDeck/FirstDeck/FirstDeck';
import SecondDeck from '../../components/PlayerDeck/SecondDeck/SecondDeck';
import ThirdDeck from '../../components/PlayerDeck/ThirdDeck/ThirdDeck';
import Header from '../../components/Header/Header';
import Lobby from '../../components/Lobby/Lobby';

class Game extends Component {
    state = {
        gameName: "",
        numOfPlayers: 0,              //Registered Players
        numOfMaxPlayers: 0,           //needed players 
        deck: false,                  //false - for empty deck
        playerDeck: [],               //player tiles strings of 2 numbers
        secondPlayerDeck: 0,          //num of tiles of second player
        thirdPlayerDeck: 0,           //num of tiles of third player
        currentPlayer: "",            //name of current
        players: [],                  //names of all players
        playerValues: [],             //players values for score 
        playgroundDeck: [],           //tile on board
        isGameActive: false,          //if(true) game started and can't logout 
        isPlayerActive: true,         //for 3 players, if first player win he is not active, but game is still active
        time: 0,                      //for statistic
        statistic: {},                //object of statistic for player
        selectedTile: "",             //for choosing tile
        ends: [],                     //for saving ends tiles
        possibleChoices: [],
        returnToLobby: false,
        winner: "",
        winner2: "",
        endOfGame: false,
        displayStatistic: false,
        allStatistic: []
    }

    startTimer = () => {
        this.timer = setInterval(() => {
            this.setState((prevState) => ({ time: prevState.time + 1 }));
        }, 1000);
    }

    clickDeckHandler = () => {
        if (!this.isCanPullFromDeck()) {
            alert("You can not pull from the deck.");
        }
        else {
            fetch('/game/deckClick?gameName=' + this.state.gameName, { method: 'POST', credentials: 'include' })
                .then(response => {
                    if (response.status !== 200) {
                        alert("You can not pull from the deck.");
                    }
                })
        }

    }

    isCanPullFromDeck = () => {
        let ends = [...this.state.ends];
        let playerDeck = [...this.state.playerDeck];
        let playerValues = [];
        for (let i = 0; i < playerDeck.length; i++) {
            let tile = playerDeck[i];
            playerValues.push(tile.charAt(0));
            playerValues.push(tile.charAt(1));
        }
        let result = true;
        for (let i = 0; i < playerValues.length; i++) {
            for (let j = 0; j < ends.length; j++) {
                if (playerValues[i] === ends[j].name) {
                    result = false;
                    break;
                }
            }
        }
        return result;
    }

    clickPlayerTileHandler = (event) => {
        this.setState({ selectedTile: event.target.id });
        fetch('/game/tileClick?gameName=' + this.state.gameName + '&targetId=' + event.target.id,
            { method: 'POST', credentials: 'include' })
            .then(response => {
                if (response.status !== 200) {
                    console.log('Error in Game.jsx ClickTileHandler');
                }
            })
    }

    placeholderClickHandler = (event) => {
        fetch('/game/placeholderClick?gameName=' + this.state.gameName
            + '&left=' + event.target.style.left
            + '&top=' + event.target.style.top
            + '&className=' + event.target.className,
            { method: 'POST', credentials: 'include' })
            .then(response => {
                if (response.status !== 200) {
                    console.log('Error in Game.jsx placeholderClickHandler');
                }
            })
    }

    returnToLobby = () => {
        if (!this.state.active) {
            fetch('/lobby/exitGame?gameName=' + this.state.gameName,
                { method: 'POST', credentials: 'include' })
                .then(result => {
                    if (result.status === 200) {
                        fetch('/game/exitGame?gameName=' + this.state.gameName,
                            { method: 'POST', credentials: 'include' })
                            .then(result => {
                                if (result.status === 200) {
                                    this.setState({ returnToLobby: true })
                                }
                            })
                    }
                })
        }
    }

    endGame = () => {
        clearInterval(this.timer);
        clearInterval(this.timer2);
        this.displayStatistic();
    }

    displayStatistic = () => {
        fetch('/game/statistic?gameName=' + this.state.gameName,
            { method: 'GET', credentials: 'include' })
            .then(response => response.json())
            .then(data => {
                this.setState(
                    {
                        displayStatistic: true,
                        allStatistic: data
                    }
                );
            })

    }

    startGame = () => {

        clearInterval(this.timer1);

        this.timer2 = setInterval(
            () => {
                fetch('/game?gameName=' + this.state.gameName, { method: 'GET', credentials: 'include' })
                    .then(response => response.json())
                    .then(data => {
                        if (this.state.winner !== "" && this.state.numOfMaxPlayers === 2) {
                            this.endGame();
                        }
                        else if (this.state.winner !== "" && this.state.winner2 !== "") {
                            this.endGame();
                        }
                        this.setState({
                            gameName: data.gameName,
                            numOfMaxPlayers: data.numOfMaxPlayers,
                            numOfPlayers: data.numOfPlayers,
                            deck: data.deck,
                            playerDeck: data.playerDeck,
                            playgroundDeck: data.playgroundDeck,
                            isGameActive: data.isActive,
                            players: data.playerNames,
                            secondPlayerDeck: data.numOfTiles[1],
                            thirdPlayerDeck: data.numOfTiles[2],
                            currentPlayer: data.current,
                            winner: data.winner,
                            winner2: data.winner2,
                            ends: data.ends,
                            possibleChoices: data.possibleChoices,
                            statistic: data.statistic
                        });
                        if (data.current !== this.state.players[0]) {
                            this.setState({
                                ends: [],
                                possibleChoices: [],
                                selectedTile: ""
                            });
                        }
                        if (!data.isActive) {
                            this.endGame();
                        }
                    })

            }, 1000);
    }

    componentDidMount() {
        this.setState({ gameName: this.props.gameName });
        this.timer1 = setInterval(
            () => {
                fetch('/game/isActive?gameName=' + this.state.gameName,
                    { method: 'GET', credentials: 'include' })
                    .then(response => response.json())
                    .then(data => {
                        if (data.isActive) {
                            this.setState({ isGameActive: true });
                            if (!this.state.deck) {
                                this.startTimer();
                                this.startGame();
                            }
                        }
                    })
            }, 2000);
    }

    render() {
        if (this.state.returnToLobby) {
            return (<Lobby />)
        }
        else if (this.state.displayStatistic && this.state.numOfMaxPlayers == 2) {
            return (
                <Fragment>
                    <Header
                        msg2="GAME OVER"
                        active={false}
                        returnToLobby={this.returnToLobby}
                    />
                    <Statistic
                        className="Statistic2"
                        data={this.state.allStatistic[0]}
                        winner={this.state.winner}
                        winner2={this.state.winner2} />
                    <Statistic
                        className="Statistic2"
                        data={this.state.allStatistic[1]}
                        winner={this.state.winner}
                        winner2={this.state.winner2} />
                    <FirstDeck name="" deck={null} active={null} click={null} />
                </Fragment>
            )
        }
        else if (this.state.displayStatistic && this.state.numOfMaxPlayers == 3) {
            return (
                <Fragment>
                    <Header
                        msg2="GAME OVER"
                        active={false}
                        returnToLobby={this.returnToLobby}
                    />
                    <Statistic
                        className="Statistic3"
                        data={this.state.allStatistic[0]}
                        winner={this.state.winner}
                        winner2={this.state.winner2} />
                    <Statistic
                        className="Statistic3"
                        data={this.state.allStatistic[1]}
                        winner={this.state.winner}
                        winner2={this.state.winner2} />
                    <Statistic
                        className="Statistic3"
                        data={this.state.allStatistic[2]}
                        winner={this.state.winner}
                        winner2={this.state.winner2} />
                    <FirstDeck name="" deck={null} active={null} click={null} />
                </Fragment>
            )
        }
        else {
            return (
                <Fragment>
                    <Header
                        msg2={"Current player: " + this.state.currentPlayer}
                        time={this.state.time}
                        turns={this.state.statistic.turns}
                        average={this.state.statistic.average}
                        drawFromStock={this.state.statistic.drawFromStock}
                        score={this.state.statistic.score}
                        active={this.state.isGameActive}
                        returnToLobby={this.returnToLobby}
                        isEmpty={!this.state.deck.length}
                        click={this.clickDeckHandler} />
                    <SecondDeck
                        name={this.state.players[1]}
                        deck={this.state.secondPlayerDeck} />
                    <Playground
                        board={this.state.playgroundDeck}
                        active={this.state.isGameActive}
                        possibleChoices={this.state.possibleChoices}
                        click={this.state.isGameActive ? this.placeholderClickHandler : null} />
                    <ThirdDeck
                        name={this.state.players[2]}
                        deck={this.state.thirdPlayerDeck} />
                    <FirstDeck
                        name={this.state.players[0]}
                        deck={this.state.playerDeck}
                        active={this.state.selectedTile}
                        click={this.state.isGameActive ? this.clickPlayerTileHandler : null}
                        back={this.returnToLobby} />
                </Fragment>
            );
        }
    }
}
export default Game;
