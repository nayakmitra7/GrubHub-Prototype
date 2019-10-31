import React, { Component } from 'react';
import cookie from 'js-cookie';
import { Redirect } from 'react-router';
import '../../../App.css';
import { userActions } from '../../../redux/actions/user.actions';
import { alertActions } from '../../../redux/actions/alert.actions';
import { connect } from 'react-redux';

class UpdateDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            file: null,
            phone: "",
            filePreview: null,
            errorMessage: [],
            readOnly: true,
            ID: "",
            errorFlag: "No update",
            address: ""
        }
        this.firstNameChangeHandler = this.firstNameChangeHandler.bind(this);
        this.lastNameChangeHandler = this.lastNameChangeHandler.bind(this);
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.updateHandler = this.updateHandler.bind(this);
        this.readOnlyHandler = this.readOnlyHandler.bind(this);
        this.pictureChangeHandler = this.pictureChangeHandler.bind(this)
        this.resetPicture = this.resetPicture.bind(this)
        this.uploadImageHandler = this.uploadImageHandler.bind(this)

    }
    componentWillReceiveProps(newProps) {
        let userDetails = newProps.users.details;
        this.setState({
            firstName: userDetails.buyerFirstName,
            lastName: userDetails.buyerLastName,
            email: userDetails.buyerEmail,
            phone: userDetails.buyerPhone,
            image: userDetails.buyerImage,
            ID: userDetails._id,
            address: userDetails.buyerAddress,
            file: userDetails.buyerImage
        })

    }
    componentWillUpdate
    componentDidMount() {
        this.props.fetchUserDetails();
    }
    uploadImageHandler = (e) => {
        if (this.state.file) {
            e.preventDefault();
            let formData = new FormData();
            formData.append('myImage', this.state.file, this.state.ID);
            const config = {
                headers: {
                    Authorization: 'JWT ' + cookie.get("token"),
                    'content-type': 'multipart/form-data'
                }
            };
            this.props.uploadImageUser(formData, config);
            setTimeout(() => {
                window.location.reload();
            }, 3000);

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
    resetPicture(event) {
        event.preventDefault();
        this.setState({ file: null });
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
    addressChangeHandler = (e) => {
        this.setState({
            address: e.target.value
        })
    }

    updateHandler = (e) => {
        e.preventDefault();
        const data = { firstName: this.state.firstName, lastName: this.state.lastName, email: this.state.email, phone: this.state.phone, ID: this.state.ID, address: this.state.address, file: this.state.file };
        if (this.state.readOnly == false) {
            this.props.updateUserDetails(data);

        }
    }

    render() {
        let redirectVar = "";
        let image = <div class="img" style={{ paddingTop: '20px' }}><img style={{ width: "80%" }} src="//placehold.it/5000x3000" class="img-circle" /></div>
        let uploadImage = ""
        let createDisplay = "";
        let alertMessage = [];
        if (!cookie.get("token")) {
            redirectVar = <Redirect to="/login" />
        } else {

            const { alert } = this.props;
           
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
                    }, 1000);
                }
            }

            if (this.state.filePreview) {
                image = <div class="img" style={{ paddingBottom: '20px' }}><img style={{ width: "80%" }} src={this.state.filePreview} class="img-circle" onChange={this.pictureChangeHandler} /></div>
                uploadImage = <button onClick={this.uploadImageHandler}>Upload Image</button>

            } else if (this.state.file) {
                image = <div class="img" style={{ paddingBottom: '20px' }}><img style={{ width: "80%" }} src={this.state.file} class="img-circle" onChange={this.pictureChangeHandler} /></div>
            }
            createDisplay = (
                <div>

                    <div class="row" style={{ paddingBottom: '50px', paddingTop: '50px' }}>
                        <a href="#" onClick={this.readOnlyHandler} class="btn btn-info btn-sm">
                            <span class="glyphicon glyphicon-edit"></span> Edit</a>
                    </div>
                    <div class="row" style={{ paddingBottom: '10px' }}>
                        <div class="col-md-6" style={{ paddingLeft: '50px' }}>
                            <div class="col-md-6"><input type="file" accept="image/*" onChange={this.pictureChangeHandler} name="myImage" class="custom-file-input" /></div>
                            <div class="col-md-6">{uploadImage}</div>
                            {image}
                        </div>
                    </div>
                    <div class="row" style={{ paddingBottom: '0px' }}>
                        <div class="row" style={{ paddingBottom: '10px' }}>
                            <div class="col-md-4 signup">First Name</div>
                            <div class="col-md-4 signup">Last Name</div>
                        </div>
                        <div class="row" style={{ paddingBottom: '10px' }}>
                            <div class="col-md-4 signup">
                                <input value={this.state.firstName} onChange={this.firstNameChangeHandler} type="text" class="form-control" name="firstName" readOnly={this.state.readOnly} />
                            </div>
                            <div class="col-md-4 signup"><input value={this.state.lastName} onChange={this.lastNameChangeHandler} type="text" class="form-control" name="lastName" readOnly={this.state.readOnly} /></div>
                        </div>
                    </div>
                    <div class="row" style={{ paddingBottom: '10px' }}>
                        <div class="col-md-6">
                            <div class="row" style={{ paddingBottom: '10px' }}>Email</div>
                            <div class="row" style={{ paddingBottom: '10px' }}><input onChange={this.emailChangeHandler} value={this.state.email} type="text" class="form-control email" name="email" readOnly={this.state.readOnly} /></div>
                            <div class="row" style={{ paddingBottom: '10px' }}>Phone</div>
                            <div class="row" style={{ paddingBottom: '10px' }}><input onChange={this.phoneChangeHandler} value={this.state.phone} type="number" class="form-control email" name="phone" readOnly={this.state.readOnly} />
                            </div>
                            <div class="row" style={{ paddingBottom: '10px' }}>Address</div>
                            <div class="row" style={{ paddingBottom: '10px' }}><input onChange={this.addressChangeHandler} value={this.state.address} type="text" class="form-control email" name="address" readOnly={this.state.readOnly} /></div>
                        </div>

                    </div>
                    <div class="row"><button type="button" onClick={this.updateHandler} class="btn btn-success btn-lg col-md-6">Update</button></div>
                </div>
            )
        }



        return (
            <div>
                {redirectVar}
                <div class="row" >
                    <div class="col-md-4"></div>

                    <div class="col-md-8">   {createDisplay}</div>
                </div>
                <div class="row" style={{ paddingLeft: '30px', marginTop: '5px', textAlign: 'center' }}> {alertMessage}</div>

            </div>
        )
    }
}
function mapState(state) {
    const { users, alert } = state;
    return { users, alert };
}
const actionCreators = {
    fetchUserDetails: userActions.fetchUserDetails,
    uploadImageUser: userActions.uploadUserPhoto,
    clearAlerts: alertActions.clear,
    updateUserDetails: userActions.updateUserDetails
};

const connectedUpdateDetailsPage = connect(mapState, actionCreators)(UpdateDetails);
export { connectedUpdateDetailsPage as UpdateDetails };
