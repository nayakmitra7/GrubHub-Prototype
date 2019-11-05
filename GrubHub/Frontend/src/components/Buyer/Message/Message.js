import React, { Component } from 'react';
import cookie from 'js-cookie';
import { Redirect } from 'react-router';
import '../../../App.css';
import { userActions } from '../../../redux/actions/user.actions';
import { connect } from 'react-redux';

class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sent: "",
            received: "active",
            messageListSent: [],
            messageListReceived:[]
        }
        this.receivedMessages = this.receivedMessages.bind(this);
        this.sentMessages = this.sentMessages.bind(this);
    }
    componentDidMount() {
        this.receivedMessages();
    }
    componentWillReceiveProps(newProps){
        let messageSentArray=newProps.users.messageSent;
        this.setState({messageListSent:messageSentArray})
        let messageReceivedArray=newProps.users.messageReceived;
        this.setState({messageListReceived:messageReceivedArray})
    }
    receivedMessages = (e) => {
        
        this.props.fetchMessageReceived();
        this.setState({ sent: "", received: "active",messageListSent:"" })

    }
    sentMessages = (e) => {
        this.props.fetchMessageSent();
        this.setState({ received: "", sent: "active",messageListReceived:"" })
    }
    render() {

        let redirectVar = "";
        let array = [];
        if (!cookie.get("token")) {
            redirectVar = <Redirect to="/login" />
        }else{
        if (this.state.messageListReceived) {
            this.state.messageListReceived.map((message) => {
                array.push(<div class="row embossed-heavy" style={{ marginLeft: '100px', marginRight: '140px', marginBottom: '10px', paddingBottom: '10px', fontWeight: 'bold', backgroundColor: 'white' }}>
                    <div class="row" style={{ backgroundColor: '#f2f2f2', marginLeft: '0px', marginRight: '0px' }}>
                        <div class="col-md-2" style={{ paddingRight: '0px' }}><h4>From: </h4></div>
                        <div class="col-md-3" style={{ paddingLeft: '0px' }}><h4> {message.senderFirstName} {message.senderLastName}</h4></div>
                        <div class="col-md-1" style={{ paddingLeft: '0px' }}></div>
                        <div class="col-md-3" style={{ paddingRight: '0px' }}><h4>Related Order Date:</h4></div>
                        <div class="col-md-3" style={{ paddingLeft: '0px' }}><h4>{message.orderDate}</h4></div>
                        
                    </div>
                    <div class="row" style={{ marginLeft: '5px',width:'200%' }}><h4>Message was received on : {message.messageDate}</h4></div>
                    <div class="row" style={{ marginLeft: '5px',width:'200%' }}>
                        {message.messageBody}
                    </div>
                </div>)



            })
        } else  if (this.state.messageListSent) {
            this.state.messageListSent.map((message) => {
                array.push(<div class="row embossed-heavy" style={{ marginLeft: '100px', marginRight: '140px', marginBottom: '10px', paddingBottom: '10px', fontWeight: 'bold', backgroundColor: 'white' }}>
                    <div class="row" style={{ backgroundColor: '#f2f2f2', marginLeft: '0px', marginRight: '0px' }}>
                        <div class="col-md-2" style={{ paddingRight: '0px' }}><h4>To:</h4></div>
                        <div class="col-md-3" style={{ paddingLeft: '0px' }}><h4>{message.receiverFirstName} {message.receiverLastName}</h4></div>
                        <div class="col-md-1" style={{ paddingLeft: '0px' }}></div>
                        <div class="col-md-3" style={{ paddingRight: '0px' }}><h4>Related Order Date:</h4></div>
                        <div class="col-md-3" style={{ paddingLeft: '0px' }}><h4>{message.orderDate}</h4></div>
                        
                    </div>
                    <div class="row" style={{ marginLeft: '5px',width:'200%' }}><h4>Message was sent on :  {message.messageDate}</h4></div>
                    <div class="row" style={{ marginLeft: '5px',width:'200%' }}>
                        {message.messageBody}
                    </div>
                </div>)
            })
        }
    
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
function mapState(state) {
    const { users, alert } = state;
    return { users, alert };
}
const actionCreators = {
    fetchMessageSent: userActions.fetchMessageSent,
    fetchMessageReceived:userActions.fetchMessageReceived
};

const connectedMessagePage = connect(mapState, actionCreators)(Message);
export { connectedMessagePage as Message };
