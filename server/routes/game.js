const path = require('path');

const express = require('express');

const router = express.Router();

const gameController = require('../controllers/game');

router.get('/', gameController.getGame);

router.get('/isActive', gameController.getIsGameActive);

router.post('/addGame', gameController.postAddGame);

router.post('/deleteGame', gameController.postDeleteGame);

router.post('/joinGame', gameController.postJoinGame);

router.post('/exitGame', gameController.postExitGame);

router.post('/tileClick', gameController.postTileClick);

router.post('/placeholderClick', gameController.postPlaceholderClick);

router.post('/deckClick', gameController.postDeckClick);

router.get('/statistic', gameController.getStatistic);

module.exports = router;