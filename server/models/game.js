const auth = require('../auth');
const Player = require('./player');

class Game {
    constructor(gameName, numOfMaxPlayers) {
        this.gameName = gameName;
        this.numOfMaxPlayers = numOfMaxPlayers;
        this.numOfPlayers = 0;
        this.active = false;
        this.players = [];
        this.currentPlayer = 0;  //index
        this.deck = [];
        this.selectedTile = "";
        this.playgroundDeck = [];
        this.ends = [];
        this.possibleChoices = [];
        this.winner = "";
        this.winner2 = ""; //if there are 3 players
    }

    getStatistic = () => {
        const statistic = [];
        for (let i = 0; i < this.players.length; i++) {
            let name = this.players[i].getName();
            let turns = this.players[i].getTurns();
            let avg = this.players[i].getAverage();
            let draw = this.players[i].getPulledFromDeck();
            let score = this.players[i].getScore();
            statistic.push({
                name: name,
                turns: turns,
                average: avg,
                drawFromStock: draw,
                score: score
            });
        }

        return statistic;
    }

    getWinner = () => {
        return this.winner;
    }

    getWinner2 = () => {
        return this.winner2;
    }

    getCurrent = () => {
        return this.players[this.currentPlayer].getName();
    }

    getDeck = () => {
        return this.deck;
    }

    getPlaygroundDeck = () => {
        return this.playgroundDeck;
    }

    getPossibleChoices = () => {
        return this.possibleChoices;
    }

    getEnds = () => {
        return this.ends;
    }

    getName = () => {
        return this.gameName;
    }

    getNumOfMaxPlayers = () => {
        return this.numOfMaxPlayers;
    }

    getNumOfPlayers = () => {
        return this.numOfPlayers;
    }

    getPlayers = () => {
        return this.players;
    }

    getSelectedTile = () => {
        return this.startGame.selectedTile;
    }

    isActive = () => {
        return this.active;
    }

    addPlayer = (playerId) => {
        const playerName = auth.getUserInfo(playerId).name;
        this.players.push(new Player(playerId, playerName));
        this.numOfPlayers++;
        if (this.numOfPlayers == this.numOfMaxPlayers) {
            this.startGame();
        }
    }

    removePlayer = (playerId) => {
        const index = this.players.findIndex(player => player.getId() === playerId);
        if (index < 0) {
            return 400;
        }
        this.players.splice(index, 1);
        this.numOfPlayers--;
        return 200;
    }

    changeTurn = () => {
        let newCurrent = (this.currentPlayer + 1) % (this.players.length);
        if (!this.players[newCurrent].isActive()) {
            newCurrent = (this.currentPlayer + 2) % (this.players.length);
        }
        this.currentPlayer = newCurrent;
    }

    startGame = () => {
        this.currentPlayer = 0;  //index
        this.deck = [];
        this.selectedTile = "";
        this.playgroundDeck = [];
        this.ends = [];
        this.possibleChoices = [];
        this.winner = "";
        this.winner2 = ""; //if there are 3 players
        this.active = true;
        const newDeck = [];
        let tileName;
        for (let i = 0; i < 7; i++) {
            for (let j = i; j < 7; j++) {
                tileName = i + "" + j;
                newDeck.push(tileName);
            }
        }
        for (var p = 0; p < this.players.length; p++) {
            for (let i = 0; i < 6; i++) {
                let index = Math.floor(Math.random() * (28 - p * 6 - i));
                let tile = newDeck[index];
                this.players[p].addTile(tile);
                newDeck.splice(index, 1);
            }
        }
        this.deck = [...newDeck];
    }

    clickPlayerTile = (playerId, eventTargetId) => {
        if (this.players[this.currentPlayer].getId() != playerId) return 102;
        let player = this.players.find(p => p.getId() === playerId);
        player.startTimer();
        let newPlayerDeck = player.getDeck();

        let index;
        for (let i = 0; i < newPlayerDeck.length; i++) {
            if (newPlayerDeck[i] === eventTargetId) {
                index = i;
                break;
            }
        }
        if (!this.playgroundDeck.length) {
            this.firstClickPlayerTile(playerId, newPlayerDeck, eventTargetId, index);
        } else {
            this.selectedTile = eventTargetId;
        }
        this.setPossibleChoices(eventTargetId);
        return 200;
    }

