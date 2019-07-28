import React, { Component} from 'react';
import './AddGame.css';

class addGame extends Component {
    state = {
        errMessage: ""
    }

    renderErrorMessage = () => {
        if (this.state.errMessage) {
            return (
                <div className="error-message">
                    {this.state.errMessage}
                </div>
            );
        }
        return null;
    }

    handleAddGame = (e) => {
        e.preventDefault();
        var gameName = e.target.elements.gameName.value;
        var numOfPlayers = e.target.elements.numOfPlayers.value;
        if (!gameName) {
            this.setState({ errMessage: "Game name can't be empty!" });
            return false;
        }
        if (numOfPlayers != 2 && numOfPlayers != 3) {
            this.setState({ errMessage: "Choose number of players!" });
            return false;
        }
        fetch('/lobby/addGame?gameName=' + gameName + '&numOfPlayers=' + numOfPlayers,
            { method: 'POST', 
            credentials: 'include' })
            .then(response => {
                if (response.ok) {
                    this.setState({ errMessage: "" });
                    fetch('/game/addGame?gameName=' + gameName + '&numOfPlayers=' + numOfPlayers,
                    { method: 'POST', 
                    credentials: 'include' })         
                } else {
                    if (response.status === 403) {
                        this.setState({ errMessage: "Game name already exist, please try another one" });
                    }
                    else if (response.status === 402) {
                        this.setState({ errMessage: "Game name can't be empty!" });
                    }
                }
            });
        return false;
    }

    render() {
        return (
            <div className="AddGame">
                <form onSubmit={this.handleAddGame} >
                    <label className="gameName" for="gameName">Game name: </label>
                    <input type="text" id="gameName" name="gameName" />
                    <label className="numOfPlayers" for="numOfPlayers">Number of players: </label>
                    <input type="radio" id="numOfPlayers" name="numOfPlayers" value="2" /> 2
                    <input type="radio" id="numOfPlayers" name="numOfPlayers" value="3" /> 3 
                    <input type="submit" value="Add a game" className="Submit" />
                </form>
                {this.renderErrorMessage()}
            </div>
        );
    }
}

export default addGame;