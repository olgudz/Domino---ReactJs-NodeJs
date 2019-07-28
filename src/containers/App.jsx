import React, { Component } from 'react';
import Login from '../components/Login/Login';
import Lobby from '../components/Lobby/Lobby';

class App extends Component {
  state = {
    showLogin: true,
    resave: false,
    saveUninitialized: true,
    currentUser: {
      name: ''
    }
  };

  handleSuccessedLogin = () => {
    this.setState({ showLogin: false });
  }

  handleLoginError = () => {
    this.setState({ showLogin: true });
  }

  renderLobbyRoom = () => {
    return (
        <Lobby />
    );
  }

  componentDidMount = () => {
    this.timerID = setInterval(() => {
      fetch('/users', { method: 'GET', credentials: 'include' })
        .then(response => {
            if(response.status === 200){
              this.handleSuccessedLogin();
            }
        })
    }, 1000);
  }
  
  render() {
    if (this.state.showLogin) {
      return (
        <Login
          loginSuccessHandler={this.handleSuccessedLogin}
          loginErrorHandler={this.handleLoginError}
        />
      )
    }
    return this.renderLobbyRoom();
  }
}

export default App;
