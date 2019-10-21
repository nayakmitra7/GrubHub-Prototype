import React, { Component } from 'react';
import cookie from 'js-cookie';
import axios from 'axios';
import { Redirect } from 'react-router';
import { address } from '../../../constant';
import '../../../App.css';

class SetUpOwner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            pictures: [],
            phone: "",
            errorMessage: [],
            authFlag: true,
            readOnly: false,
            restaurantId: sessionStorage.getItem("RestaurantID"),
            restaurantName: "",
            restaurantCuisine: "",
            restaurantAddress: "",
            restaurantZipCode: "",
            errorFlag: "No update",
            updated: false,
            authFlag:true
        }
        this.firstNameChangeHandler = this.firstNameChangeHandler.bind(this);
        this.lastNameChangeHandler = this.lastNameChangeHandler.bind(this);
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.phoneChangeHandler = this.phoneChangeHandler.bind(this);
        this.updateHandler = this.updateHandler.bind(this);
        this.readOnlyHandler = this.readOnlyHandler.bind(this);
        this.restaurantNameChangeHandler = this.restaurantNameChangeHandler.bind(this);
        this.restaurantCuisineChangeHandler = this.restaurantCuisineChangeHandler.bind(this);
        this.restaurantAddressChangeHandler = this.restaurantAddressChangeHandler.bind(this);
        this.restaurantZipCodeChangeHandler = this.restaurantZipCodeChangeHandler.bind(this);
    }


    componentDidMount() {
        var data = ""
        axios.get(address + '/owner/details/' + sessionStorage.getItem("RestaurantID"),{headers: {Authorization: 'JWT '+cookie.get("token")}})
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        firstName: response.data.ownerFirstName,
                        lastName: response.data.ownerLastName,
                        email: response.data.ownerEmail,
                        phone: response.data.ownerPhone,
                        image: response.data.ownerImage,
                        restaurantName: response.data.restaurantName,
                        restaurantCuisine: response.data.restaurantCuisine,
                        restaurantAddress: response.data.restaurantAddress,
                        restaurantZipCode: response.data.restaurantZipCode
                    })
                } else if (response.status === 201) {
                    this.setState({
                        errorFlag: "Some error",
                        errorMessage: response.data
                    })
                }
            }).catch(error => {
                sessionStorage.clear();
                localStorage.clear();
                cookie.remove("token");
                this.setState({ authFlag: false })
            });
    }

    firstNameChangeHandler = (e) => {
        this.setState({
            firstName: e.target.value
        })
    }
    lastNameChangeHandler = (e) => {
        this.setState({
            lastName: e.target.value
        })
    }
    emailChangeHandler = (e) => {
        this.setState({
            email: e.target.value
        })
    }
    phoneChangeHandler = (e) => {
        this.setState({
            phone: e.target.value
        })
    }
    readOnlyHandler = () => {
        this.setState({
            readOnly: false
        })
    }
    restaurantNameChangeHandler = (e) => {
        this.setState({
            restaurantName: e.target.value
        })
    }
    restaurantCuisineChangeHandler = (e) => {
        this.setState({
            restaurantCuisine: e.target.value
        })
    }
    restaurantAddressChangeHandler = (e) => {
        this.setState({
            restaurantAddress: e.target.value
        })
    }
    restaurantZipCodeChangeHandler = (e) => {
        this.setState({
            restaurantZipCode: e.target.value
        })
    }

    promise1 = () => {

        return new Promise((resolve, reject) => {
            
        })
    }
    updateHandler = (e) => {
        e.preventDefault();
        axios.defaults.withCredentials = true;
        const data = { firstName: this.state.firstName, lastName: this.state.lastName, email: this.state.email, phone: this.state.phone, restaurantId: this.state.restaurantId, restaurantName: this.state.restaurantName, restaurantAddress: this.state.restaurantAddress, restaurantCuisine: this.state.restaurantCuisine, restaurantZipCode: this.state.restaurantZipCode };
        axios.post(address + '/owner/update', data,{headers: {Authorization: 'JWT '+cookie.get("token")}})
        .then(response => {
            if (response.status === 201) {
                this.setState({
                    errorFlag: "Some error",
                    errorMessage: response.data
                })
            }
            else if (response.status === 200) {
                sessionStorage.setItem("OwnerFirstName", this.state.firstName)
                sessionStorage.setItem("RestaurantName", this.state.restaurantName)
                this.setState({ errorFlag: "Success" })
            }
        }).catch(error => {
            sessionStorage.clear();
            localStorage.clear();
            cookie.remove("token");
            this.setState({ authFlag: false })
        });
    
    }
    render() {
        let redirectVar = "";

        if (!this.state.authFlag) {
            redirectVar = <Redirect to="/LoginOwner" />
        }
        if (this.state.errorFlag == "Success") {
            redirectVar = <Redirect to="/HomeOwner" />

        }
        let messageDisplay = "";
        if (this.state.errorFlag == "Some error") {
            messageDisplay = (this.state.errorMessage.map((error) => {
                return (<li class=" li alert-danger">{error.msg}</li>)
            }))
        } else if (this.state.errorFlag == "Success") {
            messageDisplay = (<ul class="li alert alert-success">Successfully Updated !!!</ul>);
        }

        let createDisplay = (
            <div >
                <div class="row" style={{paddingTop:'10px'}}>
                    <div class="row">
                        <div class="col-md-4">First Name </div>
                        <div class="col-md-4">Last Name</div>
                    </div>
                    <div class="row">
                        <div class="col-md-4"><input value={this.state.firstName} onChange={this.firstNameChangeHandler} type="text" class="form-control" name="firstName" readOnly={this.state.readOnly} /></div>
                        <div class="col-md-4"><input value={this.state.lastName} onChange={this.lastNameChangeHandler} type="text" class="form-control" name="lastName" readOnly={this.state.readOnly} /></div>
                    </div>
                </div>
                <div class="row" style={{paddingTop:'10px'}}>
                    <div class="row">
                        <div class="col-md-6"> Email </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4"><input onChange={this.emailChangeHandler} value={this.state.email} type="text" class="form-control email" name="email" readOnly={this.state.readOnly} /></div>
                    </div>
                </div>
                <div class="row" style={{paddingTop:'10px'}}>
                    <div class="row">
                        <div class="col-md-6"> Phone </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4"><input onChange={this.phoneChangeHandler} value={this.state.phone} type="text" class="form-control email" name="phone" readOnly={this.state.readOnly} /></div>
                    </div>
                </div>
                <div class="row" style={{paddingTop:'10px'}}>
                    <div class="row">
                        <div class="col-md-6"> Restaurant Name </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4"><input onChange={this.restaurantNameChangeHandler} value={this.state.restaurantName} type="text" class="form-control email" name="restaurantName" readOnly={this.state.readOnly} /></div>
                    </div>
                </div>
                <div class="row" style={{paddingTop:'10px'}}>
                    <div class="row">
                        <div class="col-md-6"> Restaurant Cuisine </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4"><input onChange={this.restaurantCuisineChangeHandler} value={this.state.restaurantCuisine} type="text" class="form-control email" name="restaurantCuisine" readOnly={this.state.readOnly} /></div>
                    </div>
                </div>
                <div class="row" style={{paddingTop:'10px'}}>
                    <div class="row">
                        <div class="col-md-6"> Restaurant Address </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4"><input onChange={this.restaurantAddressChangeHandler} value={this.state.restaurantAddress} type="text" class="form-control email" name="restaurantAddress" readOnly={this.state.readOnly} /></div>
                    </div>
                </div>
                <div class="row" style={{paddingTop:'10px'}}>
                    <div class="row">
                        <div class="col-md-6"> Restaurant Zip </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4"><input onChange={this.restaurantZipCodeChangeHandler} value={this.state.restaurantZipCode} type="number" class="form-control email" name="restaurantZipCode" readOnly={this.state.readOnly} /></div>
                    </div>
                </div>
                <div class="row" style={{paddingTop:'50px'}}><button type="button" onClick={this.updateHandler} class="btn btn-success btn-lg col-md-6">Set Up</button></div>
            </div>


        )

        return (
            <div>
                {redirectVar}
                <div class="row" >
                <div class="col-md-2"></div>
                    <div class="col-md-8" style={{ background: 'white', textAlign: 'center',paddingBottom:'20px' }}>
                        <h2>Congrats on getting started with GrubHub</h2>
                        <h4>In just a few steps you will be on your way of growing your business</h4>
                    </div>
                </div>
                <div class="row">
                <div class="col-md-2"></div>
                    <div class="col-md-8" style={{marginTop:'50px',background:'white',paddingBottom:'50px',paddingLeft:'150px'}}>{createDisplay}</div>
                </div>
                <div class="row"> { messageDisplay }</div>

            </div>
        )
    }
}

export default SetUpOwner;