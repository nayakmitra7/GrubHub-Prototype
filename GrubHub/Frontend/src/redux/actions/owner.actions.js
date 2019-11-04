import { ownerConstants } from '../constants/owner.constants';
import { ownerService } from '../services/owner.service';
import { history } from '../helper/history';
import { alertActions } from '../actions/alert.actions';
import cookie from 'js-cookie';

export const ownerActions = {
    login, signUp, FetchOwner, fetchBasic, fetchMessageReceived, fetchMessageSent, fetchNewOrders, fetchConfirmedOrders,
    fetchPreparingOrders, fetchReadyOrders, fetchCancelledOrders, cancelOrders, statusChange, sendMessage, fetchPastOrders, uploadOwnerImage,
    uploadRestaurantImage, fetchOwnerDetails, updateDetails, getSections, getItems, addSection, updateSection, deleteItem, addItem, 
    addItemImageAndItem,updateItem,updateItemAndImage,deleteSection
};

function login(username, password) {
    return dispatch => {
        dispatch(request({ username }));
        ownerService.login(username, password)
            .then((response) => {
                sessionStorage.setItem("username", username);
                cookie.set("token", response.data.tokens);
                dispatch(success(response.data));
                history.push("/HomeOwner");
            }).catch((error) => {
                dispatch(failure(JSON.stringify(error.data)));
                dispatch(alertActions.error(error.data));
            })
    };
    function request() { return { type: ownerConstants.OWNER_LOGIN_REQUEST } }
    function success(owner) { return { type: ownerConstants.OWNER_LOGIN_SUCCESS, owner } }
    function failure(error) { return { type: ownerConstants.OWNER_LOGIN_FAILURE, error } }
}
function fetchBasic(username) {
    return dispatch => {
        dispatch(request({ username }));
        ownerService.fetchBasic(username)
            .then((response) => {
                dispatch(success(username));
                sessionStorage.setItem("OwnerFirstName", response.data.ownerFirstName);
                sessionStorage.setItem("RestaurantID", response.data._id)
                sessionStorage.setItem("RestaurantName", response.data.restaurantName)
            }).catch((error) => {
                dispatch(failure(JSON.stringify(error)));
            })
    };
    function request(user) { return { type: ownerConstants.OWNER_BASIC_REQUEST, user } }
    function success(user) { return { type: ownerConstants.OWNER_BASIC_SUCCESS, user } }
    function failure(error) { return { type: ownerConstants.OWNER_BASIC_FAILURE, error } }
}
function fetchMessageReceived() {
    return dispatch => {
        dispatch(request());
        ownerService.fetchMessageReceived()
            .then((response) => {
                dispatch(success(response.data));
            }).catch((error) => {
                dispatch(failure(JSON.stringify(error)));
                sessionStorage.clear();
                cookie.remove("token");
                history.push("/LoginOwner")
            })
    };
    function request() { return { type: ownerConstants.OWNER_FETCH_RECEIVED_MESSAGE_REQUEST } }
    function success(message) { return { type: ownerConstants.OWNER_FETCH_RECEIVED_MESSAGE_SUCCESS, message } }
    function failure(error) { return { type: ownerConstants.OWNER_FETCH_RECEIVED_MESSAGE_FAILURE, error } }
}
function fetchMessageSent() {
    return dispatch => {
        dispatch(request());
        ownerService.fetchMessageSent()
            .then((response) => {
                dispatch(success(response.data));
            }).catch((error) => {
                dispatch(failure(JSON.stringify(error)));
                sessionStorage.clear();
                cookie.remove("token");
                history.push("/LoginOwner")
            })
    };
    function request() { return { type: ownerConstants.OWNER_FETCH_SENT_MESSAGE_REQUEST } }
    function success(message) { return { type: ownerConstants.OWNER_FETCH_SENT_MESSAGE_SUCCESS, message } }
    function failure(error) { return { type: ownerConstants.OWNER_FETCH_SENT_MESSAGE_FAILURE, error } }
}
function fetchNewOrders() {
    return dispatch => {
        dispatch(request());
        ownerService.fetchNewOrders()
            .then((response) => {
                dispatch(success(response.data));
            }).catch((error) => {
                dispatch(failure(JSON.stringify(error)));
                sessionStorage.clear();
                cookie.remove("token");
                history.push("/LoginOwner")
            })
    };
    function request() { return { type: ownerConstants.OWNER_FETCH_NEW_ORDERS_REQUEST } }
    function success(orders) { return { type: ownerConstants.OWNER_FETCH_NEW_ORDERS_SUCCESS, orders } }
    function failure(error) { return { type: ownerConstants.OWNER_FETCH_NEW_ORDERS_FAILURE, error } }
}