    setPossibleChoices = (selectedTile) => {
        const ends = [...this.ends];
        let firstNum = selectedTile.charAt(0);
        let secondNum = selectedTile.charAt(1);
        let newPossibleChoices = [];
        let tmpArray = [];
        for (let i = 0; i < ends.length; i++) {
            if (ends[i].name === firstNum && firstNum === secondNum) {    //mm,nn
                if (ends[i].direction === "right" || ends[i].direction === "left") {
                    tmpArray = this.addVerticalTileDouble(ends[i], selectedTile);
                }
                else if (ends[i].direction === "up" || ends[i].direction === "down") {
                    tmpArray = this.addHorizontalTileDouble(ends[i], selectedTile);
                }
                else { console.log("Error! in setPossibleChoices"); }
                newPossibleChoices = newPossibleChoices.concat(tmpArray);
            }
            else if (ends[i].name === firstNum) {  //m* , n*
                if (ends[i].direction === "right" || ends[i].direction === "left") {
                    tmpArray = this.addHorizontalTile_1(ends[i], selectedTile);
                }
                else if (ends[i].direction === "up" || ends[i].direction === "down") {
                    tmpArray = this.addVerticalTile_1(ends[i], selectedTile);
                }
                else { console.log("Error! in setPossibleChoices"); }
                newPossibleChoices = newPossibleChoices.concat(tmpArray);
            }
            else if (ends[i].name === secondNum) { //*m, *n
                if (ends[i].direction === "right" || ends[i].direction === "left") {
                    tmpArray = this.addHorizontalTile_2(ends[i], selectedTile);
                }
                else if (ends[i].direction === "up" || ends[i].direction === "down") {
                    tmpArray = this.addVerticalTile_2(ends[i], selectedTile);
                }
                else { console.log("Error! in setPossibleChoices"); }
                newPossibleChoices = newPossibleChoices.concat(tmpArray);
            }
            else { }
        }

        this.possibleChoices = newPossibleChoices;
    }

    firstClickPlayerTile = (playerId, newPlayerDeck, id, index) => {
        let player = this.players.find(p => p.getId() === playerId);

        const xPos = 500;
        const yPos = 300;
        const newPlaygroundDeck = [{
            name: id,
            xPos: xPos,
            yPos: yPos,
            classes: "Horizontal"
        }];

        newPlayerDeck.splice(index, 1);

        let newEnds = [];

        const tileEnd1 = {
            name: id.charAt(0),
            xPos: xPos,
            yPos: yPos,
            direction: "left"
        };

        const tileEnd2 = {
            name: id.charAt(1),
            xPos: xPos + 80,
            yPos: yPos,
            direction: "right"
        };

        newEnds.push(tileEnd1, tileEnd2);
        if (tileEnd1.name === tileEnd2.name) {
            const tileEnd3 = {
                name: id.charAt(0),
                xPos: xPos + 20,
                yPos: yPos,
                direction: "up"
            };

            const tileEnd4 = {
                name: id.charAt(0),
                xPos: xPos + 20,
                yPos: yPos + 40,
                direction: "down"
            };
            newEnds.push(tileEnd3, tileEnd4);
        }

        player.updateTurns();
        player.setDeck(newPlayerDeck);
        this.playgroundDeck = newPlaygroundDeck;
        this.ends = newEnds;
        player.stopTimer();
        this.changeTurn();
    }

