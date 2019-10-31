import React, { Component } from 'react';
import '../../../App.css';
import cookie from 'js-cookie';
import { Redirect } from 'react-router';
import {  ownerActions } from '../../../redux/actions/owner.actions';
import { connect } from 'react-redux';

class SignUpOwner extends Component {
    constructor() {
        super();
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            errorMessage: [],
            passwordError: "",
            zipCode: "",
            restaurant: ""
        }
        this.firstNameChangeHandler = this.firstNameChangeHandler.bind(this);
        this.lastNameChangeHandler = this.lastNameChangeHandler.bind(this);
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.phoneChangeHandler = this.phoneChangeHandler.bind(this);
        this.restaurantChangeHandler = this.restaurantChangeHandler.bind(this);
        this.zipCodeChangeHandler = this.zipCodeChangeHandler.bind(this);
        this.signupHandler = this.signupHandler.bind(this);
    }
    firstNameChangeHandler = (e) => {
        this.setState({
            firstName: e.target.value
        });

    }
    lastNameChangeHandler = (e) => {
        this.setState({
            lastName: e.target.value
        });

    }
    emailChangeHandler = (e) => {
        this.setState({
            email: e.target.value
        });

    }
    phoneChangeHandler = (e) => {
        this.setState({
            phone: e.target.value
        });
    }
    zipCodeChangeHandler = (e) => {
        this.setState({
            zipCode: e.target.value
        });
    }
    restaurantChangeHandler = (e) => {
        this.setState({
            restaurant: e.target.value
        });
    }
    passwordChangeHandler = (e) => {
        this.setState({
            password: e.target.value
        });
    }
    signupHandler = (e) => {
        e.preventDefault();
        let data = { firstName: this.state.firstName, lastName: this.state.lastName, phone: this.state.phone, email: this.state.email, restaurant: this.state.restaurant, zipcode: this.state.zipCode, password: this.state.password }
       this.props.signup(data)

    }
    render() {

        let redirectVar = "";
        if (cookie.get("token")) {
            redirectVar = <Redirect to="/SetUpOwner" />
        }
        let alertMessage=[]
        const {alert} =this.props
        if (alert.message) {
            if (alert.type == "danger") {
                alert.message.forEach(element => {
                    alertMessage.push(<div class="alert alert-danger">{element.msg}</div>)
                });
            } 
        }
        return (
            <div class="backgroundImgRest">
                {redirectVar}
                <div class="container">
                    <div class="login-form">
                        <div class="main-div">
                            <div class="panel">
                                <h2 class="heading"> Create your account</h2>
                            </div>
                            <table>
                                <div class="form-group">
                                    <tr><td class="">First Name</td></tr>
                                    <tr><td class="signup"><input onChange={this.firstNameChangeHandler} type="text" class="form-control" name="firstName" /></td></tr>
                                    <br></br>
                                    <tr><td class="">Last Name</td></tr>
                                    <tr><td class="signup"><input onChange={this.lastNameChangeHandler} type="text" class="form-control" name="lastName" /></td></tr>
                                    <br></br>
                                    <tr> Email</tr>
                                    <tr><input onChange={this.emailChangeHandler} type="text" class="form-control email" name="email" /></tr>
                                    <br></br>

                                    <tr>Password</tr>
                                    <tr><input onChange={this.passwordChangeHandler} type="password" class="form-control" name="password" /></tr>
                                    <br></br>
                                    <tr>Phone</tr>
                                    <tr><input onChange={this.phoneChangeHandler} type="number" class="form-control" name="phone" /></tr>
                                    <br></br>
                                    <tr>Restaurant Name</tr>
                                    <tr><input onChange={this.restaurantChangeHandler} type="text" class="form-control email" name="restaurant" /></tr>
                                    <br></br>
                                    <tr>Restaurant Zip Code</tr>
                                    <tr><input onChange={this.zipCodeChangeHandler} type="number" class="form-control" name="ZipCode" /></tr>
                                </div>
                                <br></br>
                                <button onClick={this.signupHandler} class="btn btn-danger">Sign Up</button>
                                <br></br><br></br>
                                Have an account?
                            <a href="/LoginOwner" class="">     Log In</a>
                            </table>

                        </div>
                       

                    </div>
                </div>
                <div class="row" style={{paddingBottom:'20px',paddingLeft:'30px'}}>{alertMessage}</div>
                
            </div>
        )
    }
}
function mapState(state) {
    const { owner,alert } = state;
    return { owner,alert };
}
const actionCreators = {
    signup:ownerActions.signUp
};

const connectedSignUpOwner = connect(mapState, actionCreators)(SignUpOwner);
export { connectedSignUpOwner as SignUpOwner };
