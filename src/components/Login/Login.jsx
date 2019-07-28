import React, { Component, Fragment } from 'react';
import dominoImage from '../../assets/logo5.png';
import Header from '../Header/Header';
import './Login.css'

class Login extends Component {
    state = {
        errMessage: ""
    }

    render() {
        return (
            <Fragment>
                <Header login={true}/>
                <div className="login-page-wrapper">
                    <img className="domino-logo" src={dominoImage} alt="Logo" />
                    <form onSubmit={this.handleLogin}>
                        <label className="username-label" htmlFor="userName"> Username: </label>
                        <input className="username-input" name="userName" type="text" />
                        <input className="submit-btn btn" type="submit" value="Login" />
                    </form>
                    {this.renderErrorMessage()}
                </div>
            </Fragment>

        );
    }

    renderErrorMessage = () => {
        if (this.state.errMessage) {
            return (
                <div className="login-error-message">
                    {this.state.errMessage}
                </div>
            );
        }
        return null;
    }

    handleLogin = (e) => {
        e.preventDefault();
        var userName = e.target.elements.userName.value;
        if (!userName) {
            userName = "empty";
        }
        fetch('/users/addUser?userName=' + userName, { method: 'POST', body: userName, credentials: 'include' })
            .then(response => {
                if (response.ok) {
                    this.setState({ errMessage: "" });
                    this.props.loginSuccessHandler();
                } else {
                    if (response.status === 403) {
                        this.setState({ errMessage: "User name already exist, please try another one" });
                    }
                    else if (response.status === 402) {
                        this.setState({ errMessage: "Name can't be empty!" });
                    }
                    this.props.loginErrorHandler();
                }
            });
        return false;
    }
}

export default Login;