function fetchConfirmedOrders() {
    return dispatch => {
        dispatch(request());
        ownerService.fetchConfirmedOrders()
            .then((response) => {
                dispatch(success(response.data));
            }).catch((error) => {
                dispatch(failure(JSON.stringify(error)));
                sessionStorage.clear();
                cookie.remove("token");
                history.push("/LoginOwner")
            })
    };
    function request() { return { type: ownerConstants.OWNER_FETCH_CONFIRMED_ORDERS_REQUEST } }
    function success(orders) { return { type: ownerConstants.OWNER_FETCH_CONFIRMED_ORDERS_SUCCESS, orders } }
    function failure(error) { return { type: ownerConstants.OWNER_FETCH_CONFIRMED_ORDERS_FAILURE, error } }
}

function fetchPreparingOrders() {
    return dispatch => {
        dispatch(request());
        ownerService.fetchPreparingOrders()
            .then((response) => {
                dispatch(success(response.data));
            }).catch((error) => {
                dispatch(failure(JSON.stringify(error)));
                sessionStorage.clear();
                cookie.remove("token");
                history.push("/LoginOwner")
            })
    };
    function request() { return { type: ownerConstants.OWNER_FETCH_PREPARING_ORDERS_REQUEST } }
    function success(orders) { return { type: ownerConstants.OWNER_FETCH_PREPARING_ORDERS_SUCCESS, orders } }
    function failure(error) { return { type: ownerConstants.OWNER_FETCH_PREPARING_ORDERS_FAILURE, error } }
}

function fetchReadyOrders() {
    return dispatch => {
        dispatch(request());
        ownerService.fetchReadyOrders()
            .then((response) => {
                dispatch(success(response.data));
            }).catch((error) => {
                dispatch(failure(JSON.stringify(error)));
                sessionStorage.clear();
                cookie.remove("token");
                history.push("/LoginOwner")
            })
    };
    function request() { return { type: ownerConstants.OWNER_FETCH_READY_ORDERS_REQUEST } }
    function success(orders) { return { type: ownerConstants.OWNER_FETCH_READY_ORDERS_SUCCESS, orders } }
    function failure(error) { return { type: ownerConstants.OWNER_FETCH_READY_ORDERS_FAILURE, error } }
}
function fetchCancelledOrders() {
    return dispatch => {
        dispatch(request());
        ownerService.fetchCancelledOrders()
            .then((response) => {
                dispatch(success(response.data));
            }).catch((error) => {
                dispatch(failure(JSON.stringify(error)));
                sessionStorage.clear();
                cookie.remove("token");
                history.push("/LoginOwner")
            })
    };
    function request() { return { type: ownerConstants.OWNER_FETCH_CANCELLED_ORDERS_REQUEST } }
    function success(orders) { return { type: ownerConstants.OWNER_FETCH_CANCELLED_ORDERS_SUCCESS, orders } }
    function failure(error) { return { type: ownerConstants.OWNER_FETCH_CANCELLED_ORDERS_FAILURE, error } }
}
function cancelOrders(data) {
    return dispatch => {
        dispatch(request());
        ownerService.cancelOrders(data)
            .then((response) => {
                dispatch(success(response.data));
            }).catch((error) => {
                dispatch(failure(JSON.stringify(error)));
                sessionStorage.clear();
                cookie.remove("token");
                history.push("/LoginOwner")
            })
    };
    function request() { return { type: ownerConstants.CANCEL_ORDERS_REQUEST } }
    function success() { return { type: ownerConstants.CANCEL_ORDERS_SUCCESS } }
    function failure(error) { return { type: ownerConstants.CANCEL_ORDERS_FAILURE, error } }
}

