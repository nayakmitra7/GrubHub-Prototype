import React, { Component } from 'react';
import '../../../App.css';
import cookie from 'js-cookie';
import { Redirect } from 'react-router';
import { userActions } from '../../../redux/actions/user.actions';
import { connect } from 'react-redux';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            errorMessage: []
        }
        this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
        this.fetchDetails = this.fetchDetails.bind(this);
    }
    componentDidMount() {
       
    }
    usernameChangeHandler = (e) => {
        this.setState({
            username: e.target.value
        })
    }
    passwordChangeHandler = (e) => {
        this.setState({
            password: e.target.value
        })
    }
    fetchDetails = (username) => {
       this.props.fetchDetails(username)
    }
    submitLogin = (e) => {
        e.preventDefault();
        this.fetchDetails(this.state.username);
        const { username, password } = this.state;
        this.props.login(username, password);

    }

    render() {
        let redirectVar=""
        if (cookie.get('token')) {
            redirectVar = <Redirect to="/HomePage" />
        }
        const { alert } = this.props;
        let alertMessage = [];
        if (alert.message) {
            alert.message.forEach(element => {
                alertMessage.push(<div class="alert alert-danger">{element.msg}</div>)
            });
        }
        return (
            <div>
                {redirectVar}
                {alertMessage}
                <div class="backgroundImg">
                    <div class="container">
                        <div class="login-form">
                            <div class="main-div">
                                <div class="panel">
                                    <h2 class="heading"> Sign in with your Grubhub account</h2>
                                </div>
                                <div class="form-group">
                                    <p >Email</p>
                                    <input onChange={this.usernameChangeHandler} type="text" class="form-control" name="username" />
                                </div>
                                <div class="form-group">
                                    <p>Password</p>
                                    <input onChange={this.passwordChangeHandler} type="password" class="form-control" name="password" />
                                </div>
                                <br></br>
                                <button onClick={this.submitLogin} class="btn btn-danger">Sign-In</button>
                                <br></br><br></br><br></br><br></br>
                                <a href="/signup" class="createAcc">Create your account</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
function mapState(state) {
    const { alert } = state;
    return { alert };
}
const actionCreators = {
    login: userActions.login,
    fetchDetails:userActions.fetchBasic
};

const connectedLoginPage = connect(mapState, actionCreators)(Login);
export { connectedLoginPage as Login };