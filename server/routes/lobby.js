const path = require('path');

const express = require('express');

const router = express.Router();

//router.use(bodyParser.urlencoded({ extended: false }));   ???

const lobbyController = require('../controllers/lobby');

router.get('/', lobbyController.getLobby);

router.post('/addGame', lobbyController.postAddGame);

router.post('/deleteGame', lobbyController.postDeleteGame);

router.post('/joinGame', lobbyController.postJoinGame);

router.post('/exitGame', lobbyController.postExitGame);

router.post('/logout', lobbyController.postLogout);

module.exports = router;