function statusChange(data) {
    return dispatch => {
        dispatch(request());
        ownerService.statusChange(data)
            .then((response) => {
                dispatch(success(response.data));
            }).catch((error) => {
                dispatch(failure(JSON.stringify(error)));
                sessionStorage.clear();
                cookie.remove("token");
                history.push("/LoginOwner")
            })
    };
    function request() { return { type: ownerConstants.ORDER_STATUS_CHANGE_REQUEST } }
    function success() { return { type: ownerConstants.ORDER_STATUS_CHANGE_SUCCESS } }
    function failure(error) { return { type: ownerConstants.ORDER_STATUS_CHANGE_FAILURE, error } }
}
function sendMessage(data) {
    let details = data;
    return dispatch => {
        dispatch(request());
        ownerService.sendMessage(details)
            .then((response) => {
                dispatch(success(response.data));
            }).catch((error) => {
                dispatch(failure(JSON.stringify(error)));
                sessionStorage.clear();
                cookie.remove("token");
                history.push("/LoginOwner")
            })
    };
    function request() { return { type: ownerConstants.SEND_MESSAGE_REQUEST } }
    function success() { return { type: ownerConstants.SEND_MESSAGE_SUCCESS } }
    function failure(error) { return { type: ownerConstants.SEND_MESSAGE_FAILURE, error } }
}
function fetchPastOrders() {
    return dispatch => {
        dispatch(request());
        ownerService.fetchPastOrder()
            .then((response) => {
                dispatch(success(response.data));
            }).catch((error) => {
                dispatch(failure(JSON.stringify(error)));
                sessionStorage.clear();
                cookie.remove("token");
                history.push("/LoginOwner")
            })
    };
    function request() { return { type: ownerConstants.FETCH_PAST_ORDER_REQUEST } }
    function success(orders) { return { type: ownerConstants.FETCH_PAST_ORDER_SUCCESS, orders } }
    function failure(error) { return { type: ownerConstants.FETCH_PAST_ORDER_FAILURE, error } }
}
function uploadOwnerImage(formData, config) {
    return dispatch => {
        dispatch(request());
        ownerService.uploadOwnerImage(formData, config)
            .then((response) => {
                dispatch(success(response.data));
                let successMessage = [];
                successMessage.push({ msg: "Successfully Updated" })
                dispatch(alertActions.success(successMessage));
            }).catch((error) => {
                dispatch(failure(JSON.stringify(error)));
                sessionStorage.clear();
                cookie.remove("token");
                history.push("/LoginOwner")
            })
    };
    function request() { return { type: ownerConstants.UPLOAD_OWNER_IMAGE_REQUEST } }
    function success(message) { return { type: ownerConstants.UPLOAD_OWNER_IMAGE_SUCCESS, message } }
    function failure(error) { return { type: ownerConstants.UPLOAD_OWNER_IMAGE_FAILURE, error } }
}
function uploadRestaurantImage(formData, config) {
    return dispatch => {
        dispatch(request());
        ownerService.uploadRestaurantImage(formData, config)
            .then((response) => {
                dispatch(success(response.data));
                let successMessage = [];
                successMessage.push({ msg: "Successfully Updated" })
                dispatch(alertActions.success(successMessage));
            }).catch((error) => {
                dispatch(failure(JSON.stringify(error)));
                sessionStorage.clear();
                cookie.remove("token");
                history.push("/LoginOwner")
            })
    };
    function request() { return { type: ownerConstants.UPLOAD_RESTAURANT_IMAGE_REQUEST } }
    function success(message) { return { type: ownerConstants.UPLOAD_RESTAURANT_IMAGE_SUCCESS, message } }
    function failure(error) { return { type: ownerConstants.UPLOAD_RESTAURANT_IMAGE_FAILURE, error } }
}
function signUp(data) {
    let username = data.username;
    return dispatch => {
        dispatch(request({ username }));

        ownerService.signUp(data)
            .then((response) => {
                dispatch(success(username));
                sessionStorage.setItem("OwnerFirstName", response.data.owner.ownerFirstName)
                sessionStorage.setItem("username", response.data.owner.ownerEmail);
                sessionStorage.setItem("RestaurantID", response.data.owner._id);
                cookie.set("token", response.data.tokens);
                history.push("/SetUpOwner");
            }).catch((error) => {
                dispatch(failure(JSON.stringify(error)));
                dispatch(alertActions.error(error.data));
            })
    };
    function request(user) { return { type: ownerConstants.OWNER_SIGNUP_REQUEST, user } }
    function success(user) { return { type: ownerConstants.OWNER_SIGNUP_SUCCESS, user } }
    function failure(error) { return { type: ownerConstants.OWNER_SIGNUP_FAILURE, error } }
}

