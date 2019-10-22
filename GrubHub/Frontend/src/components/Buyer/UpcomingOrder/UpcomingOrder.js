import React, { Component } from 'react';
import cookie from 'js-cookie';
import { Redirect } from 'react-router';
import axios from 'axios';
import { address } from '../../../constant';
import '../../../App.css';


class UpcomingOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            orderStatus: "",
            restaurantName: "",
            restaurantId: "",
            buyerAddress: "",
            orderDate: "",
            orderDetails: [],
            authFlag: true,
            messageFlag:false,
            messageBox:""

        }
        this.messageBoxChangeHandler = this.messageBoxChangeHandler.bind(this);

    }
    componentDidMount() {
        axios.get(address + '/order/upcomingOrders/user/' + sessionStorage.getItem("BuyerId"), {
            headers: { Authorization: 'JWT ' + cookie.get("token") }
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({ orders: response.data })
                }
            }).catch(error => {
                sessionStorage.clear();
                localStorage.clear();
                cookie.remove("token");
                this.setState({ authFlag: false })
            })
    }
    modalCloseMessage = () => {
        this.setState({ messageFlag: false, messageBox: "" })
        document.getElementById("Message").style.display = "None";
      }
    trackOrder = (e) => {
        document.getElementById("TrackOrder").style.display = "block"
        var order = this.state.orders.filter((order) => {
            if (order._id == e.target.id) {
                return order
            }
        })

        this.setState({
            orderStatus: order[0].orderStatus,
            restaurantName: order[0].restaurantName,
            buyerAddress: order[0].buyerAddress,
            orderDate: order[0].orderDate,
            orderDetails: JSON.parse(order[0].orderDetails)
        })

    }
    messageBoxChangeHandler = (e) => {
        this.setState({
          messageBox: e.target.value
        });
      }
    sendMessage = (e) => {
        document.getElementById("Message").style.display = "block"
        var order = this.state.orders.filter((order) => {
          if (order._id == e.target.id) {
            return order
          }
        })
        this.setState({
            restaurantName: order[0].restaurantName,
            restaurantId:order[0].restaurantId,
            buyerAddress: order[0].buyerAddress,
            orderDate: order[0].orderDate,

        })
    
      }
      messageSendHandler = (e) => {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes();
        var CurrentDateTime = date + ' ' + time;
        var data = { senderId: sessionStorage.getItem("BuyerId"), senderFirstName: sessionStorage.getItem("FirstName"), senderLastName: sessionStorage.getItem("LastName"), receiverId: this.state.restaurantId, receiverFirstName: this.state.restaurantName, receiverLastName:"", message: this.state.messageBox, orderDate: this.state.orderDate, messageDate: CurrentDateTime }
    
        axios.post(address + '/message', data, { headers: { Authorization: 'JWT ' + cookie.get("token") } })
          .then(response => {
            if (response.status === 200) {
              this.setState({ messageFlag: false, messageBox: "" })
              document.getElementById("Message").style.display = "none";
    
            } else if (response.status == 201) {
              this.setState({ messageFlag: true })
            }
    
          }).catch(error => {
            sessionStorage.clear();
            localStorage.clear();
            cookie.remove("token");
            this.setState({ authFlag: false })
          });
    
      }
    modalClose = () => {
        document.getElementById("TrackOrder").style.display = "None"
    }
    render() {
        var messageDisplay = ""
        if (this.state.messageFlag == true) {
          messageDisplay = (<ul class="li alert alert-danger">Message body is needed</ul>);
        }
        var redirectVar = "";
        if (!this.state.authFlag) {
            redirectVar = <Redirect to="/login" />
        }
        var array = [];
        if (this.state.orders.length) {

        } else {
            array.push(<div class="NoOrder"></div>)
        }
        this.state.orders.map((order) => {
            if (order.orderStatus != "Delivered" && order.orderStatus != "Cancelled") {
                var val = JSON.parse(order.orderDetails);
                var array2 = []

                val.map((item) => {
                    array2.push(<div class="row" style={{ marginLeft: '0px' }}>
                        <div class="col-md-4">{item.itemName} X {item.itemCount}</div>
                        <div class="col-md-4"></div>
                        <div class="col-md-4"></div>
                    </div>)
                })

                array.push(<div class="row embossed-heavy" style={{ marginLeft: '100px', marginRight: '140px', marginBottom: '10px', paddingBottom: '10px', fontWeight: 'bold', backgroundColor: 'white' }}>
                    <div class="row" style={{ backgroundColor: '#f2f2f2', marginLeft: '0px', marginRight: '0px' }}>
                        <div class="col-md-2" style={{ paddingRight: '0px' }}><h5>Order Date :</h5></div>
                        <div class="col-md-2" style={{ paddingLeft: '0px' }}><h5>{order.orderDate}</h5></div>
                        <div class="col-md-5"></div>
                        <div class="col-md-3">
                            <button class="btn " id={order._id} style={{ backgroundColor: 'Green', color: 'white', fontSize: '16px', marginTop: '0px', marginTop: '10px' }} onClick={this.sendMessage}> Send A Message</button>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-8"><p style={{ fontSize: '20px', marginLeft: '10px', marginTop: '10px' }}>{order.restaurantName}</p></div>
                        <div class="col-md-1"><button class="btn " id={order._id} style={{ backgroundColor: 'blue', color: 'white', fontSize: '16px', marginTop: '15px' }} onClick={this.trackOrder}>Track Order</button></div>
                        <div class="col-md-3"></div>
                    </div>
                    <div class="row" style={{ marginLeft: '5px' }}> {array2}</div>
                </div>)
            }


        })
        var items = []
        var sum = parseFloat(0);
        this.state.orderDetails.map((item) => {
            sum += parseFloat(item.itemCostTotal)
            items.push(<div class="row" style={{ marginLeft: '30px', marginBottom: '20px', textAlign: 'center' }}>
                <div class="col-md-2">{item.itemCount}</div>
                <div class="col-md-5">{item.itemName}</div>
                <div class="col-md-3"></div>
                <div class="col-md-2">${item.itemCostTotal}</div>
            </div>)
        })
        sum = sum.toFixed(2);
        items.push(<br></br>)
        items.push(<hr style={{ borderBottom: "1px solid black" }}></hr>)
        items.push(<div class="row" style={{ marginRight: '20px' }}>
            <div class="col-md-8"></div>
            <div class="col-md-3"><h4>Amount Paid :</h4></div>
            <div class="col-md-1"><h4>${sum}</h4></div>
        </div>)
        var progressBar = []
        switch (this.state.orderStatus) {
            case 'New':
                progressBar.push(<div class="progress-bar bg-danger" style={{ width: "20%" }}>Order Placed</div>)
                break;
            case 'Confirmed':
                progressBar.push(<div class="progress-bar bg-danger" style={{ width: "20%" }}>Order Placed</div>)
                progressBar.push(<div class="progress-bar bg-danger" style={{ width: "20%" }}>Order Confirmed </div>)
                break;
            case 'Preparing':
                progressBar.push(<div class="progress-bar bg-danger" style={{ width: "20%" }}>Order Placed</div>)
                progressBar.push(<div class="progress-bar bg-danger" style={{ width: "20%" }}>Order Confirmed </div>)
                progressBar.push(<div class="progress-bar bg-danger" style={{ width: "20%" }}>Preparing</div>)
                break;
            case 'Ready':
                progressBar.push(<div class="progress-bar bg-danger" style={{ width: "20%" }}>Order Placed</div>)
                progressBar.push(<div class="progress-bar bg-danger" style={{ width: "20%" }}>Order Confirmed </div>)
                progressBar.push(<div class="progress-bar bg-danger" style={{ width: "20%" }}>Preparing</div>)
                progressBar.push(<div class="progress-bar bg-danger" style={{ width: "20%" }}>Ready</div>)
                break;
            case 'Delivered':
                progressBar.push(<div class="progress-bar bg-danger" style={{ width: "20%" }}>Order Placed</div>)
                progressBar.push(<div class="progress-bar bg-danger" style={{ width: "20%" }}>Order Confirmed </div>)
                progressBar.push(<div class="progress-bar bg-danger" style={{ width: "20%" }}>Preparing</div>)
                progressBar.push(<div class="progress-bar bg-danger" style={{ width: "20%" }}>Ready</div>)
                progressBar.push(<div class="progress-bar bg-danger" style={{ width: "20%" }}>Delivered</div>)

                break;
        }

        return (

            <div>
                {redirectVar}
                <p style={{ color: 'blue', fontWeight: '900', fontSize: '25px', marginLeft: '100px', marginTop: '50px' }}>Upcoming Orders</p>
                <ul class="list-group" style={{ marginLeft: '150px', marginRight: '450px', marginTop: '50px' }}>
                    {array}

                </ul>
                <div class="modal" id="TrackOrder" >
                    <div class="modal-dialog" style={{ width: '850px', height: '1850px' }}>
                        <div class="modal-content">

                            <div class="modal-header">
                                <div class="row">
                                    <div class="col-md-4"></div>
                                    <div class="col-md-6"><h1 class="modal-title">Track Order</h1></div>
                                    <div clas="col-md-1"></div>
                                    <div class="col-md-1"><button type="button" id="closeSection" data-dismiss="modal" onClick={this.modalClose}>&times;</button></div>
                                </div>
                            </div>
                            <div class="modal-body" style={{ height: '200%' }}>
                                <div class="row" style={{ marginBottom: '20px', marginLeft: '20px', textAlign: 'left', color: 'crimson' }}>Order Date : <h3>{this.state.orderDate}</h3></div>

                                <div class="row" style={{ marginBottom: '20px', textAlign: 'center' }}><h3>{this.state.restaurantName}</h3></div>
                                <div class="progress" style={{ marginBottom: '90px' }}>
                                    {progressBar}
                                </div>
                                <div class="row" style={{ marginLeft: '30px', marginBottom: '30px', fontSize: '16px', textAlign: 'center', fontWeight: 'bold' }}>
                                    <div class="col-md-2"><h4>Quantity</h4></div>
                                    <div class="col-md-5"><h4>Item Name</h4></div>
                                    <div class="col-md-3"></div>
                                    <div class="col-md-2"><h4>Cost</h4></div>
                                </div>
                                <div class="row">
                                    {items}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal" id="Message" >
                    <div class="modal-dialog" style={{ width: '850px', height: '1850px' }}>
                        <div class="modal-content">

                            <div class="modal-header">
                                <div class="row">
                                    <div class="col-md-4"></div>
                                    <div class="col-md-6"><h1 class="modal-title"> Send a Message</h1></div>
                                    <div clas="col-md-1"></div>
                                    <div class="col-md-1"><button type="button" id="closeSection" data-dismiss="modal" onClick={this.modalCloseMessage}>&times;</button></div>
                                </div>
                            </div>
                            <div class="modal-body" style={{ height: '200%' }}>

                                <div class="row" style={{ marginBottom: '20px', textAlign: 'center' }}><h3>{this.state.restaurantName}</h3></div>
                                <div class="row" style={{ marginBottom: '20px', textAlign: 'center' }}> <textarea rows="4" cols="40" onChange={this.messageBoxChangeHandler} name="messageBox" value={this.state.messageBox}></textarea></div>

                            </div>
                            <div class="modal-footer">
                                <div class="row">
                                    <div class="col-md-2"></div>
                                    <div class="col-md-4"><button class="btn" style={{ backgroundColor: 'Green', color: 'white', width: '200%' }} onClick={this.messageSendHandler} >Send</button></div>
                                    <div class="col-md-4"></div>
                                </div>
                                <div class="row">{messageDisplay}</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>




        )
    }
}

export default UpcomingOrder;