    placeholderClick = (playerId, left, top, className) => {
        let player = this.players.find(p => p.getId() === playerId);
        let newPlayerDeck = player.getDeck();
        let newEnds = [...this.ends];
        let newPlaygroundDeck = [...this.playgroundDeck];

        let xPos = Number(this.cutNumberFromString(left));
        let yPos = Number(this.cutNumberFromString(top));

        let classes = this.firstWordOfString(className);

        let newAddedTile = {
            name: this.selectedTile,
            xPos: xPos,
            yPos: yPos,
            classes: classes
        }

        newPlaygroundDeck.push(newAddedTile);

        let index;
        for (let i = 0; i < newPlayerDeck.length; i++) {
            if (newPlayerDeck[i] === this.selectedTile) {
                index = i;
                break;
            }
        }
        newPlayerDeck.splice(index, 1);

        ///updateEnds
        for (let i = 0; i < newEnds.length; i++) {
            if ((Number(newEnds[i].xPos) === (xPos + 20)) && (Number(newEnds[i].yPos) === (yPos + 40))) {
                this.setEndUpDouble(xPos, yPos, i);
                break;
            }
            else if ((Number(newEnds[i].xPos) === (xPos + 20)) && (Number(newEnds[i].yPos) === yPos)) {
                this.setEndDownDouble(xPos, yPos, i);
                break;
            }
            else if ((Number(newEnds[i].xPos) === (xPos + 40)) && (Number(newEnds[i].yPos) === (yPos + 20))) {
                this.setEndLeftDouble(xPos, yPos, i);
                break;
            }
            else if ((Number(newEnds[i].xPos) === xPos) && (Number(newEnds[i].yPos) === (yPos + 20))) {
                this.setEndRightDouble(xPos, yPos, i);
                break;
            }
            else if ((Number(newEnds[i].yPos) === (yPos + 80)) && (Number(newEnds[i].xPos) === xPos)) {
                this.setEndUpSingle(xPos, yPos, i);
                break;
            }
            else if ((Number(newEnds[i].xPos) === (xPos + 80)) && (Number(newEnds[i].yPos) === yPos)) {
                this.setEndLeftSingle(xPos, yPos, i);
                break;
            }
            else if ((Number(newEnds[i].yPos) === yPos) && (Number(newEnds[i].xPos) === xPos)) {
                if (newEnds[i].direction === "down") {
                    this.setEndDownSingle(xPos, yPos, i);
                    break;
                }
                else if (newEnds[i].direction === "right") {
                    this.setEndRightSingle(xPos, yPos, i);
                    break;
                }
            }
        }
        this.possibleChoices = [];
        this.playgroundDeck = newPlaygroundDeck;
        this.selectedTile = "";
        player.updateTurns();
        player.setDeck(newPlayerDeck);
        player.stopTimer();
        this.checkEndOfGame(player);
        this.changeTurn();
        return 200;
    }

    checkEndOfGame = (currentPlayer) => {
        if (!this.active) return;
        if (currentPlayer.getDeck().length === 0) {
            if (this.winner === "") {
                this.winner = currentPlayer.getName();
                if (this.numOfMaxPlayers == 2) {
                    this.active = false;
                }
            }
            else {
                this.winner2 = currentPlayer.getName();
                this.active = false;
            }
            currentPlayer.setNotActive();
        }
        else if (this.deck.length === 0) {
            this.emptyDeck();
        }
    }

    emptyDeck = () => {
        let newCurrentIndex = (this.currentPlayer + 1) % (this.players.length);
        if (!this.players[newCurrentIndex].isActive()) {
            newCurrentINdex = (this.currentPlayer + 2) % (this.players.length);
        }
        let newCurrent = this.players[newCurrentIndex];
        let playerValues = newCurrent.getValues();
        let ends = this.ends;
        let result = false;
        for (let i = 0; i < ends.length; i++) {
            for (let j = 0; j < playerValues.length; j++) {
                if (ends[i] === playerValues[j]) {
                    result = true;
                    break;
                }
            }
            if (result) break;
        }
        if (!result) {
            this.changeTurn();
            newCurrentIndex = (this.currentPlayer + 1) % (this.players.length);
            if (!this.players[newCurrentIndex].isActive()) {
                newCurrentINdex = (this.currentPlayer + 2) % (this.players.length);
            }
            newCurrent = this.players[newCurrentIndex];
            playerValues = newCurrent.getValues();
            ends = this.ends;
            result = false;
            for (let i = 0; i < ends.length; i++) {
                for (let j = 0; j < playerValues.length; j++) {
                    if (ends[i] === playerValues[j]) {
                        result = true;
                        break;
                    }
                }
                if (result) break;
            }
            if (!result) this.active = false;
        }
    }

    deckClick = (playerId) => {
        const isCanPull = this.isCanPullFromDeck(playerId);
        if (isCanPull) {
            let player = this.players.find(p => p.getId() === playerId);
            player.startTimer();
            let newPlayerDeck = player.getDeck();
            let newDeck = [...this.deck];

            let index = Math.floor(Math.random() * newDeck.length);
            let tile = newDeck[index];
            newPlayerDeck.push(tile);
            newDeck.splice(index, 1);

            this.selectedTile = "";
            this.deck = newDeck;
            player.setDeck(newPlayerDeck);
            player.updateTurns();
            player.updatePulledFromDeck();
            player.stopTimer();
            this.changeTurn();
            return 200;
        }
        else {
            return 103;
        };
    }