function FetchOwner(data) {
    let username = data.username;
    return dispatch => {
        dispatch(request({ username }));

        ownerService.FetchOwner(username).then((response) => {
            ownerService.FetchRestaurant(response.restaurantId).then((responses) => {
                dispatch(success(responses[0]));
            })

        }).catch((error) => {
            dispatch(failure(error));
            dispatch(alertActions.error(error));
        })
    };
    function request(user) { return { type: ownerConstants.FETCH_REQUEST, user } }
    function success(user) { return { type: ownerConstants.FETCH_SUCCESS, user } }
    function failure(user) { return { type: ownerConstants.FETCH_FAILURE, user } }
}
function fetchOwnerDetails() {
    return dispatch => {
        dispatch(request());
        ownerService.fetchOwnerDetails()
            .then((response) => {
                dispatch(success(response.data));
            }).catch((error) => {
                dispatch(failure(JSON.stringify(error.data)));
                sessionStorage.clear();
                cookie.remove("token");
                history.push("/LoginOwner")
            })
    };
    function request() { return { type: ownerConstants.OWNER_DETAILS_REQUEST } }
    function success(details) { return { type: ownerConstants.OWNER_DETAILS_SUCCESS, details } }
    function failure(error) { return { type: ownerConstants.OWNER_DETAILS_FAILURE, error } }
}

function updateDetails(data) {
    return dispatch => {
        dispatch(request(data.email));

        ownerService.updateDetails(data)
            .then((response) => {
                sessionStorage.setItem("OwnerFirstName", data.firstName)
                sessionStorage.setItem("RestaurantName", data.restaurantName)
                dispatch(success(response.data));
                let successMessage = [];
                successMessage.push({ msg: "Successfully Updated" })
                dispatch(alertActions.success(successMessage));
            }).catch((error) => {
                if (error.status == 201) {
                    let data1 = { ownerFirstName: data.firstName, ownerLastName: data.lastName, ownerEmail: data.email, ownerPhone: data.phone, restaurantName: data.restaurantName, restaurantAddress: data.restaurantAddress, restaurantCuisine: data.restaurantCuisine, restaurantZipCode: data.restaurantZipCode, ownerImage: data.ownerImage, restaurantImage: data.restaurantImage };
                    dispatch(failure(data1));
                    dispatch(alertActions.error(error.data));
                } else {
                    sessionStorage.clear();
                    cookie.remove("token");
                    history.push("/LoginOwner")
                }

            })
    };
    function request(username) { return { type: ownerConstants.OWNER_UPDATE_REQUEST, username } }
    function success(details) { return { type: ownerConstants.OWNER_UPDATE_SUCCESS, details } }
    function failure(details) { return { type: ownerConstants.OWNER_UPDATE_FAILURE, details } }
}

