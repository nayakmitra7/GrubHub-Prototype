
import React, { Component } from 'react';
import cookie from 'js-cookie';
import axios from 'axios';
import { Redirect } from 'react-router';
import { address } from '../../../constant'
import '../../../App.css';

class SearchPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemSearched: sessionStorage.getItem("ItemSearched"),
            restaurantsServingItem: [],
            errorMessage: "",
            itemToPrint: "",
            filterFlag: false,
            filterVal: "",
            detailsFlag: false,
            searchFlag: false,
            restaurantImage: "",
            bag: localStorage.getItem(sessionStorage.getItem("username")) ? JSON.parse(localStorage.getItem(sessionStorage.getItem("username"))) : [],
            authFlag: true,
            currentPage: 1,
            restaurantsPerPage: 4
        }
        this.showRestaurantDetails = this.showRestaurantDetails.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick = (event) => {
        this.setState({
            currentPage: Number(event.target.id), filterFlag: false
        })
        for (var i = 1; i <= Math.ceil(this.state.restaurantsServingItem.length / this.state.restaurantsPerPage); i++) {
            document.getElementById(i).className = "page-item";

        }
        document.getElementById(event.target.id).className = "page-item active";
    }
    itemSearch = () => {
        if (this.state.itemSearched.length) {
            this.setState({ itemToPrint: this.state.itemSearched, filterFlag: false })
            axios.get(address + '/owner/searched/' + this.state.itemSearched, {
                headers: { Authorization: 'JWT ' + cookie.get("token") }
            })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            restaurantsServingItem: response.data
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
                })

        }

    }
    showRestaurantDetails = (e) => {
        sessionStorage.setItem("RestaurantID", e.target.id);
        sessionStorage.setItem("RestaurantName", e.target.innerHTML);
        sessionStorage.setItem("ItemSearched", "")
        this.setState({ detailsFlag: true, searchFlag: false })

    }
    itemSearchedChangeHandler = (e) => {
        this.setState({ itemSearched: e.target.value, searchFlag: false })
    }
    serachFood = () => {
        this.setState({ errorFlag: "", searchFlag: true })
        sessionStorage.setItem("ItemSearched", this.state.itemSearched);
        this.itemSearch();
    }

    componentDidMount() {
        this.setState({
            itemSearched: sessionStorage.getItem("ItemSearched")
        })
        this.itemSearch();
    }
    filterView = (e) => {
        if (e.target.innerHTML == "None") {
            this.setState({ filterFlag: false })
        } else {
            this.setState({ filterFlag: true, filterVal: e.target.innerHTML })
        }
    }
    render() {


        let redirectVar = null;
        let array = [];
        let renderPageNumbers = [];
        if (!this.state.authFlag) {
            redirectVar = <Redirect to="/login" />
        }
        if (this.state.detailsFlag == true) {
            redirectVar = <Redirect to="/DetailsPage" />
        }
        const { restaurantsServingItem, currentPage, restaurantsPerPage } = this.state;
        const indexOfLastTodo = currentPage * restaurantsPerPage;
        const indexOfFirstTodo = indexOfLastTodo - restaurantsPerPage;
        const currentPageRestaurant = restaurantsServingItem.slice(indexOfFirstTodo, indexOfLastTodo);
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(restaurantsServingItem.length / restaurantsPerPage); i++) {
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
        if (this.state.filterFlag) {
            renderPageNumbers = []
        }
        if (this.state.restaurantsServingItem.length) {

            currentPageRestaurant.map((restaurant) => {

                array.push(
                    <div class="row embossed-heavy " style={{ marginBottom: '0px', borderStyle: "groove", paddingTop: '20px', paddingBottom: '20px', backgroundColor: 'white' }}>
                        <span class="border border-dark">
                            <div class="col-md-3"><img style={{ width: "80%" }} src={restaurant.restaurantImage} class="rounded" /></div>
                            <div class="col-md-5">
                                <div class="row" style={{ fontSize: "15px", fontWeight: "600", color: "blue" }}>
                                    <p onClick={this.showRestaurantDetails} id={restaurant._id}>{restaurant.restaurantName}</p></div>
                                <div class="row">{restaurant.restaurantCuisine}</div>
                            </div>
                            <div class="col-md-4"></div>


                            <br></br>
                        </span><br></br></div>)
            })
        } else {
            array.push(<div class="searchNotFound" style={{}}></div>)
        }
        if (this.state.filterFlag == true) {
            array = [];
            this.state.restaurantsServingItem.map((restaurant) => {
                if (restaurant.restaurantCuisine.toUpperCase() == this.state.filterVal.toUpperCase()) {
                    array.push(
                        <div class="row embossed-heavy " style={{ marginBottom: '0px', borderStyle: "groove", paddingTop: '20px', paddingBottom: '20px', backgroundColor: 'white' }}>
                            <span class="border border-dark">
                                <div class="col-md-3"><img style={{ width: "80%" }} src={restaurant.restaurantImage} class="rounded" /></div>
                                <div class="col-md-5">
                                    <div class="row" style={{ fontSize: "15px", fontWeight: "600", color: "blue" }}>
                                        <p onClick={this.showRestaurantDetails} id={restaurant._id}>{restaurant.restaurantName}</p></div>
                                    <div class="row">{restaurant.restaurantCuisine}</div>
                                </div>
                                <div class="col-md-4"></div>


                                <br></br>
                            </span><br></br></div>)
                }

            })
        }


        let messageDisplay = "";
        var filterBy = "";
        if (this.state.errorFlag == "Some error") {
            messageDisplay = (this.state.errorMessage.map((error) => {
                return (<li class=" li alert-danger">{error.msg}</li>)
            }))
        } else if (this.state.errorFlag == "Success") {
            messageDisplay = (<ul class="li alert alert-success">Successfully Updated !!!</ul>);
        }
        if (this.state.restaurantsServingItem.length) {
            var set1 = new Set();
            var set2 = new Set();
            set1.add(<li class="li" onClick={this.filterView}>None</li>)
            this.state.restaurantsServingItem.forEach((item) => {
                if (!set2.has(item.restaurantCuisine.toUpperCase())) {
                    set2.add(item.restaurantCuisine.toUpperCase())
                    set1.add(<li class="li"><div id={item.restaurantCuisine} onClick={this.filterView} style={{ backgroundColor: "" }}>{item.restaurantCuisine}</div></li>)
                }
            })
            filterBy = set1;
        }

        return (
            <div>
                {redirectVar}
                <div class="row" style={{ backgroundColor: "white" }}>
                    <div class="col-md-6" style={{ marginTop: '20px', paddingLeft: '25px' }}>
                        <div class="col-md-6 "><input onChange={this.itemSearchedChangeHandler} style={{ height: '45px' }} class="col-md-12" type="text" placeholder="What are you looking for?"></input></div>
                        <div class="col-md-2"><button class="btn btn-info btn-lg" onClick={this.serachFood} >Find Food</button></div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4" style={{ paddingTop: '30px', fontSize: '24px', paddingBottom: '0px', paddingLeft: '30px' }}>The Restaurants serving {this.state.itemToPrint} are:</div>
                    <div class="col-md-6"></div>
                    <div class="col-md-2" style={{ marginTop: '20px' }}>
                        <div class="dropdown">
                            <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Filter by
    <span class="glyphicon glyphicon-filter"></span></button>
                            <ul class="dropdown-menu">
                                {filterBy}
                            </ul>
                        </div>


                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4"></div>
                    <div class="col-md-4">
                        <ul id="page-numbers" class="pagination" style={{marginBottom:'10px'}}>
                            {renderPageNumbers}
                        </ul>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-2"></div>
                    <div class="col-md-6">
                        <ul>
                            {array}
                        </ul>
                    </div>
                    <div class="col-md-4"></div>
                </div>
               
                {messageDisplay}

            </div>

        )
    }
}

export default SearchPage;

