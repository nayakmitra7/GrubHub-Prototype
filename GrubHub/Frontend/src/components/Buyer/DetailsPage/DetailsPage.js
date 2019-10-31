import React, { Component } from 'react';
import '../../../App.css';
import cookie from 'js-cookie';
import { Redirect } from 'react-router';
import { userActions } from '../../../redux/actions/user.actions';
import { connect } from 'react-redux';


class DetailsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemSearched: "",
            searchFlag: false,
            sectionName: "",
            sectionId: "",
            sectionDesc: "",
            messageFlag: false,
            restaurantId: sessionStorage.getItem("RestaurantID"),
            restaurantName: sessionStorage.getItem("RestaurantName"),
            sectionsPresent: [],
            itemName: "",
            itemDesc: "",
            itemPrice: "",
            itemSection: "",
            itemId: "",
            count: JSON.parse(localStorage.getItem(sessionStorage.getItem("BuyerId"))) ? JSON.parse(localStorage.getItem(sessionStorage.getItem("BuyerId"))).length : 0,
            itemCount: 1,
            itemCostTotal: 0,
            bag: localStorage.getItem(sessionStorage.getItem("BuyerId")) ? JSON.parse(localStorage.getItem(sessionStorage.getItem("BuyerId"))) : [],
            itemsPresent: [],
            checkoutFlag: false,
            currentPage: 1,
            itemsPerPage: 4
        }
        this.addItemModal = this.addItemModal.bind(this);
        this.incrementCount = this.incrementCount.bind(this);
        this.decrementCount = this.decrementCount.bind(this);
        this.addToBag = this.addToBag.bind(this);
        this.itemSearchedChangeHandler = this.itemSearchedChangeHandler.bind(this);
        this.handleClick = this.handleClick.bind(this);

    }
    handleClick = (event) => {
        this.setState({
            currentPage: Number(event.target.id)
        })
        for (let i = 1; i <= Math.ceil(this.state.itemsPresent.length / this.state.itemsPerPage); i++) {
            document.getElementById(i).className = "page-item";

        }
        document.getElementById(event.target.id).className = "page-item active";
    }
    CheckOut = () => {
        let today = new Date();
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        let time = today.getHours() + ":" + today.getMinutes();
        let CurrentDateTime = date + ' ' + time
        let data = { restaurantId: this.state.restaurantId, buyerID: sessionStorage.getItem("BuyerId"), buyerAddress: sessionStorage.getItem("Address"), buyerFirstName: sessionStorage.getItem("FirstName"), buyerLastName: sessionStorage.getItem("LastName"), orderStatus: "New", bag: localStorage.getItem(sessionStorage.getItem("BuyerId")), date: CurrentDateTime, restaurantName: sessionStorage.getItem("RestaurantName") }
        this.props.placeOrder(data);
        this.setState({ checkoutFlag: true })
        this.setState({ bag: [] })
        localStorage.removeItem(sessionStorage.getItem("BuyerId"))

    }
    openShoppingCart = () => {
        document.getElementById("shoppingCart").style.display = "block";
    }
    closeShoppingCart = () => {
        document.getElementById("shoppingCart").style.display = "none";

    }
    cancelBagAdd = () => {
        this.warningMessageClose();
        document.getElementById("modalAddItem").style.display = "none"
    }
    serachFood = () => {
        if (this.state.itemSearched.length) {
            this.setState({ searchFlag: true })
            sessionStorage.setItem("ItemSearched", this.state.itemSearched);
        }
    }
    itemSearchedChangeHandler = (e) => {
        this.setState({ itemSearched: e.target.value })
    }
    emptyBag1 = () => {
        return new Promise((resolve, reject) => {
            document.getElementById("warningMessage").style.display = "none";
            this.setState({ bag: [], count: 0 });
            localStorage.setItem(sessionStorage.getItem("BuyerId"), JSON.stringify([]));
            resolve();
        })
    }
    emptyBag = () => {
        this.emptyBag1().then(() => {
            this.addToBag();
        })
    }
    checkIfSameRetaurant = (e) => {
        if (this.state.bag.length) {
            let item = this.state.bag[0];
            if (item.restaurantId == this.state.restaurantId) {
                return 1;
            } else {
                return 0;
            }
        } else {
            return 1;
        }
    }
    addToBag = () => {
        let item = { itemId: this.state.itemId, itemName: this.state.itemName, itemCostTotal: parseFloat(this.state.itemCostTotal), itemCount: this.state.itemCount, restaurantId: this.state.restaurantId }
        if (this.checkIfSameRetaurant()) {
            let itemPresent = false;
            this.state.bag.forEach((itemInBag) => {
                if (itemInBag.itemId == this.state.itemId) {
                    itemPresent = true;
                    itemInBag.itemCount += this.state.itemCount;
                    itemInBag.itemCostTotal = parseFloat(itemInBag.itemCostTotal) + parseFloat(this.state.itemCostTotal);
                }
            })
            this.setState({ messageFlag: true })
            if (itemPresent == false) {
                this.state.bag.push(item);
                let count1 = this.state.count;
                this.setState({ count: count1 + 1 })
            }
            this.setState({ itemCount: 1 });
            setTimeout(() => {
                document.getElementById("modalAddItem").style.display = "none"
                this.setState({ messageFlag: false })
            }, 1000);
            localStorage.setItem(sessionStorage.getItem("BuyerId"), JSON.stringify(this.state.bag));
        } else {
            document.getElementById("warningMessage").style.display = "block"
        }
    }
    warningMessageClose = () => {
        document.getElementById("warningMessage").style.display = "none";

    }
    decrementCount = (e) => {
        if (this.state.itemCount > 1) {
            let quantity = this.state.itemCount - 1;
            let cost = this.state.itemPrice;
            let costTotal = quantity * cost;
            this.setState({ itemCount: quantity, itemCostTotal: parseFloat(costTotal).toFixed(2) })

        }
    }
    incrementCount = (e) => {
        let quantity = this.state.itemCount + 1;
        let cost = this.state.itemPrice;
        let costTotal = quantity * cost;
        this.setState({ itemCount: quantity, itemCostTotal: parseFloat(costTotal).toFixed(2) })

    }
    componentWillReceiveProps(newProps) {
        let responseArray = []
        this.setState({ sectionsPresent: newProps.users.sections })
        this.setState({ itemsPresent: newProps.users.items })
        if (newProps.users.sections && newProps.users.items) {
            newProps.users.sections.forEach((section) => {
                newProps.users.items.forEach((item) => {
                    if (section._id == item.sectionId) {
                        responseArray.push(item)
                    }
                })
            })
            this.setState({
                itemsPresent: responseArray
            })
        }

    }



    addItemModal = (e) => {

        document.getElementById("modalAddItem").style.display = "block";
        this.setState({ itemId: e.target.id })
        let item = this.state.itemsPresent.filter((i) => {
            if (i._id == e.target.id) {
                return i;
            }
        })
        let quantity = this.state.itemCount;
        let cost = parseFloat(item[0].ItemPrice);
        let itemTotal = quantity * cost;
        this.setState({
            itemName: item[0].ItemName,
            itemDesc: item[0].ItemDesc,
            itemPrice: item[0].ItemPrice,
            itemCount: 1,
            itemImage: item[0].itemImage,
            itemCostTotal: parseFloat(itemTotal)
        })
    }
    modalCloseSection = () => {
        document.getElementById("modalAddItem").style.display = "none"
        this.setState({ itemCount: 1 })
    }
    deleteItem = (e) => {
        let val = this.state.bag.filter((bag) => {
            if (e.target.id != bag.itemId) {
                return bag;
            }
        })
        let len = val.length
        this.setState({ bag: val, count: len })
        localStorage.setItem(sessionStorage.getItem("BuyerID"), JSON.stringify(val));

    }
    componentDidMount() {
        this.props.fetchSections(this.state.restaurantId);
        this.props.fetchItems(this.state.restaurantId);

    }
    render() {
        let redirectVar = "";
        let bagDispay = ""
        let bagButtonDisplay = "";
        let array = [];
        let subTotal = parseFloat(0);
        let itemImage = "";
        let messageDisplay = ""
        let renderPageNumbers = [];
        let pageNumbers = [];
        let currentPageitems = []
        if (this.state.itemImage) {
            itemImage = (<div>
                <img style={{ width: "70%", paddingBottom: "10px", paddingTop: "10px" }} src={this.state.itemImage} class="rounded" /></div>)
        }
        if (this.state.bag.length) {
            array.push(<div class="row"><div class="col-md-12" style={{ textAlign: 'center', fontSize: '25px', marginBottom: '20px' }}>{this.state.restaurantName}</div> </div>)
            array.push(<div class="row" style={{ textAlign: 'center' }}>
                <div className="col-md-2" style={{ fontSize: "18px" }}><p>Quantity</p></div>
                <div className="col-md-4" style={{ fontSize: "18px" }}><p>Item Name</p></div>
                <div className="col-md-3"></div>
                <div className="col-md-3" style={{ fontSize: "18px" }}><p>Cost</p></div>
            </div>)

            this.state.bag.forEach((bag) => {
                subTotal += parseFloat(bag.itemCostTotal);
                array.push(<div class="row" style={{ textAlign: 'center' }}>
                    <div className="col-md-2"><p>{bag.itemCount}</p></div>
                    <div className="col-md-4"><p>{bag.itemName}</p></div>
                    <div className="col-md-3"><span id={bag.itemId} class="glyphicon glyphicon-trash" onClick={this.deleteItem}></span></div>
                    <div className="col-md-3"><p>${bag.itemCostTotal}</p></div>
                </div>)

            })
            subTotal = parseFloat(subTotal).toFixed(2);
            array.push(<hr style={{ borderBottom: "1px solid #fff" }}></hr>)
            array.push(<div class="row">
                <div class="col-md-7"></div>
                <div class="col-md-3" style={{ fontSize: '18px' }}>Sub Total : </div>
                <div class="col-md-1" style={{ fontSize: '18px' }}>${subTotal}</div>
                <div class="col-md-1"></div>
            </div>)
            bagDispay = array;
            bagButtonDisplay = (<div><input type="button" class="btn btn-success" value="Place Order" onClick={this.CheckOut} /></div>)
        } else {
            bagDispay = (<div class=" emptyBag" style={{ paddingTop: '250px', paddingBottom: '250px' }}></div>)
            bagButtonDisplay = ""
        }
        if (!cookie.get("token")) {
            redirectVar = <Redirect to="/login" />
        }
        if (this.state.checkoutFlag == true) {
            redirectVar= <Redirect to="/ReviewPage" />
        }
        if (this.state.searchFlag == true) {
            this.setState({ searchFlag: false })
            if (this.state.itemSearched.length) {
                redirectVar = <Redirect to="/SearchPage" />
            }
        }
        if (this.state.messageFlag == true) {
            messageDisplay = (<ul class="li alert alert-success">Added this to your bag !!!</ul>);
        }

        if (this.state.itemsPresent) {
            const { itemsPresent, currentPage, itemsPerPage } = this.state;
            const indexOfLastTodo = currentPage * itemsPerPage;
            const indexOfFirstTodo = indexOfLastTodo - itemsPerPage;
            currentPageitems = itemsPresent.slice(indexOfFirstTodo, indexOfLastTodo);
            for (let i = 1; i <= Math.ceil(itemsPresent.length / itemsPerPage); i++) {
                pageNumbers.push(i);
            }
            pageNumbers.map(number => {
                if (number == 1) {
                    renderPageNumbers.push(
                        <li class="page-item active" id={number}><a class="page-link" id={number} key={number} onClick={this.handleClick} style={{ color: 'black' }}> {number}</a></li>
                    )
                } else {
                    renderPageNumbers.push(
                        <li class="page-item" id={number}><a class="page-link" id={number} key={number} onClick={this.handleClick} style={{ color: 'black' }}> {number}</a></li>
                    )
                }


            });
        }

        if (this.state.sectionsPresent) {
            array.push(<div><div class="row" style={{ fontSize: "30px", fontWeight: "900" }}>
                <div class="col-md-7"></div>
                <div class="col-md-5"> {this.state.restaurantName}</div>
            </div>
                <div class="row">
                    <div class="col-md-4"></div>
                    <div class="col-md-4">
                        <ul id="page-numbers" class="pagination pagination-lg" style={{ marginBottom: '10px' }}>
                            {renderPageNumbers}
                        </ul>
                    </div>
                </div>
            </div>)
            this.state.sectionsPresent.map((section) => {
                let flag = 0;
                array.push(<div>
                    <div class="row" style={{ fontSize: "20px", fontWeight: "900" }}>
                        <div class="col-md-11" style={{ alignItems: "center" }}>{section.menuSectionName} </div>
                    </div>
                    <br></br>
                </div>)

                currentPageitems.filter((item) => {
                    if (item.sectionId == section._id) {
                        flag = 1;
                        array.push(
                            <div class="row embossed-heavy" style={{ marginBottom: '15px', borderStyle: "groove", paddingTop: '5px', paddingBottom: '5px', paddingRight: '0px', marginRight: '0px', backgroundColor: 'white' }}>
                                <span class="border border-dark" style={{ marginLeft: '10px' }}>
                                    <div class="col-md-4" style={{ textAlign: "left" }}>
                                        <img style={{ width: "70%", paddingBottom: "10px", paddingTop: "10px" }} src={item.itemImage} class="rounded" />
                                    </div>
                                    <div class="col-md-4">
                                        <div class="row" style={{ fontSize: "15px", fontWeight: "600", color: "blue", marginLeft: "10px", marginTop: "0px" }}>
                                            <p onClick={this.addItemModal} id={item._id}>{item.ItemName}</p></div>
                                        <div class="row" style={{ marginLeft: "10px", marginBottom: "10px" }}>{item.ItemDesc}</div>
                                    </div>
                                    <div class="col-md-1"></div>
                                    <div class="col-md-2">
                                        <div class="row" style={{ textAlign: "right" }} ><p style={{ color: 'red' }}>${item.ItemPrice}</p></div>
                                    </div>



                                </span></div>)
                    }
                })
                if (flag == 0) {
                    array.pop()
                }
            })
        }
        return (
            <div>
                {redirectVar}
                <div class="row" style={{ backgroundColor: "white" }}>

                    <div class="col-md-6" style={{ marginTop: '20px', paddingLeft: '25px' }}>
                        <div class="col-md-6 "><input onChange={this.itemSearchedChangeHandler} style={{ height: '45px' }} class="col-md-12" type="text" placeholder="  What are you looking for?"></input></div>
                        <div class="col-md-2"><button class="btn btn-info btn-lg" onClick={this.serachFood} >Find Food</button></div>
                        <div class="col-md-1"></div>
                    </div>
                    <div class="col-md-6">
                        <div class="col-md-11"></div>
                        <div class="col-md-1" style={{ backgroundColor: "white", fontSize: '50px', color: '#000000', paddingLeft: '0px', paddingRight: '0px', }}><span onClick={this.openShoppingCart} class="glyphicon glyphicon-shopping-cart"><i class="fa-stack fa-2x has-badge" data-count={this.state.count}></i></span> </div>

                    </div>
                </div>
                <div class="row" >
                    <div class="col-md-11"> <p align="center" > </p></div>

                </div>

                <br></br>
                <div class="row ">
                    <div class="col-md-2" style={{ marginTop: '0px', paddingLeft: '20px', paddingRight: '0px' }}>
                    </div>
                    <div class="col-md-5">
                        {array}
                    </div>
                    <div class="col-md-4"></div>
                </div>

                <div class="row">
                    <div class="col-sm-5"></div>
                    <div class="col-sm-5" style={{ marginTop: '0px' }}></div>
                </div>
                <div class="modal" id="modalAddItem" >
                    <div class="modal-dialog" style={{ width: '850px', height: '1850px' }}>
                        <div class="modal-content">

                            <div class="modal-header">
                                <div class="row">
                                    <div class="col-md-5"></div>
                                    <div class="col-md-6"><h4 class="modal-title">{this.state.itemName}</h4></div>
                                    <div class="col-md-1"><button type="button" id="closeSection" data-dismiss="modal" onClick={this.modalCloseSection}>&times;</button></div>
                                </div>
                            </div>
                            <div class="modal-body">
                                <div class="row">
                                    <div class="col-md-6"><div class="row" style={{ paddingLeft: "25px", paddingRight: "25px" }}>
                                        <div class="row" style={{ paddingBottom: "5px" }}>
                                            Description
                                </div>
                                        <div class="row" style={{ paddingBottom: "15px" }}>
                                            <p>{this.state.itemDesc}</p>
                                        </div>
                                    </div>
                                        <div class="row" style={{ paddingLeft: "25px", paddingRight: "25px" }}>
                                            <div class="row" style={{ paddingBottom: "5px" }}>
                                                Item Price
                                </div>
                                            <div class="row" style={{ paddingBottom: "15px" }}>
                                                ${this.state.itemPrice}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6"> {itemImage}</div>
                                </div>
                                <div class="row" style={{ paddingLeft: "25px", paddingRight: "25px" }}>
                                    <div class="row" style={{ paddingBottom: "5px" }}>
                                        <p style={{ fontWeight: '900' }} >Quantity</p>
                                    </div>
                                    <div class="row" style={{ paddingBottom: "15px" }}>
                                        <div class="col-md-1">   <input type='button' value='-' class='qtyminus btn-danger' field='quantity' onClick={this.decrementCount} /></div>
                                        <div class="col-md-1" style={{ paddingLeft: "0px", paddingRight: "0px" }}>   <input type='number' name='quantity' min="1" value={this.state.itemCount} class='qty' /></div>
                                        <div class="col-md-1" style={{ paddingLeft: "0px", paddingRight: "0px" }}>   <input type='button' value='+' class='qtyplus btn-success' field='quantity' onClick={this.incrementCount} /></div>
                                        <div class="col-md-9"></div>
                                    </div>

                                </div>

                            </div>

                            <div class="modal-footer">

                                <div class="row">
                                    <div class="col-md-2"></div>
                                    <div class="col-md-3"><button class="btn btn-success btn-lg" style={{ width: '300px' }} onClick={this.addToBag}>Add to bag : ${this.state.itemCostTotal}</button>
                                    </div>
                                    <div class="col-md-7"></div>
                                </div>

                                <div class="row">
                                    <div class="row" style={{ paddingLeft: "25px", paddingRight: "25px", paddingTop: "25px" }}>
                                        {messageDisplay}

                                    </div>

                                </div>


                            </div>

                        </div>
                    </div>
                </div>
                <div class="modal" id="shoppingCart" >
                    <div class="modal-dialog" >
                        <div class="modal-content" >

                            <div class="modal-header">
                                <div class="row">
                                    <div class="col-md-4"></div>
                                    <div class="col-md-6"><h4 class="modal-title">Shopping Cart</h4></div>
                                    <div class="col-md-2"><button type="button" id="closeSection" data-dismiss="modal" onClick={this.closeShoppingCart}>&times;</button></div>
                                </div>


                            </div>

                            <div class="modal-body" style={{ height: "600px" }}>
                                {bagDispay}
                                <div><span class="border border-top-0 border-right-0 border-left-0"></span></div>

                            </div>

                            <div class="modal-footer">

                                <div class="row">
                                    {bagButtonDisplay}
                                </div>


                            </div>

                        </div>
                    </div>
                </div>
                <div class="modal" id="warningMessage" >
                    <div class="modal-dialog" >
                        <div class="modal-content" >

                            <div class="modal-header">
                                <div class="row">
                                    <div class="col-md-4"></div>
                                    <div class="col-md-6"><h4 class="modal-title">Warning Message</h4></div>
                                    <div class="col-md-2"><button type="button" id="closeSection" data-dismiss="modal" onClick={this.warningMessageClose}>&times;</button></div>
                                </div>


                            </div>

                            <div class="modal-body" style={{ fontWeight: "900" }}>
                                Adding this will delete all other items in the bag. Do you want to proceed?
                            </div>

                            <div class="modal-footer">

                                <div class="row">
                                    <div class="col-md-3"></div>
                                    <div class="col-md-3"><button class="btn btn-success btn-lg" onClick={this.emptyBag}>Yes,Please</button></div>
                                    <div class="col-md-3"><button class="btn btn-danger btn-lg" style={{ width: "150px" }} onClick={this.cancelBagAdd}>No, Thanks!</button></div>
                                    <div class="col-md-3"></div>
                                </div>


                            </div>

                        </div>
                    </div>
                </div>

            </div>
        )
    }
}
function mapState(state) {
    const { users, alert } = state;
    return { users, alert };
}
const actionCreators = {
    fetchSections: userActions.fetchSections,
    fetchItems: userActions.fetchItems,
    placeOrder: userActions.placeOrder
};

const connectedDetailsPage = connect(mapState, actionCreators)(DetailsPage);
export { connectedDetailsPage as DetailsPage };