    addVerticalTile_1 = (end, name) => { //m*, n* 
        let xPos = end.xPos;
        let yPos;
        let classes;
        if (end.direction === "up") {   //m*
            yPos = end.yPos - 80;
            classes = "VerticalInverted";
        }
        else {                         //n*
            yPos = end.yPos;
            classes = "Vertical";
        }
        let newPossibleChoice = [{
            name: name,
            xPos: xPos,
            yPos: yPos,
            classes: classes
        }];

        return newPossibleChoice;
    }

    addVerticalTile_2 = (end, name) => { //*m, *n
        let xPos = end.xPos;
        let yPos;
        let classes;

        if (end.direction === "up") {   //*m
            yPos = end.yPos - 80;
            classes = "Vertical";
        }
        else {                         //*n
            yPos = end.yPos;
            classes = "VerticalInverted";
        }

        let newPossibleChoice = [{
            name: name,
            xPos: xPos,
            yPos: yPos,
            classes: classes
        }];

        return newPossibleChoice;
    }

    addHorizontalTile_1 = (end, name) => { //m*, n*
        let xPos;
        let yPos = end.yPos;
        let classes;

        if (end.direction === "left") {   //m*
            xPos = end.xPos - 80;
            classes = "HorizontalInverted";
        }
        else {                          //n*
            xPos = end.xPos;
            classes = "Horizontal";
        }

        let newPossibleChoice = [{
            name: name,
            xPos: xPos,
            yPos: yPos,
            classes: classes
        }];

        return newPossibleChoice;
    }

    addHorizontalTile_2 = (end, name) => { //*m, *n
        let xPos;
        let yPos = end.yPos;
        let classes;

        if (end.direction === "left") {   //*m
            xPos = end.xPos - 80;
            classes = "Horizontal";
        }
        else {                            //*n
            xPos = end.xPos;
            classes = "HorizontalInverted";
        }

        let newPossibleChoice = [{
            name: name,
            xPos: xPos,
            yPos: yPos,
            classes: classes
        }];

        return newPossibleChoice;
    }

    addHorizontalTileDouble = (end, name) => { //mm, nn    
        let xPos = end.xPos - 20;
        let yPos;
        let classes = "Horizontal"

        if (end.direction === "up") {
            yPos = end.yPos - 40;
        }
        else {
            yPos = end.yPos;
        }
        let newPossibleChoice = [{
            name: name,
            xPos: xPos,
            yPos: yPos,
            classes: classes
        }];

        return newPossibleChoice;
    }

    addVerticalTileDouble = (end, name) => { //mm, nn    
        let xPos;
        let yPos = end.yPos - 20;
        let classes = "Vertical";

        if (end.direction === "left") { //mm
            xPos = end.xPos - 40;
        }
        else {                        //nn
            xPos = end.xPos;
        }
        let newPossibleChoice = [{
            name: name,
            xPos: xPos,
            yPos: yPos,
            classes: classes
        }];

        return newPossibleChoice;
    }

