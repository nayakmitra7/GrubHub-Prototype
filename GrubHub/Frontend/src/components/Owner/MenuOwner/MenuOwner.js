import React, { Component } from 'react';
import '../../../App.css';
import cookie from 'js-cookie';
import { Redirect } from 'react-router';
import { ownerActions } from '../../../redux/actions/owner.actions';
import { alertActions } from '../../../redux/actions/alert.actions';
import { connect } from 'react-redux';


class MenuOwner extends Component {
    constructor(props) {
        super(props);
        this.state = {

            addSection: false,
            addItem: false,
            editItem: false,
            editSection: false,
            deleteItem: false,
            displayItem: true,
            sectionName: "",
            sectionId: "",
            sectionDesc: "",
            errorFlag: "",
            restaurantId: sessionStorage.getItem("RestaurantID"),
            sectionsPresent: [],
            itemName: "",
            itemDesc: "",
            itemPrice: "",
            itemSection: "",
            itemId: "",
            filePreview: null,
            file: null,
            itemForSection: [],
            itemsPresent: [],
            errorMessage: [],
            currentPage: 1,
            itemsPerPage: 4
        }
        this.addItemChangeHandler = this.addItemChangeHandler.bind(this);
        this.addSectionChangeHandler = this.addSectionChangeHandler.bind(this);
        this.sectionNameChangeHandler = this.sectionNameChangeHandler.bind(this);
        this.sectionDescChangeHandler = this.sectionDescChangeHandler.bind(this);
        this.itemNameChangeHandler = this.itemNameChangeHandler.bind(this);
        this.itemDescChangeHandler = this.itemDescChangeHandler.bind(this);
        this.itemPriceChangeHandler = this.itemPriceChangeHandler.bind(this);
        this.itemSectionChangeHandler = this.itemSectionChangeHandler.bind(this);
        this.addItemHandler = this.addItemHandler.bind(this);
        this.fetchItemsforSection = this.fetchItemsforSection.bind(this);
        this.modalCloseSection = this.modalCloseSection.bind(this);
        this.pictureChangeHandler = this.pictureChangeHandler.bind(this)
        this.handleClick = this.handleClick.bind(this);

    }

