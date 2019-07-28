import React, { Component, Fragment } from 'react';
import Logout from '../Logout/Logout';
import Logo from '../Logo/Logo';
import AddGame from './AddGame/AddGame';
import Game from '../../containers/Game/Game';
import GameData from './GameData/GameData';
import PlayerData from './PlayerData/PlayerData';
import './Lobby.css';
import App from '../../containers/App';

class Lobby extends Component {
    state = {
        playerName: "",
        login: true,
        inGame: false,
        gameName: "",
        players: [],
        playerInGame: [],
        games: [],/*{ gameName:
                      playerName:
                      numOfPlayers:
                      maxPlayers:
                      active: true/false
                    }
                  */
        myTimer: 0,
    }

    createPlayersTable = () => {
        const players = { ...this.state.players };
        let table = [];
        Object.keys(players).forEach(function (key) {
            table.push(<PlayerData >{players[key]}</PlayerData>);
        });
        return table;
    }

    createGameTable = () => {
        let games = {...this.state.games};
        let table = [];
        Object.keys(games).forEach( (key) =>  {
            table.push(<GameData 
                gameName={games[key].gameName}
                creatorName={games[key].playerName}
                active={games[key].active}
                maxPlayers={games[key].maxPlayers}
                numOfPlayers={games[key].numOfPlayers}
                playerName={this.state.playerName}
                remove={() => this.deleteGameHandler(games[key])}
                join={() => this.joinGameHandler(games[key])}
                />);
        });
        return table;

    }

    joinGameHandler = (game) => {
        if (game.numOfPlayers === game.maxPlayers) return;
        const gameName = game.gameName;
        fetch('/lobby/joinGame?gameName=' + gameName, { method: 'POST', credentials: 'include' })
            .then(response => {
                if (response.status == 200) {
                    fetch('/game/joinGame?gameName=' + gameName, { method: 'POST', credentials: 'include' })
                        .then(response => response.json())
                        .then(data =>{
                            this.setState({ inGame: true, gameName: data.gameName })
                        } )
                }
            })
    }

    deleteGameHandler = (game) => {
        if (game.active || game.numOfPlayers > 0) return;
        const gameName = game.gameName;
        fetch('/lobby/deleteGame?' + 'gameName=' + gameName, { method: 'POST', credentials: 'include' })
        .then(response => {
            if (response.status == 200) {
                fetch('/game/deleteGame?' + 'gameName=' + gameName, { method: 'POST', credentials: 'include' })
            }
        })
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => {
                fetch('/users/getUser', { method: 'GET', credentials: 'include' })
                    .then(response => {
                        if (response.status != 200) {
                            this.setState({ login: false });
                            return;
                        }
                        else {
                            return response.json();
                        }
                    })
                    .then(playerName => {
                        this.setState({ playerName: playerName });
                        fetch('/lobby', { method: 'GET', credentials: 'include' })
                            .then(response => response.json())
                            .then(data => {
                                this.setState({ players: data.players, games: data.games, inGame: data.inGame });
                            });
                    })
            }, 2000);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    logoutHandler = () => {
        fetch('/lobby/logout', { method: 'POST', credentials: 'include' })
            .then(res => {
                if (res.status === 200)
                    this.setState({ login: false });
            });
    }

    render() {
        if (!this.state.login) {
            return (
                < App />
            );
        }
        else if (this.state.inGame) {
            return (
                <Game gameName={this.state.gameName}/>
            );
        }
        else {
            const players = this.createPlayersTable();
            const games = this.createGameTable();
            return (
                <Fragment>
                    <div className="LobbyHeader">
                        <Logo />
                        <Logout click={this.logoutHandler} />
                    </div>
                    <div className="Table">
                        <div className="Players">
                            <div className="Title">Players</div>
                            {players}
                        </div>

                        <div className="Games">
                            <div className="Title">Games</div>
                            {games}
                        </div>
                    </div>
                    <AddGame />
                </Fragment>
            );
        }
    }
}

export default Lobby;