    isCanPullFromDeck = (playerId) => {
        let player = this.players.find(p => p.getId() === playerId);
        let ends = [...this.ends];
        let playerValues = player.getValues();
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

    setEndUpSingle = (xPos, yPos, index) => {
        let newEnds = [...this.ends];
        let newEndName;
        if (newEnds[index].name === this.selectedTile.charAt(1))
            newEndName = this.selectedTile.charAt(0);

        else
            newEndName = this.selectedTile.charAt(1);

        if (yPos - 80 > 0 && this.isFreeSpace(xPos, yPos - 80, xPos + 40, yPos)) {
            newEnds[index].name = newEndName;
            newEnds[index].xPos = xPos;
            newEnds[index].yPos = yPos;
        }
        else {
            newEnds.splice(index, 1);
        }

        this.ends = newEnds;
    }

    setEndDownSingle = (xPos, yPos, index) => {
        let newEnds = [...this.ends];
        let newEndName;

        if (newEnds[index].name === this.selectedTile.charAt(1))
            newEndName = this.selectedTile.charAt(0);
        else
            newEndName = this.selectedTile.charAt(1);

        if (this.isFreeSpace(xPos, yPos + 80, xPos + 40, yPos + 160)) {
            newEnds[index].name = newEndName;
            newEnds[index].yPos = yPos + 80;
            newEnds[index].xPos = xPos;
        }
        else {
            newEnds.splice(index, 1);
        }

        this.ends = newEnds;
    }

    setEndRightSingle = (xPos, yPos, index) => {
        let newEnds = [...this.ends];
        let newEndName;
        if (newEnds[index].name === this.selectedTile.charAt(1))
            newEndName = this.selectedTile.charAt(0);
        else
            newEndName = this.selectedTile.charAt(1);

        if (this.isFreeSpace(xPos + 80, yPos, xPos + 160, yPos + 40)) {
            newEnds[index].name = newEndName;
            newEnds[index].xPos = xPos + 80;
            newEnds[index].yPos = yPos;
        }
        else {
            newEnds.splice(index, 1);
        }
        this.ends = newEnds;
    }

    setEndLeftSingle = (xPos, yPos, index) => {
        let newEnds = [...this.ends];
        let newEndName;
        if (newEnds[index].name === this.selectedTile.charAt(1))
            newEndName = this.selectedTile.charAt(0);

        else
            newEndName = this.selectedTile.charAt(1);

        if (xPos - 80 > 0 && this.isFreeSpace(xPos - 80, yPos, xPos, yPos + 40)) {
            newEnds[index].name = newEndName;
            newEnds[index].xPos = xPos;
            newEnds[index].yPos = yPos;
        }
        else {
            newEnds.splice(index, 1);
        }
        this.ends = newEnds;
    }

    setEndUpDouble = (xPos, yPos, index) => {
        let newEnds = [...this.ends];
        const newEndName = this.selectedTile.charAt(0);
        if (yPos - 80 > 0 && this.isFreeSpace(xPos + 20, yPos - 80, xPos + 60, yPos)) {
            newEnds[index].xPos = xPos + 20;
            newEnds[index].yPos = yPos;
        }
        else {
            newEnds.splice(index, 1);
        }

        const end1 = {
            name: newEndName,
            xPos: xPos + 80,
            yPos: yPos,
            direction: "right"
        };

        const end2 = {
            name: newEndName,
            xPos: xPos,
            yPos: yPos,
            direction: "left"
        };

        if (this.isFreeSpace(end1.xPos + 80, end1.yPos, end1.xPos + 160, end1.yPos + 40)) {
            newEnds.push(end1);
        }

        if (end2.xPos - 80 > 0 && this.isFreeSpace(end2.xPos - 80, end2.yPos, end2.xPos, end2.yPos + 40)) {
            newEnds.push(end2);
        }

        this.ends = newEnds;
    }

    setEndDownDouble = (xPos, yPos, index) => {
        let newEnds = [...this.ends];
        const newEndName = this.selectedTile.charAt(0);

        if (this.isFreeSpace(xPos + 20, yPos + 40, xPos + 60, yPos + 120)) {
            newEnds[index].xPos = xPos + 20;
            newEnds[index].yPos = yPos + 40;
        }
        else {
            newEnds.splice(index, 1);
        }

        const end1 = {
            name: newEndName,
            xPos: xPos + 80,
            yPos: yPos,
            direction: "right"
        };

        const end2 = {
            name: newEndName,
            xPos: xPos,
            yPos: yPos,
            direction: "left"
        };
        if (this.isFreeSpace(end1.xPos, end1.yPos, end1.xPos + 80, end1.yPos + 40)) {
            newEnds.push(end1);
        }

        if (end2.xPos - 80 > 0 && this.isFreeSpace(end2.xPos - 80, end2.yPos, end2.xPos, end2.yPos + 40)) {
            newEnds.push(end2);
        }
        this.ends = newEnds;
    }

    setEndRightDouble = (xPos, yPos, index) => {
        let newEnds = [...this.ends];
        const newEndName = this.selectedTile.charAt(0);

        if (this.isFreeSpace(xPos + 40, yPos + 20, xPos + 120, yPos + 60)) {
            newEnds[index].xPos = xPos + 40;
            newEnds[index].yPos = yPos + 20;
        }
        else {
            newEnds.splice(index, 1);
        }

        const end1 = {
            name: newEndName,
            xPos: xPos,
            yPos: yPos,
            direction: "up"
        };

        const end2 = {
            name: newEndName,
            xPos: xPos,
            yPos: yPos + 80,
            direction: "down"
        };

        if (yPos - 80 > 0 && this.isFreeSpace(xPos, yPos - 80, xPos + 40, yPos)) {
            newEnds.push(end1);
        }
        if (this.isFreeSpace(end2.xPos, end2.yPos, end2.xPos + 40, end2.yPos + 80)) {
            newEnds.push(end2);
        }

        this.ends = newEnds;
    }

    setEndLeftDouble = (xPos, yPos, index) => {
        let newEnds = [...this.ends];
        const newEndName = this.selectedTile.charAt(0);

        if (xPos - 80 > 0 && (this.isFreeSpace(xPos - 80, yPos + 20, xPos, yPos + 60))) {
            newEnds[index].xPos = xPos;
            newEnds[index].yPos = yPos + 20;
        }
        else {
            newEnds.splice(index, 1);
        }
        const end1 = {
            name: newEndName,
            xPos: xPos,
            yPos: yPos,
            direction: "up"
        };

        const end2 = {
            name: newEndName,
            xPos: xPos,
            yPos: yPos + 80,
            direction: "down"
        };

        if (end1.yPos - 80 > 0 && this.isFreeSpace(end1.xPos, end1.yPos - 80, end1.xPos + 40, end1.yPos)) {
            newEnds.push(end1);
        }
        if (this.isFreeSpace(end2.xPos, end2.yPos, end2.xPos + 40, end2.yPos + 80)) {
            newEnds.push(end2);
        }

        this.ends = newEnds;
    }

    isFreeSpace = (xLT, yLT, xRB, yRB) => {
        const playground = [...this.playgroundDeck];
        let placeToCheck = {
            xLT: 0,
            yLT: 0,
            xRT: 0,
            xRB: 0,
            yRB: 0,
            yLB: 0
        }

        let result = true;
        for (let i = 0; i < playground.length; i++) {
            placeToCheck.xLT = playground[i].xPos;
            placeToCheck.yLT = playground[i].yPos;
            if (playground[i].classes === "Horizontal" ||
                playground[i].classes === "HorizontalInverted") {
                placeToCheck.xRB = Number(playground[i].xPos) + 80;
                placeToCheck.xRT = Number(playground[i].xPos) + 80;
                placeToCheck.yRB = Number(playground[i].yPos) + 40;
                placeToCheck.yLB = Number(playground[i].yPos) + 40;
            }
            else {
                placeToCheck.xRB = Number(playground[i].xPos) + 40;
                placeToCheck.xRT = Number(playground[i].xPos) + 40;
                placeToCheck.yRB = Number(playground[i].yPos) + 80;
                placeToCheck.yLB = Number(playground[i].yPos) + 80;
            }
            if (
                (placeToCheck.xRB >= xLT && placeToCheck.xRB <= xRB &&
                    placeToCheck.yRB >= yLT && placeToCheck.yRB <= yRB) ||
                (placeToCheck.xLT >= xLT && placeToCheck.xLT <= xRB &&
                    placeToCheck.yLB >= yLT && placeToCheck.yLB <= yRB) ||
                (placeToCheck.xLT >= xLT && placeToCheck.xLT <= xRB &&
                    placeToCheck.yLT >= yLT && placeToCheck.yLT <= yRB) ||
                (placeToCheck.xRT >= xLT && placeToCheck.xRT <= xRB &&
                    placeToCheck.yLT >= yLT && placeToCheck.yLT <= yRB) ||
                (xRB >= placeToCheck.xLT && xRB <= placeToCheck.xRB &&
                    yRB >= placeToCheck.yLT && yRB <= placeToCheck.yRB) ||
                (xLT >= placeToCheck.xLT && xLT <= placeToCheck.xRB &&
                    yLT >= placeToCheck.yLT && yLT <= placeToCheck.yRB) ||
                (xLT >= placeToCheck.xLT && xRB <= placeToCheck.xRB &&
                    yLT <= placeToCheck.yLT && yRB >= placeToCheck.yRB) ||
                (placeToCheck.xLT >= xLT && placeToCheck.xRB <= xRB &&
                    placeToCheck.yLT <= yLT && placeToCheck.yRB >= yRB)
            ) {
                result = false;
                break;
            }
        }

        return result;
    }

    firstWordOfString = (str) => {
        let index = str.indexOf(" ");
        let firstWord = str.substring(0, index);
        return firstWord;
    }

    cutNumberFromString = (str) => {
        let index = str.indexOf("px");
        let number = str.substring(0, index);
        return number;
    }

}

module.exports = Game;