    componentDidMount() {
        this.props.fetchSections(this.state.restaurantId)
        this.props.fetchItems(this.state.restaurantId)

    }
    componentWillReceiveProps(newProps) {
        let responseArray = []
        this.setState({ sectionsPresent: newProps.owner.sections })
        this.setState({ itemsPresent: newProps.owner.items })
        if (newProps.owner.sections && newProps.owner.items) {
            newProps.owner.sections.forEach((section) => {
                newProps.owner.items.forEach((item) => {
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
    handleClick = (event) => {
        this.setState({
            currentPage: Number(event.target.id)
        })
        for (let i = 1; i <= Math.ceil(this.state.itemsPresent.length / this.state.itemsPerPage); i++) {
            document.getElementById(i).className = "page-item";

        }
        document.getElementById(event.target.id).className = "page-item active";
    }
    pictureChangeHandler = (event) => {
        if (event.target.files[0]) {
            this.setState({
                file: event.target.files[0],
                filePreview: URL.createObjectURL(event.target.files[0])
            });
        }
    }
    fetchItemsforSection = (e) => {
        let itemsForThisSection = (this.state.itemsPresent.filter((item) => {
            if (item.sectionId == e.target.value) {
                return item;
            }
        }))
        this.setState({ itemForSection: itemsForThisSection });

    }
    updateItemHandler = (e) => {
        let data = { itemId: this.state.itemId, itemName: this.state.itemName, itemSection: this.state.itemSection, itemPrice: this.state.itemPrice, itemDesc: this.state.itemDesc, restaurantId: this.state.restaurantId }
        if (this.state.file && this.state.filePreview) {
            let formData = new FormData();
            formData.append('myImage', this.state.file, this.state.itemId);
            const config = {
                headers: {
                    Authorization: 'JWT ' + cookie.get("token"),
                    'content-type': 'multipart/form-data'
                }
            };
            this.props.updateItemAndImage(data,formData,config);
        }else{
            this.props.updateItem(data)
        }
    }


    addItemChangeHandler = (e) => {
        this.props.fetchSections(this.state.restaurantId);
        this.setState({ addItem: true, addSection: false, displayItem: false, errorFlag: "" });
        document.getElementById("modalItem").style.display = "block"
    }
    addSectionChangeHandler = (e) => {
        this.setState({ addItem: false, addSection: true, displayItem: false, errorFlag: "" });
        document.getElementById("modalAddSection").style.display = "block"
    }
    displayItemChangeHandler = (e) => {
        this.fetchItemsforSection(e);
        this.setState({ addItem: false, addSection: false, displayItem: true });

    }
    sectionNameChangeHandler = (e) => {
        this.setState({ sectionName: e.target.value });
    }
    sectionDescChangeHandler = (e) => {
        this.setState({ sectionDesc: e.target.value });
    }
    itemNameChangeHandler = (e) => {
        this.setState({ itemName: e.target.value });
    }
    itemDescChangeHandler = (e) => {
        this.setState({ itemDesc: e.target.value });
    }
    itemPriceChangeHandler = (e) => {
        this.setState({ itemPrice: e.target.value });
    }
    itemSectionChangeHandler = (e) => {
        this.setState({ itemSection: e.target.value });
    }
    deleteItemHandler = () => {
        this.props.deleteItem(this.state.itemId);
        window.location.reload()
    }
    modalClose = () => {
        window.location.reload();
        document.getElementById("preview").value = null
        document.getElementById("modalItem").style.display = "none";

        this.setState({ editItem: false, itemName: "", itemDesc: "", itemPrice: "", itemSection: "", addItem: false, errorFlag: "", errorMessage: [], filePreview: null });
    }
    modalCloseSection = (e) => {
        this.props.fetchSections(this.state.restaurantId)
        this.props.clearAlerts()
        document.getElementById("modalAddSection").style.display = "none";
        this.setState({ editSection: false, sectionName: "", sectionDesc: "", addSection: false, errorFlag: "", errorMessage: [] });
    }
    modalCloseDeleteSection = (e) => {
        document.getElementById("deleteSectionConfrimation").style.display = "none";
        this.setState({ editSection: false, sectionName: "", sectionDesc: "", addSection: false, errorFlag: "", errorMessage: [] });
    }
    editSectionModal = (e) => {
        document.getElementById("modalAddSection").style.display = "block";
        this.state.sectionsPresent.filter((section) => {
            if (section._id == e.target.id) {
                this.setState({ sectionName: section.menuSectionName, editSection: true, sectionId: e.target.id });
                this.setState({ sectionDesc: section.menuSectionDesc });
            }
        })
    }
    editItemModal = (e) => {
        document.getElementById("modalItem").style.display = "block";
        this.state.itemsPresent.filter((item) => {
            if (item._id == e.target.id) {
                this.setState({ itemName: item.ItemName, itemDesc: item.ItemDesc, itemPrice: item.ItemPrice, itemSection: item.sectionId, editItem: true, itemId: item._id, file: item.itemImage });
            }
        })

    }
    deleteSectionHandler = (e) => {
        this.setState({ deleteItem: true });
        document.getElementById("deleteSectionConfrimation").style.display = "block";
        document.getElementById("modalAddSection").style.display = "none";
    }
    updateSectionHandler = (e) => {
        let data = { menuSectionName: this.state.sectionName, menuSectionDesc: this.state.sectionDesc, menuSectionId: this.state.sectionId }
        this.props.updateSection(data);
    }
    
    addItemHandler = (e) => {
        e.preventDefault();
        let data = { itemName: this.state.itemName, itemDesc: this.state.itemDesc, itemPrice: this.state.itemPrice, restaurantId: this.state.restaurantId, itemSection: this.state.itemSection }
        if (this.state.file) {
            const config = {
                headers: {
                    Authorization: 'JWT ' + cookie.get("token"),
                    'content-type': 'multipart/form-data'
                }
            };
            this.props.addItemImageAndItem(data, this.state.file, config);
        } else {
            this.props.addItem(data);

        }
    }

    addSectionHandler = (e) => {
        let data = { sectionName: this.state.sectionName, sectionDesc: this.state.sectionDesc, restaurantId: this.state.restaurantId }
        this.props.addSection(data);
    }

    deleteItemPlusSection = (e) => {
        this.props.deleteSection(this.state.sectionId);
        window.location.reload();
    }
    render() {
        let redirectVar = "";
        let image = "";
        let SectionHeading = "";
        let messageDisplay = "";
        let buttonItem = "";
        let ItemHeading = "";
        let array = [];
        let buttonSection = "";
        let renderPageNumbers = [];
        let currentPageitems = [];
        let itemsToDelete = "";
        const { alert } = this.props;
        let alertMessage = [];
        if (!cookie.get("token")) {
            redirectVar = <Redirect to="/LoginOwner" />
        }


        if (this.state.deleteItem == true) {
            itemsToDelete = this.state.itemsPresent.map((item) => {
                if (this.state.sectionId == item.sectionId) {
                    return (<li>{item.ItemName}</li>)
                }
            })
        }
        if (alert.message) {
            alert.message.forEach(element => {
                if (alert.type == "success") {
                    alertMessage.push(<div class="alert alert-success">{element.msg}</div>)

                } else {
                    alertMessage.push(<div class="alert alert-danger">{element.msg}</div>)

                }
            });
        }
        if (this.state.itemsPresent) {
            const { itemsPresent, currentPage, itemsPerPage } = this.state;
            const indexOfLastTodo = currentPage * itemsPerPage;
            const indexOfFirstTodo = indexOfLastTodo - itemsPerPage;
            currentPageitems = itemsPresent.slice(indexOfFirstTodo, indexOfLastTodo);
            const pageNumbers = [];
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


        if (this.state.editSection == true) {
            buttonSection = (<div class="row">
                <div class="col-md-4"><button type="button" onClick={this.deleteSectionHandler} class="btn btn-danger btn-md">Delete Section</button></div>
                <div class="col-md-4"></div>
                <div class="col-md-4"><button type="button" onClick={this.updateSectionHandler} class="btn btn-success btn-md">Update Section</button></div>
            </div>)
            SectionHeading = "Edit Section"
        } else if (this.state.editSection == false) {
            buttonSection = (<div class="row">
                <div class="col-md-3"></div>
                <div class="col-md-4">
                    <button type="button" onClick={this.addSectionHandler} class="btn btn-success btn-md">Add Section</button>
                </div>
                <div class="col-md-4"></div>
            </div>)

            SectionHeading = "Add Section"
        }

        if (this.state.editItem == true) {
            buttonItem = (<div class="row">
                <div class="col-md-4"><button type="button" onClick={this.deleteItemHandler} class="btn btn-danger btn-md">Delete Item</button></div>
                <div class="col-md-4"></div>
                <div class="col-md-4"><button type="button" onClick={this.updateItemHandler} class="btn btn-success btn-md">Update Item</button></div>
            </div>)
            ItemHeading = "Edit Item"
            if (this.state.filePreview) {
                image = (<div><input type="file" accept="image/*" onChange={this.pictureChangeHandler} name="myImage" id="preview" class="custom-file-input" /><div class="img" style={{ paddingTop: '20px' }}><img style={{ width: "50%" }} src={this.state.filePreview} class="rounded" /></div></div>)

            } else if (this.state.file) {
                image = (<div><input type="file" accept="image/*" onChange={this.pictureChangeHandler} name="myImage" id="preview" class="custom-file-input" /><div class="img" style={{ paddingTop: '20px' }}><img style={{ width: "50%" }} src={this.state.file} class="rounded" /></div></div>)

            } else {
                image = (<div><input type="file" accept="image/*" onChange={this.pictureChangeHandler} name="myImage" id="preview" class="custom-file-input" /><div class="img" style={{ paddingTop: '20px' }}><img style={{ width: "50%" }} src="//placehold.it/500x300" class="rounded" /></div></div>)

            }
        } else {
            buttonItem = (<div class="row">
                <div class="col-md-3"></div>
                <div class="col-md-4">
                    <button type="button" onClick={this.addItemHandler} class="btn btn-success btn-md">Add Item</button>
                </div>
                <div class="col-md-4"></div>
            </div>)
            ItemHeading = "Add Item"
            if (this.state.filePreview) {
                image = (<div><input type="file" accept="image/*" onChange={this.pictureChangeHandler} name="myImage" id="preview" class="custom-file-input" /><div class="img" style={{ paddingTop: '20px' }}><img style={{ width: "80%" }} src={this.state.filePreview} class="rounded" /></div></div>)

            } else {
                image = (<div><input type="file" accept="image/*" onChange={this.pictureChangeHandler} name="myImage" id="preview" class="custom-file-input" /><div class="img" style={{ paddingTop: '20px' }}><img style={{ width: "80%" }} src="//placehold.it/500x300" class="rounded" /></div></div>)

            }
        }

        if (this.state.sectionsPresent) {
            this.state.sectionsPresent.map((section) => {
                let flag = 0;
                array.push(<div>
                    <div class="row" style={{ fontSize: "20px", fontWeight: "900" }}>
                        <div class="col-md-1" style={{ textAlign: 'right' }}><span class="glyphicon glyphicon-pencil" id={section._id} onClick={this.editSectionModal}></span> </div>
                        <div class="col-md-11" style={{ alignItems: "right" }}>{section.menuSectionName} </div>
                    </div>
                    <br></br>

                </div>)
                currentPageitems.filter((item) => {

                    if (item.sectionId == section._id) {
                        flag = 1;
                        array.push(
                            <div class="row embossed-heavy" style={{ marginLeft: '10px', marginRight: '200px', marginBottom: '10px', paddingBottom: '10px', fontWeight: 'bold', backgroundColor: 'white', paddingTop: '10px' }}>
                                <span class="border border-dark">
                                    <div class="col-md-5"><img style={{ width: "50%" }} src={item.itemImage} class="rounded" /></div>
                                    <div class="col-md-5">
                                        <div class="row" style={{ fontSize: "15px", fontWeight: "600", color: "blue" }}>
                                            <p onClick={this.editItemModal} id={item._id}>{item.ItemName}</p></div>
                                        <div class="row">{item.ItemDesc}</div>
                                    </div>
                                    <div class="col-md-1"></div>
                                    <div class="col-md-1">
                                        <div class="row" style={{ fontSize: "15px", fontWeight: "600" }}>Price</div>
                                        <div class="row">${item.ItemPrice}</div>
                                    </div>

                                    <br></br>
                                </span><br></br></div>)
                    }
                })
                if (flag == 0) {
                    array.pop();
                }
            })
        } else {
            array.push(<div class="alert alert-info row" style={{ fontSize: "30px", marginTop: "200px", marginBottom: "200px", paddingLeft: "80px" }}>Welcome New User!! Let's get the menu going!!</div>)
        }

        if (this.state.errorFlag == "Some error") {
            messageDisplay = (this.state.errorMessage.map((error) => {
                return (<li class=" li alert-danger">{error.msg}</li>)
            }))
        } else if (this.state.errorFlag == "Success") {
            messageDisplay = (<ul class="li alert alert-success">Successfully Updated !!!</ul>);
        }
        let addDropDown = "";

        if (this.state.addItem == true) {
            addDropDown = (
                this.state.sectionsPresent.map((section) => {

                    return (<option value={section._id}>{section.menuSectionName}</option>)


                }))
        } else if (this.state.editItem == true) {
            addDropDown = (
                this.state.sectionsPresent.map((section) => {
                    if (section._id == this.state.itemSection) {
                        return (<option value={section._id} selected>{section.menuSectionName}</option>)
                    } else {
                        return (<option value={section._id}>{section.menuSectionName}</option>)
                    }

                }))
        }

        return (
            <div>
                {redirectVar}
                <div class="row">
                    <div class="col-md-12"> <p align="center" style={{ fontSize: '50px', color: 'crimson', paddingLeft: '20px', paddingRight: '20px', }}>{sessionStorage.getItem("RestaurantName")}</p></div>
                </div>
                <div class="row">
                    <div class="col-md-4"></div>
                    <div class="col-md-4">
                        <ul id="page-numbers" class="pagination pagination-lg" style={{ marginBottom: '10px' }}>
                            {renderPageNumbers}
                        </ul>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4"></div>
                    <div class="col-md-4"></div>
                    <div class="col-md-4">
                        <button type="button" onClick={this.addItemChangeHandler} style={{ marginTop: '20px' }} class="btn btn-info btn-md col-sm-3">Add New Item</button>
                    </div>
                </div>
                <br></br>
                <div class="row ">
                    <div class="col-md-2" style={{ marginTop: '0px', paddingLeft: '20px', paddingRight: '0px' }}>
                        <ul class="list-group">
                            <p style={{ color: "#0033cc", fontWeight: "bolder" }} onClick={this.addSectionChangeHandler}>ADD NEW SECTION</p>
                        </ul>
                    </div>
                    <div class="col-md-6">
                        {array}
                    </div>
                    <div class="col-md-4"></div>
                </div>

                <div class="row">
                    <div class="col-sm-5"></div>
                    <div class="col-sm-5" style={{ marginTop: '0px' }}></div>
                </div>
                <div class="modal modal-backdrop" id="modalItem" >
                    <div class="modal-dialog">
                        <div class="modal-content">

                            <div class="modal-header">
                                <div class="row">
                                    <div class="col-md-5"></div>
                                    <div class="col-md-6"><h4 class="modal-title">{ItemHeading}</h4></div>
                                    <div class="col-md-1"><button type="button" id="close" data-dismiss="modal" onClick={this.modalClose}>&times;</button></div>
                                </div>


                            </div>

                            <div class="modal-body">
                                <div class="row" style={{ paddingLeft: "25px" }}>
                                    <div class="col-md-6">
                                        <div class="row">
                                            <div class="row" style={{ paddingBottom: "5px" }}>Item</div>
                                            <div class="row signup" style={{ paddingBottom: "15px" }}><input value={this.state.itemName} onChange={this.itemNameChangeHandler} type="text" class="form-control" name="itemName" /></div>
                                        </div>
                                        <div class="row">
                                            <div class="row">Description</div>
                                            <div class="row signup" style={{ paddingBottom: "15px" }}><input value={this.state.itemDesc} onChange={this.itemDescChangeHandler} type="text" class="form-control" name="itemDesc" /></div>
                                        </div>

                                        <div class="row">
                                            <div class="row" style={{ paddingBottom: "5px" }}>
                                                Sections
                                </div>
                                            <div class="row" style={{ paddingBottom: "15px" }}>
                                                <select onChange={this.itemSectionChangeHandler}>
                                                    <option value={0}>select</option>
                                                    {addDropDown}
                                                </select>
                                            </div>
                                        </div>
                                    </div>


                                    <div class="col-md-6">{image}</div>
                                </div>
                                <div class="row" style={{ paddingLeft: "25px", paddingRight: "25px" }}>
                                    <div class="row" style={{ paddingBottom: "5px" }}>
                                        Base Price
                                </div>
                                    <div class="row" style={{ paddingBottom: "15px" }}>
                                        <input value={this.state.itemPrice} onChange={this.itemPriceChangeHandler} type="number" class="form-control" name="lastName" />
                                    </div>
                                </div>
                            </div>

                            <div class="modal-footer">
                                {buttonItem}
                                <div class="row" style={{ marginTop: "20px", textAlign: 'center' }}>
                                    {alertMessage}

                                </div>


                            </div>

                        </div>
                    </div>
                </div>
                <div class="modal modal-backdrop" id="modalAddSection" >
                    <div class="modal-dialog">
                        <div class="modal-content">

                            <div class="modal-header">
                                <div class="row">
                                    <div class="col-md-5"></div>
                                    <div class="col-md-6"><h4 class="modal-title">{SectionHeading}</h4></div>
                                    <div class="col-md-1"><button type="button" id="closeSection" data-dismiss="modal" onClick={this.modalCloseSection}>&times;</button></div>
                                </div>


                            </div>

                            <div class="modal-body">
                                <div class="row" style={{ paddingLeft: "25px", paddingRight: "25px" }}>
                                    <div class="row" style={{ paddingBottom: "5px" }}>
                                        Sections
                                </div>
                                    <div class="row" style={{ paddingBottom: "15px" }}>
                                        <input onChange={this.sectionNameChangeHandler} type="text" class="form-control signup" name="sectionName" value={this.state.sectionName} />
                                    </div>
                                </div>
                                <div class="row" style={{ paddingLeft: "25px", paddingRight: "25px" }}>
                                    <div class="row" style={{ paddingBottom: "5px" }}>
                                        Description
                                </div>
                                    <div class="row" style={{ paddingBottom: "15px" }}>
                                        <input onChange={this.sectionDescChangeHandler} type="text" class="form-control" name="sectionDesc" value={this.state.sectionDesc} />                                </div>
                                </div>
                            </div>

                            <div class="modal-footer">
                                {buttonSection}
                                <div class="row" style={{ marginTop: "20px", textAlign: "center" }}>
                                    {alertMessage}

                                </div>


                            </div>

                        </div>
                    </div>
                </div>
                <div class="modal modal-backdrop" id="deleteSectionConfrimation" >
                    <div class="modal-dialog">
                        <div class="modal-content">

                            <div class="modal-header">
                                <div class="row">

                                    <div class="col-md-11"><h4 class="modal-title">Are you sure you want to delete the section? <br></br>
                                        The items below will be deleted along with the section</h4></div>
                                    <div class="col-md-1"><button type="button" id="closeSection" data-dismiss="modal" onClick={this.modalCloseDeleteSection}>&times;</button></div>
                                </div>

                            </div>

                            <div class="modal-body">
                                {itemsToDelete}

                            </div>

                            <div class="modal-footer">
                                <div class="row">
                                    <div class="col-md-2"></div>
                                    <div class="col-md-5"><button type="button" onClick={this.deleteItemPlusSection} class="btn btn-danger btn-md">Delete Section</button></div>
                                    <div class="col-md-4"></div>
                                </div>
                                <div class="row">
                                    {messageDisplay}

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
    const { owner, alert } = state;
    return { owner, alert };
}
const actionCreators = {
    fetchSections: ownerActions.getSections,
    fetchItems: ownerActions.getItems,
    addSection: ownerActions.addSection,
    clearAlerts: alertActions.clear,
    updateSection: ownerActions.updateSection,
    deleteItem: ownerActions.deleteItem,
    addItem: ownerActions.addItem,
    addItemImageAndItem: ownerActions.addItemImageAndItem,
    updateItem:ownerActions.updateItem,
    updateItemAndImage:ownerActions.updateItemAndImage,
    deleteSection:ownerActions.deleteSection
};

const connectedMenuOwner = connect(mapState, actionCreators)(MenuOwner);
export { connectedMenuOwner as MenuOwner };
