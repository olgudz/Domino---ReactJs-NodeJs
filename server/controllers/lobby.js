const auth = require('../auth');
const Lobby = require('../models/lobby');
const lobby = new Lobby();

exports.getLobby = (req, res, next) => {
    const players = lobby.getPlayers();
    const games = lobby.getGames();
    const gameId = lobby.getGameNameByPlayerId(req.session.id);
    var inGame = false;
    if (gameId !== undefined) inGame = true;

    const myJson = { players: players, games: games, inGame: inGame };
    res.status(200).json(myJson);
};

exports.postLogout = (req, res, next) => {
    const result = auth.removeUserFromAuthList(req, res, next);
    if (result === 403) {
        res.status(403).send('User does not exist');
    }
    else {
        res.sendStatus(200);
    }
}

exports.postAddGame = (req, res, next) => {
    const gameName = req.query.gameName;
    const numOfPlayers = req.query.numOfPlayers;
    const creatorId = req.session.id;
    const result = lobby.addGame(gameName, creatorId, numOfPlayers);
    res.sendStatus(result);
}

exports.postDeleteGame = (req, res, next) => {
    const gameName = req.query.gameName;
    const result = lobby.deleteGame(gameName);
    res.sendStatus(result);
}

exports.postJoinGame = (req, res, next) => {
    const gameName = req.query.gameName;
    const playerId = req.session.id;
    const result = lobby.joinGame(gameName, playerId);
    res.sendStatus(result);
}

exports.postExitGame = (req, res, next) => {
    const gameName = req.query.gameName;
    const playerId = req.session.id;
    const status = lobby.exitGame(gameName, playerId);
    res.sendStatus(status);
}



