const auth = require('../auth');
const Game = require('./game');

class Lobby {
    constructor() {
        this.players = [];
        this.playerGame = [];
        this.gamesData = [];
        /*      gameName: gameName,
                playerName: playerName,
                maxPlayers: numOfPlayers,
                numOfPlayers: 0,
                active: false,
                players: []
                */
    }

    fetchPlayers = () => {
        this.players = auth.getAllUsers();
    }

    addGame = (gameName, playerId, numOfPlayers) => {
        if (this.gamesData.find(game => game.gameName === gameName)) {
            return 103;
        }
        else {
            const playerName = auth.getUserInfo(playerId).name;
            this.gamesData.push({
                gameName: gameName,
                playerName: playerName,
                maxPlayers: numOfPlayers,
                numOfPlayers: 0,
                active: false
            });
            return 200;
        }
    }

    deleteGame = (gameName) => {
        const gameIndex = this.gamesData.findIndex(game => game.gameName === gameName);
        if (gameIndex < 0) {
            return 404;
        }
        else if (this.gamesData[gameIndex].active === false &&
            this.gamesData[gameIndex].numOfPlayers === 0) {
            this.gamesData.splice(gameIndex, 1);
        }
        return 200;
    }

    joinGame = (gameName, playerId) => {
        const gameIndex = this.gamesData.findIndex(game => game.gameName === gameName);
        if (this.gamesData[gameIndex].numOfPlayers >= this.gamesData[gameIndex].maxPlayers) {
            this.gamesData[gameIndex].active = true;
            return 102;
        }
        else if(this.playerGame[playerId] !== undefined){
            return 400;
        }
        else {
            this.gamesData[gameIndex].numOfPlayers++;
            if (this.gamesData[gameIndex].numOfPlayers == this.gamesData[gameIndex].maxPlayers) {
                this.gamesData[gameIndex].active = true;
            }
            this.playerGame[playerId] = gameName;
        }
        return 200;
    }

    exitGame = (gameName, playerId) => {
        const gameIndex = this.gamesData.findIndex(game => game.gameName === gameName);
        // if(this.playerGame[playerId] === undefined || this.gamesData[gameIndex].active){
        //     return 400;
        // }
        this.gamesData[gameIndex].numOfPlayers--;
        if(this.gamesData[gameIndex].numOfPlayers === 0){
            this.gamesData[gameIndex].active = false;
        }
        this.playerGame[playerId] = undefined;
        return 200;
    }

    getGameNameByPlayerId = (playerId) => {
        return this.playerGame[playerId];
    }

    getPlayers = () => {
        this.fetchPlayers();
        return this.players;
    }

    getGames = () => {
        return this.gamesData;
    }

}

module.exports = Lobby;