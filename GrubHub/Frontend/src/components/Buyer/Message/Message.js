import React, { Component } from 'react';
import cookie from 'js-cookie';
import { Redirect } from 'react-router';
import axios from 'axios';
import { address } from '../../../constant'
import '../../../App.css';

class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sent: "",
            received: "active",
            authFlag: true,
            messageListSent: [],
            messageListReceived:[]
        }
        this.receivedMessages = this.receivedMessages.bind(this);
        this.sentMessages = this.sentMessages.bind(this);
    }
    componentDidMount() {
        this.receivedMessages();
    }
    receivedMessages = (e) => {
        axios.get(address + '/message/received/' + sessionStorage.getItem("BuyerId"), { headers: { Authorization: 'JWT ' + cookie.get("token") } })
            .then(response => {
                if (response.status === 200) {
                    this.setState({ messageListReceived: response.data })
                }
            }).catch(error => {
                sessionStorage.clear();
                localStorage.clear();
                cookie.remove("token");
                this.setState({ authFlag: false })
            });
        this.setState({ sent: "", received: "active",messageListSent:"" })

    }
    sentMessages = (e) => {
        axios.get(address + '/message/sent/' + sessionStorage.getItem("BuyerId"), { headers: { Authorization: 'JWT ' + cookie.get("token") } })
            .then(response => {
                if (response.status === 200) {
                    this.setState({ messageListSent: response.data })
                }

            }).catch(error => {
                sessionStorage.clear();
                localStorage.clear();
                cookie.remove("token");
                this.setState({ authFlag: false })
            });
        this.setState({ received: "", sent: "active",messageListReceived:"" })
    }
    render() {

        var redirectVar = "";
        var array = [];
        if (this.state.messageListSent.length) {
            this.state.messageListSent.map((message) => {
                array.push(<div class="row embossed-heavy" style={{ marginLeft: '100px', marginRight: '140px', marginBottom: '10px', paddingBottom: '10px', fontWeight: 'bold', backgroundColor: 'white' }}>
                    <div class="row" style={{ backgroundColor: '#f2f2f2', marginLeft: '0px', marginRight: '0px' }}>
                        <div class="col-md-1" style={{ paddingRight: '0px' }}><h4>To:</h4></div>
                        <div class="col-md-3" style={{ paddingLeft: '0px' }}><h4>{message.receiverFirstName} {message.receiverLastName}</h4></div>
                        <div class="col-md-2" style={{ paddingLeft: '0px' }}></div>
                        <div class="col-md-3" style={{ paddingRight: '0px' }}><h4>Related Order Date:</h4></div>
                        <div class="col-md-3" style={{ paddingLeft: '0px' }}><h4>{message.orderDate}</h4></div>
                        
                    </div>
                    <div class="row" style={{ marginLeft: '5px',width:'200%' }}><h4>Message was sent on :  {message.messageDate}</h4></div>
                    <div class="row" style={{ marginLeft: '5px',width:'200%' }}>
                        {message.messageBody}
                    </div>
                </div>)
            })
        }else if (this.state.messageListReceived.length) {
            this.state.messageListReceived.map((message) => {
                array.push(<div class="row embossed-heavy" style={{ marginLeft: '100px', marginRight: '140px', marginBottom: '10px', paddingBottom: '10px', fontWeight: 'bold', backgroundColor: 'white' }}>
                    <div class="row" style={{ backgroundColor: '#f2f2f2', marginLeft: '0px', marginRight: '0px' }}>
                        <div class="col-md-1" style={{ paddingRight: '0px' }}><h4>From: </h4></div>
                        <div class="col-md-3" style={{ paddingLeft: '0px' }}><h4> {message.senderFirstName} {message.senderLastName}</h4></div>
                        <div class="col-md-3" style={{ paddingLeft: '0px' }}></div>
                        <div class="col-md-2" style={{ paddingRight: '0px' }}><h4>Related Order Date:</h4></div>
                        <div class="col-md-3" style={{ paddingLeft: '0px' }}><h4>{message.orderDate}</h4></div>
                        
                    </div>
                    <div class="row" style={{ marginLeft: '5px',width:'200%' }}><h4>Message was received on : {message.messageDate}</h4></div>
                    <div class="row" style={{ marginLeft: '5px',width:'200%' }}>
                        {message.messageBody}
                    </div>
                </div>)



            })
        } 

        if (!this.state.authFlag) {
            redirectVar = <Redirect to="/LoginOwner" />
        }

        return (

            <div>
                {redirectVar}
                <p style={{ color: 'crimson', fontWeight: '900', fontSize: '40px', marginLeft: '600px', marginTop: '0px' }}>Messages</p>
                <p style={{ color: 'blue', fontWeight: '900', fontSize: '25px', marginLeft: '40px', marginTop: '0px' }}>{this.state.titleName}</p>
                <ul class="nav nav-tabs" style={{ fontSize: '18px', marginLeft: '55px' }}>
                    <li class={this.state.received}><a onClick={this.receivedMessages}><p>Received</p> </a></li>
                    <li class={this.state.sent}><a onClick={this.sentMessages}><p style={{ paddingBottom: '0px' }}>Sent</p></a></li>
                </ul>

                <ul class="list-group" style={{ marginLeft: '150px', marginRight: '450px', marginTop: '50px' }}>{array}</ul>

            </div>




        )
    }
}

export default Message;