function getSections(restaurantId) {
    return dispatch => {
        dispatch(request());
        ownerService.getSections(restaurantId)
            .then((response) => {
                dispatch(success(response.data))
            }).catch((error) => {
                dispatch(failure());
                sessionStorage.clear();
                cookie.remove("token");
                history.push("/LoginOwner")
            })
    };
    function request() { return { type: ownerConstants.OWNER_GET_SECTIONS_REQUEST } }
    function success(sections) { return { type: ownerConstants.OWNER_GET_SECTIONS_SUCCESS, sections } }
    function failure() { return { type: ownerConstants.OWNER_GET_SECTIONS_FAILURE } }
}

function getItems(restaurantId) {
    return dispatch => {
        dispatch(request());
        ownerService.getItems(restaurantId)
            .then((response) => {
                dispatch(success(response.data))
            }).catch((error) => {
                dispatch(failure());
                sessionStorage.clear();
                cookie.remove("token");
                history.push("/LoginOwner")
            })
    };
    function request() { return { type: ownerConstants.OWNER_GET_ITEMS_REQUEST } }
    function success(items) { return { type: ownerConstants.OWNER_GET_ITEMS_SUCCESS, items } }
    function failure() { return { type: ownerConstants.OWNER_GET_ITEMS_FAILURE } }
}
function addSection(data) {
    return dispatch => {
        dispatch(request());
        ownerService.addSection(data)
            .then((response) => {
                dispatch(success(response.data))
                let successMessage = [];
                successMessage.push({ msg: "Successfully Added" })
                dispatch(alertActions.success(successMessage));
            }).catch((error) => {
                if (error.status == 201) {
                    dispatch(alertActions.error(error.data));
                } else {
                    dispatch(failure());
                    sessionStorage.clear();
                    cookie.remove("token");
                    history.push("/loginOwner");
                }

            })
    };
    function request() { return { type: ownerConstants.OWNER_ADD_SECTION_REQUEST } }
    function success() { return { type: ownerConstants.OWNER_ADD_SECTION_SUCCESS } }
    function failure() { return { type: ownerConstants.OWNER_ADD_SECTION_FAILURE } }
}
function updateSection(data) {
    return dispatch => {
        dispatch(request());
        ownerService.updateSection(data)
            .then((response) => {
                dispatch(success(response.data))
                let successMessage = [];
                successMessage.push({ msg: "Successfully Updated" })
                dispatch(alertActions.success(successMessage));
            }).catch((error) => {
                if (error.status == 201) {
                    dispatch(alertActions.error(error.data));
                } else {
                    dispatch(failure());
                    sessionStorage.clear();
                    cookie.remove("token");
                    history.push("/loginOwner");
                }
            })
    };
    function request() { return { type: ownerConstants.OWNER_ADD_SECTION_REQUEST } }
    function success() { return { type: ownerConstants.OWNER_ADD_SECTION_SUCCESS } }
    function failure() { return { type: ownerConstants.OWNER_ADD_SECTION_FAILURE } }
}
function deleteItem(itemId) {
    return dispatch => {
        dispatch(request());
        ownerService.deleteItem(itemId)
            .then(() => {
                dispatch(success())
            }).catch((error) => {
                dispatch(failure());
                sessionStorage.clear();
                cookie.remove("token");
                history.push("/LoginOwner")
            })
    };
    function request() { return { type: ownerConstants.OWNER_DELETE_ITEM_REQUEST } }
    function success() { return { type: ownerConstants.OWNER_DELETE_ITEM_SUCCESS } }
    function failure() { return { type: ownerConstants.OWNER_DELETE_ITEM_FAILURE } }
}

