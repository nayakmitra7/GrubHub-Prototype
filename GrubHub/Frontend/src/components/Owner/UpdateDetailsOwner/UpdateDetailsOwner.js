import React, { Component } from 'react';
import cookie from 'js-cookie';
import { Redirect } from 'react-router';
import '../../../App.css';
import { ownerActions } from '../../../redux/actions/owner.actions';
import { connect } from 'react-redux';

class UpdateDetailsOwner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            file: null,
            file2: null,
            filePreview: null,
            filePreview2: null,
            phone: "",
            errorMessage: [],
            readOnly: true,
            restaurantId: sessionStorage.getItem("RestaurantID"),
            restaurantName: "",
            restaurantCuisine: "",
            restaurantAddress: "",
            restaurantZipCode: "",
            errorFlag: "No update"
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
        this.pictureChangeHandler = this.pictureChangeHandler.bind(this)
        this.pictureChangeHandler2 = this.pictureChangeHandler2.bind(this)

    }

    componentWillReceiveProps(newProps) {
        let userDetails = newProps.owner.details;
        this.setState({
            firstName: userDetails.ownerFirstName,
            lastName: userDetails.ownerLastName,
            email: userDetails.ownerEmail,
            phone: userDetails.ownerPhone,
            image: userDetails.ownerImage,
            file: userDetails.ownerImage,
            restaurantName: userDetails.restaurantName,
            restaurantCuisine: userDetails.restaurantCuisine,
            restaurantAddress: userDetails.restaurantAddress,
            restaurantZipCode: userDetails.restaurantZipCode,
            file2: userDetails.restaurantImage
        })
    }

    componentDidMount() {
        this.props.fetchDetails();

    }
    uploadImageHandler = (e) => {
        if (this.state.file) {
            e.preventDefault();
            let formData = new FormData();
            formData.append('myImage', this.state.file, this.state.restaurantId);
            const config = {
                headers: {
                    Authorization: 'JWT ' + cookie.get("token"),
                    'content-type': 'multipart/form-data'
                }
            };
            this.props.uploadOwnerImage(formData, config);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }

    }
    uploadImageHandler2 = (e) => {
        if (this.state.file) {
            e.preventDefault();
            let formData = new FormData();
            formData.append('myImage', this.state.file2, this.state.restaurantId);
            const config = {
                headers: {
                    Authorization: 'JWT ' + cookie.get("token"),
                    'content-type': 'multipart/form-data'
                }
            };

            this.props.uploadRestaurantImage(formData, config);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }

    }
    pictureChangeHandler(event) {
        if (event.target.files[0]) {
            this.setState({
                file: event.target.files[0],
                filePreview: URL.createObjectURL(event.target.files[0])
            });
        }

    }
    pictureChangeHandler2(event) {
        if (event.target.files[0]) {
            this.setState({
                file2: event.target.files[0],
                filePreview2: URL.createObjectURL(event.target.files[0])
            });
        }

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


    updateHandler = (e) => {
        e.preventDefault();
        const data = { firstName: this.state.firstName, lastName: this.state.lastName, email: this.state.email, phone: this.state.phone, restaurantId: this.state.restaurantId, restaurantName: this.state.restaurantName, restaurantAddress: this.state.restaurantAddress, restaurantCuisine: this.state.restaurantCuisine, restaurantZipCode: this.state.restaurantZipCode, restaurantImage: this.state.file2, ownerImage: this.state.file };
        if (this.state.readOnly == false) {
            this.props.updateDetails(data)
        }
    }
    render() {
        let redirectVar = "";
        let image = <div class="img" style={{ paddingTop: '20px' }}><img style={{ width: "80%" }} src="//placehold.it/5000x3000" class="img-thumbnail" /></div>
        let uploadImage = "";
        let image2 = <div class="img" style={{ paddingTop: '20px' }}><img style={{ width: "80%" }} src="//placehold.it/5000x3000" class="img-thumbnail" /></div>
        let uploadImage2 = ""
        if (!cookie.get("token")) {
            redirectVar = <Redirect to="/LoginOwner" />
        }
        const { alert } = this.props;
        let alertMessage = [];
        if (alert.message) {
            if (alert.type == "danger") {
                alert.message.forEach(element => {
                    alertMessage.push(<div class="alert alert-danger">{element.msg}</div>)
                });
            } else if (alert.type == "success") {
                alert.message.forEach(element => {
                    alertMessage.push(<div class="alert alert-success">{element.msg}</div>)
                });
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        }
        if (this.state.filePreview) {
            image = <div class="img" style={{ paddingBottom: '20px' }}><img style={{ width: "80%" }} src={this.state.filePreview} class="img-thumbnail" onChange={this.pictureChangeHandler} /></div>
            uploadImage = <button onClick={this.uploadImageHandler}>Upload Image</button>

        } else if (this.state.file) {
            image = <div class="img" style={{ paddingBottom: '20px' }}><img style={{ width: "80%" }} src={this.state.file} class="img-thumbnail" onChange={this.pictureChangeHandler} /></div>
        }

        if (this.state.filePreview2) {
            image2 = <div class="img" style={{ paddingBottom: '20px' }}><img style={{ width: "80%" }} src={this.state.filePreview2} class="img-thumbnail" onChange={this.pictureChangeHandler2} /></div>
            uploadImage2 = <button onClick={this.uploadImageHandler2}>Upload Image</button>

        } else if (this.state.file2) {
            image2 = <div class="img" style={{ paddingBottom: '20px' }}><img style={{ width: "80%" }} src={this.state.file2} class="img-thumbnail" onChange={this.pictureChangeHandler2} /></div>
        }
        let createDisplay = (
            <div>
                <div>
                    <div class="row" style={{ paddingLeft: '250px' }}> <p><h2>Personal Information</h2></p></div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="row" style={{ paddingBottom: '0px', paddingTop: '10px' }}>
                                <div class="col-md-12">First Name</div>
                            </div>
                            <div class="row" style={{ paddingBottom: '10px', paddingTop: '10px' }}>
                                <div class="col-md-6"><input value={this.state.firstName} onChange={this.firstNameChangeHandler} type="text" class="form-control" name="firstName" readOnly={this.state.readOnly} /></div>
                            </div>
                            <div class="row" style={{ paddingBottom: '0px', paddingTop: '10px' }}>
                                <div class="col-md-12">Last Name</div>
                            </div>
                            <div class="row" style={{ paddingBottom: '10px', paddingTop: '10px' }}>
                                <div class="col-md-6"><input value={this.state.lastName} onChange={this.lastNameChangeHandler} type="text" class="form-control" name="lastName" readOnly={this.state.readOnly} /></div>
                            </div>

                            <div class="row" style={{ paddingBottom: '0px', paddingTop: '10px' }}>
                                <div class="col-md-12">Email</div>
                            </div>
                            <div class="row" style={{ paddingBottom: '10px', paddingTop: '10px' }}>
                                <div class="col-md-12"><input onChange={this.emailChangeHandler} value={this.state.email} type="text" class="form-control email" name="email" readOnly={this.state.readOnly} /></div>
                            </div>

                        </div>
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-6"><input type="file" onChange={this.pictureChangeHandler} name="" class="custom-file-input" accept="image/*" /></div>
                                <div class="col-md-6">{uploadImage}</div>
                            </div>
                            <div class="row"><div class="col-md-8">{image}</div></div>

                        </div>
                    </div>
                    <div class="row" style={{ paddingTop: 'px' }}>
                        <div class="row" style={{ paddingLeft: '250px' }}> <p><h2>Restaurant Information</h2></p></div>

                        <div class="col-md-6">
                            <div class="row" style={{ paddingBottom: '0px', paddingTop: '10px' }}>
                                <div class="col-md-12">Restaurant Phone Number</div>
                            </div>
                            <div class="row" style={{ paddingBottom: '10px', paddingTop: '10px' }}>
                                <div class="col-md-12"><input onChange={this.phoneChangeHandler} value={this.state.phone} type="text" class="form-control email" name="phone" readOnly={this.state.readOnly} /></div>
                            </div>
                            <div class="row" style={{ paddingBottom: '0px', paddingTop: '10px' }}>
                                <div class="col-md-12">Restaurant Name</div>
                            </div>
                            <div class="row" style={{ paddingBottom: '10px', paddingTop: '10px' }}>
                                <div class="col-md-12"><input onChange={this.restaurantNameChangeHandler} value={this.state.restaurantName} type="text" class="form-control email" name="restaurantName" readOnly={this.state.readOnly} /></div>
                            </div>
                            <div class="row" style={{ paddingBottom: '0px', paddingTop: '10px' }}>
                                <div class="col-md-12">Cuisine</div>
                            </div>
                            <div class="row" style={{ paddingBottom: '10px', paddingTop: '10px' }}>
                                <div class="col-md-12"><input onChange={this.restaurantCuisineChangeHandler} value={this.state.restaurantCuisine} type="text" class="form-control email" name="restaurantCuisine" readOnly={this.state.readOnly} /></div>
                            </div>

                            <div class="row" style={{ paddingBottom: '0px', paddingTop: '10px' }}>
                                <div class="col-md-12">Restaurant Address</div>
                            </div>
                            <div class="row" style={{ paddingBottom: '10px', paddingTop: '10px' }}>
                                <div class="col-md-12"><input onChange={this.restaurantAddressChangeHandler} value={this.state.restaurantAddress} type="text" class="form-control email" name="restaurantAddress" readOnly={this.state.readOnly} /></div>
                            </div>
                            <div class="row" style={{ paddingBottom: '0px', paddingTop: '10px' }}>
                                <div class="col-md-12">Restaurant Zip</div>
                            </div>
                            <div class="row" style={{ paddingBottom: '10px', paddingTop: '10px' }}>
                                <div class="col-md-12"><input onChange={this.restaurantZipCodeChangeHandler} value={this.state.restaurantZipCode} type="number" class="form-control email" name="restaurantZipCode" readOnly={this.state.readOnly} /></div>
                            </div>

                        </div>
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-6"><input type="file" onChange={this.pictureChangeHandler2} name="myImage" class="custom-file-input" accept="image/*" /></div>
                                <div class="col-md-6">{uploadImage2}</div>
                            </div>
                            <div class="row"><div class="col-md-8">{image2}</div>
                            </div>

                        </div>
                    </div>
                    <div class="row" style={{ paddingTop: '20px' }}>
                        <button type="button" onClick={this.updateHandler} class="btn btn-success btn-lg col-md-6">Update</button>
                    </div>


                </div>

            </div>

        )

        return (
            <div>
                {redirectVar}
                <div class="row">
                    <div class="col-md-2"></div>
                    <div class="col-md-1"><div class="row" style={{ paddingBottom: '40px', paddingTop: '20px' }}>
                        <a href="#" onClick={this.readOnlyHandler} class="btn btn-info btn-sm">
                            <span class="glyphicon glyphicon-edit"></span> Edit </a>
                    </div></div>
                    <div class="col-md-9">{createDisplay}</div></div>
                <div class="row" style={{ paddingLeft: '40px', marginTop: '5px' }}>{alertMessage}</div>

            </div>
        )
    }
}
function mapState(state) {
    const { owner, alert } = state;
    return { owner, alert };
}
const actionCreators = {
    uploadOwnerImage: ownerActions.uploadOwnerImage,
    uploadRestaurantImage: ownerActions.uploadRestaurantImage,
    fetchDetails: ownerActions.fetchOwnerDetails,
    updateDetails: ownerActions.updateDetails
};

const connectedUpdateDetailsOwner = connect(mapState, actionCreators)(UpdateDetailsOwner);
export { connectedUpdateDetailsOwner as UpdateDetailsOwner };


