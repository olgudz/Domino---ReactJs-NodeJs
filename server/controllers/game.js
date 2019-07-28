const Game = require('../models/game');
const games = [new Game('dami', 5)];

exports.getGame = (req, res, next) => {
    const playerId = req.session.id;
    const gameName = req.query.gameName;
    const index = games.findIndex(game => game.getName() === gameName);
    const players = games[index].getPlayers();
    const numOfPlayers = games[index].getNumOfPlayers();
    const numOfMaxPlayers = games[index].getNumOfMaxPlayers();
    const isActive = games[index].isActive();
    let statistic ;
    let playerNames = [];
    let numOfTiles = [];
    let playerDeck = [];
    for (let i = 0; i < players.length; i++) {
        if (players[i].getId() !== playerId) {
            playerNames.push(players[i].getName());
            numOfTiles.push(players[i].getDeck().length);
        }
        else {
            playerNames.unshift(players[i].getName());
            playerDeck = players[i].getDeck();
            numOfTiles.unshift(playerDeck.length);
            const turns = players[i].getTurns();
            let avg = players[i].getAverage();
            const draw = players[i].getPulledFromDeck();
            const score = players[i].getScore();
            statistic = {
                turns: turns,
                average: avg,
                drawFromStock: draw,
                score: score
            };
        }
    }
    const deck = games[index].getDeck();
    const playgroundDeck = games[index].getPlaygroundDeck();
    const current = games[index].getCurrent();
    const possibleChoices = games[index].getPossibleChoices();
    const ends = games[index].getEnds();
    const selectedTile = games[index].getSelectedTile();
    const winner = games[index].getWinner();
    const winner2 = games[index].getWinner2();

    res.status(200).json({
        numOfPlayers: numOfPlayers,
        numOfMaxPlayers: numOfMaxPlayers,
        isActive: isActive,
        gameName: gameName,
        playerNames: playerNames,
        numOfTiles: numOfTiles,
        playerDeck: playerDeck,
        deck: deck,
        playgroundDeck: playgroundDeck,
        current: current,
        possibleChoices: possibleChoices,
        ends: ends,
        selectedTile: selectedTile,
        winner: winner,
        winner2: winner2,
        statistic: statistic
    });
}

exports.postAddGame = (req, res, next) => {
    const gameName = req.query.gameName;
    const numOfPlayers = req.query.numOfPlayers;
    if (games.length === 1 && games[0].getName() === "dami") {
        games.pop();
    }
    games.push(new Game(gameName, numOfPlayers));
    res.sendStatus(200);
}

exports.postDeleteGame = (req, res, next) => {
    const gameName = req.query.gameName;
    const index = games.findIndex(game => game.getName() === gameName);
    games.splice(index, 1);
    res.sendStatus(200);
}

exports.postJoinGame = (req, res, next) => {
    const playerId = req.session.id;
    const gameName = req.query.gameName;
    const index = games.findIndex(game => game.getName() === gameName);
    games[index].addPlayer(playerId);
    const numOfMaxPlayers = games[index].getNumOfMaxPlayers();
    const numOfPlayers = games[index].getNumOfPlayers();
    const players = games[index].getPlayers();
    const playerNames = [];
    const active = games[index].isActive();
    for (var i = 0; i < players.length; i++) {
        playerNames.push(players[i].getName());
    }
    res.status(200).json({
        gameName: gameName,
        numOfMaxPlayers: numOfMaxPlayers,
        numOfPlayers: numOfPlayers,
        playerNames: playerNames,
        active: active
    });

}

exports.postExitGame = (req, res, next) => {
    const playerId = req.session.id;
    const gameName = req.query.gameName;
    const index = games.findIndex(game => game.getName() === gameName);
    const status = games[index].removePlayer(playerId);
    res.sendStatus(status);
}

exports.getIsGameActive = (req, res, next) => {
    const gameName = req.query.gameName;
    const index = games.findIndex(game => game.getName() === gameName);
    const isActive = games[index].isActive();
    res.status(200).json({
        isActive: isActive
    })
}

exports.postTileClick = (req, res, next) => {
    const playerId = req.session.id;
    const gameName = req.query.gameName;
    const targetId = req.query.targetId;
    const index = games.findIndex(game => game.getName() === gameName);
    const status = games[index].clickPlayerTile(playerId, targetId);
    res.sendStatus(status);
}

exports.postPlaceholderClick = (req, res, next) => {
    const playerId = req.session.id;
    const gameName = req.query.gameName;
    const left = req.query.left;
    const top = req.query.top;
    const className = req.query.className;
    const index = games.findIndex(game => game.getName() === gameName);
    const status = games[index].placeholderClick(playerId, left, top, className);
    res.sendStatus(status);
}

exports.postDeckClick = (req, res, next) => {
    const playerId = req.session.id;
    const gameName = req.query.gameName;
    const index = games.findIndex(game => game.getName() === gameName);
    const status = games[index].deckClick(playerId);
    res.sendStatus(status);
}

exports.getStatistic = (req, res, next) => {
    const gameName = req.query.gameName;
    const index = games.findIndex(game => game.getName() === gameName);
    const statistic = games[index].getStatistic();
    res.status(200).json(statistic);
}