function addItem(data) {
    return dispatch => {
        dispatch(request());
        ownerService.addItem(data)
            .then(() => {
                dispatch(success())
                let successMessage = [];
                successMessage.push({ msg: "Successfully Added" })
                dispatch(alertActions.success(successMessage));
            }).catch((error) => {
                if (error.status == 201) {
                    dispatch(alertActions.error(error.data));
                } else {
                    dispatch(failure());
                    sessionStorage.clear();
                    cookie.remove("token");
                    history.push("/LoginOwner")
                }
            })
    };
    function request() { return { type: ownerConstants.OWNER_ADD_ITEM_REQUEST } }
    function success() { return { type: ownerConstants.OWNER_ADD_ITEM_SUCCESS } }
    function failure() { return { type: ownerConstants.OWNER_ADD_ITEM_FAILURE } }
}

function addItemImageAndItem(data, file, config) {
    return dispatch => {
        dispatch(request());
        ownerService.addItem(data).then((response) => {
            let formData = new FormData();
            formData.append("myImage", file, response.data.itemId)
            ownerService.addItemImage(formData, config).then(() => {
                dispatch(success())
                let successMessage = [];
                successMessage.push({ msg: "Successfully Added" })
                dispatch(alertActions.success(successMessage));
            })
        }).catch((error) => {
            if (error.status == 201) {
                dispatch(alertActions.error(error.data));
            } else {
                dispatch(failure());
                sessionStorage.clear();
                cookie.remove("token");
                history.push("/LoginOwner")
            }
        })
    };
    function request() { return { type: ownerConstants.OWNER_ADD_ITEM_IMAGE_REQUEST } }
    function success() { return { type: ownerConstants.OWNER_ADD_ITEM_IMAGE_SUCCESS } }
    function failure() { return { type: ownerConstants.OWNER_ADD_ITEM_IMAGE_FAILURE } }
}

function updateItem(data) {
    return dispatch => {
        dispatch(request());
        ownerService.updateItem(data)
            .then(() => {
                dispatch(success())
                let successMessage = [];
                successMessage.push({ msg: "Successfully Updated" })
                dispatch(alertActions.success(successMessage));
            }).catch((error) => {
                if (error.status == 201) {
                    dispatch(alertActions.error(error.data));
                } else {
                    dispatch(failure());
                    sessionStorage.clear();
                    cookie.remove("token");
                    history.push("/LoginOwner")
                }
            })
    };
    function request() { return { type: ownerConstants.OWNER_UPDATE_ITEM_REQUEST } }
    function success() { return { type: ownerConstants.OWNER_UPDATE_ITEM_SUCCESS } }
    function failure() { return { type: ownerConstants.OWNER_UPDATE_ITEM_FAILURE } }
}
function updateItemAndImage(data, formData, config) {
    return dispatch => {
        dispatch(request());
        ownerService.updateItem(data).
        then((response) => {
            ownerService.addItemImage(formData, config).then(() => {
                dispatch(success())
                let successMessage = [];
                successMessage.push({ msg: "Successfully Updated" })
                dispatch(alertActions.success(successMessage));
            })
        }).catch((error) => {
            if (error.status == 201) {
                dispatch(alertActions.error(error.data));
            } else {
                dispatch(failure());
                sessionStorage.clear();
                cookie.remove("token");
                history.push("/LoginOwner")
            }
        })
    };
    function request() { return { type: ownerConstants.OWNER_UPDATE_ITEM_IMAGE_REQUEST } }
    function success() { return { type: ownerConstants.OWNER_UPDATE_ITEM_IMAGE_SUCCESS } }
    function failure() { return { type: ownerConstants.OWNER_UPDATE_ITEM_IMAGE_FAILURE } }
}
function deleteSection(sectionId) {
    return dispatch => {
        dispatch(request());
        ownerService.deleteSection(sectionId)
            .then(() => {
                dispatch(success())
            }).catch((error) => {
                dispatch(failure());
                sessionStorage.clear();
                cookie.remove("token");
                history.push("/LoginOwner")
            })
    };
    function request() { return { type: ownerConstants.OWNER_DELETE_SECTION_REQUEST } }
    function success() { return { type: ownerConstants.OWNER_DELETE_SECTION_SUCCESS } }
    function failure() { return { type: ownerConstants.OWNER_DELETE_SECTION_FAILURE } }
}