

class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.tiles = [];
        this.values = [];
        this.turns = 0;
        this.pulledFromDeck = 0;
        this.active = true;
        this.time = 0;
    }

    startTimer = () => {
        this.timer = setInterval(() => {
            this.time++;
        }, 1000);
    }

    stopTimer = () => {
        clearInterval(this.timer);
    }

    getAverage = () => {
        if (this.turns === 0) return 0;
        let avg = this.time / this.turns;
        return avg.toFixed(2);
    }

    getPulledFromDeck = () => {
        return this.pulledFromDeck;
    }

    getScore = () => {
        let score = 0;
        for (let i = 0; i < this.values.length; i++) {
            score += Number(this.values[i]);
        }
        return score;
    }

    getTurns = () => {
        return this.turns;
    }

    isActive = () => {
        return this.active;
    }

    setNotActive = () => {
        this.active = false;
    }

    getId = () => {
        return this.id;
    }

    getName = () => {
        return this.name;
    }

    getDeck = () => {
        return this.tiles;
    }

    getValues = () => {
        return this.values;
    }

    setDeck = (newTiles) => {
        this.tiles = [...newTiles];
        const newValues = [];
        for (let i = 0; i < this.tiles.length; i++) {
            let tile = this.tiles[i];
            newValues.push(tile.charAt(0));
            newValues.push(tile.charAt(1));
        }
        this.values = newValues;
    }

    addTile = (tile) => {
        this.tiles.push(tile);
        this.values.push(tile.charAt(0));
        this.values.push(tile.charAt(1));
    }

    updateTurns = () => {
        this.turns++;
    }

    updatePulledFromDeck = () => {
        this.pulledFromDeck++;
    }

    removeTile = (tile) => {
        const index = this.tiles.findIndex(el => el === tile);
        this.tiles.splice(index, 1);
    }
}

module.exports = Player;




