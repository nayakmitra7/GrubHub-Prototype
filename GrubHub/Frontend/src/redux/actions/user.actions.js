import { userConstants } from '../constants/user.constants';
import { userService } from '../services/user.service';
import { history } from '../helper/history';
import { alertActions } from '../actions/alert.actions';
import cookie from 'js-cookie';

export const userActions = {
    login, signUp, updateProfile, fetchBasic, fetchPastOrder, fetchUpcomingOrder, sendMessage, fetchMessageSent, fetchMessageReceived,
    fetchUserDetails, uploadUserPhoto, updateUserDetails,fetchRestaurants,fetchSections,fetchItems,placeOrder
};

function login(username, password) {
    return dispatch => {
        dispatch(request({ username }));
        userService.login(username, password)
            .then((response) => {
                dispatch(success(username));
                sessionStorage.setItem("username", username);
                cookie.set("token", response.data.tokens);
                history.push("/HomePage");
            }).catch((error) => {
                dispatch(failure(JSON.stringify(error)));
                dispatch(alertActions.error(error));
            })
    };
    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}
function fetchBasic(username) {
    return dispatch => {
        dispatch(request({ username }));
        userService.fetchBasic(username)
            .then((response) => {
                dispatch(success(username));
                sessionStorage.setItem("Address", response.data.buyerAddress);
                sessionStorage.setItem("FirstName", response.data.buyerFirstName);
                sessionStorage.setItem("LastName", response.data.buyerLastName);
                sessionStorage.setItem("BuyerId", response.data._id);
            }).catch((error) => {
                dispatch(failure(JSON.stringify(error)));
            })
    };
    function request(user) { return { type: userConstants.FETCH_BASIC_REQUEST, user } }
    function success(user) { return { type: userConstants.FETCH_BASIC_SUCCESS, user } }
    function failure(error) { return { type: userConstants.FETCH_BASIC_FAILURE, error } }
}
function fetchPastOrder() {
    return dispatch => {
        dispatch(request());
        userService.fetchPastOrder()
            .then((response) => {
                dispatch(success(response.data));
            }).catch((error) => {
                dispatch(failure(JSON.stringify(error)));
                sessionStorage.clear();
                cookie.remove("token");
                history.push("/login")
            })
    };
    function request() { return { type: userConstants.FETCH_PAST_ORDER_REQUEST } }
    function success(order) { return { type: userConstants.FETCH_PAST_ORDER_SUCCESS, order } }
    function failure(error) { return { type: userConstants.FETCH_PAST_ORDER_FAILURE, error } }
}
function fetchUpcomingOrder() {
    return dispatch => {
        dispatch(request());
        userService.fetchUpcomingOrder()
            .then((response) => {
                dispatch(success(response.data));
            }).catch((error) => {
                dispatch(failure(JSON.stringify(error)));
                sessionStorage.clear();
                cookie.remove("token");
                history.push("/login")
            })
    };
    function request() { return { type: userConstants.FETCH_UPCOMING_ORDER_REQUEST } }
    function success(order) { return { type: userConstants.FETCH_UPCOMING_ORDER_SUCCESS, order } }
    function failure(error) { return { type: userConstants.FETCH_UPCOMING_ORDER_FAILURE, error } }
}
function sendMessage(data) {
    let details = data;
    return dispatch => {
        dispatch(request());
        userService.sendMessage(details)
            .then((response) => {
                dispatch(success(response.data));
            }).catch((error) => {
                dispatch(failure(JSON.stringify(error)));
                sessionStorage.clear();
                cookie.remove("token");
                history.push("/login")
            })
    };
    function request() { return { type: userConstants.SEND_MESSAGE_REQUEST } }
    function success() { return { type: userConstants.SEND_MESSAGE_SUCCESS } }
    function failure(error) { return { type: userConstants.SEND_MESSAGE_FAILURE, error } }
}
function fetchMessageSent() {
    return dispatch => {
        dispatch(request());
        userService.fetchMessageSent()
            .then((response) => {
                dispatch(success(response.data));
            }).catch((error) => {
                dispatch(failure(JSON.stringify(error)));
                sessionStorage.clear();
                cookie.remove("token");
                history.push("/login")
            })
    };
    function request() { return { type: userConstants.FETCH_SENT_MESSAGE_REQUEST } }
    function success(message) { return { type: userConstants.FETCH_SENT_MESSAGE_SUCCESS, message } }
    function failure(error) { return { type: userConstants.FETCH_SENT_MESSAGE_FAILURE, error } }
}
function fetchMessageReceived() {
    return dispatch => {
        dispatch(request());
        userService.fetchMessageReceived()
            .then((response) => {
                dispatch(success(response.data));
            }).catch((error) => {
                dispatch(failure(JSON.stringify(error)));
                sessionStorage.clear();
                cookie.remove("token");
                history.push("/login")
            })
    };
    function request() { return { type: userConstants.FETCH_RECEIVED_MESSAGE_REQUEST } }
    function success(message) { return { type: userConstants.FETCH_RECEIVED_MESSAGE_SUCCESS, message } }
    function failure(error) { return { type: userConstants.FETCH_RECEIVED_MESSAGE_FAILURE, error } }
}
function uploadUserPhoto(formData, config) {
    return dispatch => {
        dispatch(request());
        userService.uploadUserPhoto(formData, config)
            .then((response) => {
                dispatch(success(response.data));
                let successMessage = [];
                successMessage.push({ msg: "Successfully Updated" })
                dispatch(alertActions.success(successMessage));
            }).catch((error) => {
                dispatch(failure(JSON.stringify(error)));
                sessionStorage.clear();
                cookie.remove("token");
                history.push("/login")
            })
    };
    function request() { return { type: userConstants.UPLOAD_IMAGE_REQUEST } }
    function success(message) { return { type: userConstants.UPLOAD_IMAGE_SUCCESS, message } }
    function failure(error) { return { type: userConstants.UPLOAD_IMAGE_FAILURE, error } }
}

function signUp(data) {
    let username = data.username;
    return dispatch => {
        dispatch(request({ username }));

        userService.signUp(data)
            .then((response) => {
                sessionStorage.setItem("FirstName",response.data.firstName)
                sessionStorage.setItem("LastName",response.data.lastName)
                sessionStorage.setItem("BuyerId",response.data.id)
                sessionStorage.setItem("Address",response.data.address)
                cookie.set("token",response.data.tokens);
                dispatch(success(username));
                history.push("/HomePage");
            }).catch((error) => {
                if (error.status == 201) {
                    dispatch(alertActions.error(error.data));
                } else {
                    sessionStorage.clear();
                    cookie.remove("token");
                    history.push("/login")
                }
            })
    };
    function request(username) { return { type: userConstants.SIGNUP_REQUEST, username } }
    function success(buyer) { return { type: userConstants.SIGNUP_SUCCESS, buyer } }
    function failure(error) { return { type: userConstants.SIGNUP_FAILURE, error } }
}
function updateUserDetails(data) {
    let username = data.email;
    return dispatch => {
        dispatch(request({ username }));

        userService.updateUserDetails(data)
            .then((response) => {
                sessionStorage.setItem("FirstName", response.data.buyerFirstName);
                sessionStorage.setItem("LastName", response.data.buyerLastName);
                dispatch(success(response.data));
                let successMessage = [];
                successMessage.push({ msg: "Successfully Updated" })
                dispatch(alertActions.success(successMessage));
            }).catch((error) => {
                if (error.status == 201) {
                    let data1 = { _id: data.ID, buyerFirstName: data.firstName, buyerLastName: data.lastName, buyerEmail: data.email, buyerPhone: data.phone, buyerImage: data.file, buyerAddress: data.address }
                    dispatch(failure(data1));
                    dispatch(alertActions.error(error.data));
                } else {
                    sessionStorage.clear();
                    cookie.remove("token");
                    history.push("/login")
                }

            })
    };
    function request(username) { return { type: userConstants.UPDATE_REQUEST, username } }
    function success(details) { return { type: userConstants.UPDATE_SUCCESS, details } }
    function failure(details) { return { type: userConstants.UPDATE_FAILURE, details } }
}
function updateProfile(data) {
    let username = data.email;
    return dispatch => {
        dispatch(request({ username }));

        userService.updateProfile(data)
            .then((response) => {
                dispatch(success(response));
                let successMessage = [];
                successMessage.push({ msg: "Successfully Updated" })
                dispatch(alertActions.success(successMessage));
            }).catch((error) => {
                dispatch(failure(error[1]));
                dispatch(alertActions.error(error[0]));
            })
    };
    function request(username) { return { type: userConstants.UPDATE_REQUEST, username } }
    function success(user) { return { type: userConstants.UPDATE_SUCCESS, user } }
    function failure(user) { return { type: userConstants.UPDATE_FAILURE, user } }
}

function fetchUserDetails() {
    return dispatch => {
        dispatch(request());
        userService.fetchUserDetails()
            .then((response) => {
                dispatch(success(response.data));
            }).catch((error) => {
                dispatch(failure(JSON.stringify(error.data)));
                sessionStorage.clear();
                cookie.remove("token");
                history.push("/login")
            })
    };
    function request() { return { type: userConstants.FETCH_DETAILS_REQUEST } }
    function success(details) { return { type: userConstants.FETCH_DETAILS_SUCCESS, details } }
    function failure(error) { return { type: userConstants.FETCH_DETAILS_FAILURE, error } }
}

function fetchRestaurants(itemSearched) {
    return dispatch => {
        dispatch(request());
        userService.fetchRestaurants(itemSearched)
            .then((response) => {
                dispatch(success(response.data));
            }).catch((error) => {
                dispatch(failure(JSON.stringify(error.data)));
                sessionStorage.clear();
                cookie.remove("token");
                history.push("/login")
            })
    };
    function request() { return { type: userConstants.FETCH_RESTAURANT_REQUEST } }
    function success(restaurants) { return { type: userConstants.FETCH_RESTAURANT_SUCCESS, restaurants } }
    function failure(error) { return { type: userConstants.FETCH_DETAILS_FAILURE, error } }
}

function fetchSections(restaurantId) {
    return dispatch => {
        dispatch(request());
        userService.fetchSections(restaurantId)
            .then((response) => {
                dispatch(success(response.data));
            }).catch((error) => {
                dispatch(failure(JSON.stringify(error.data)));
                sessionStorage.clear();
                cookie.remove("token");
                history.push("/login")
            })
    };
    function request() { return { type: userConstants.FETCH_SECTION_REQUEST } }
    function success(sections) { return { type: userConstants.FETCH_SECTION_SUCCESS, sections } }
    function failure(error) { return { type: userConstants.FETCH_SECTION_FAILURE, error } }
}

function fetchItems(restaurantId) {
    return dispatch => {
        dispatch(request());
        userService.fetchItems(restaurantId)
            .then((response) => {
                dispatch(success(response.data));
            }).catch((error) => {
                dispatch(failure(JSON.stringify(error.data)));
                sessionStorage.clear();
                cookie.remove("token");
                history.push("/login")
            })
    };
    function request() { return { type: userConstants.FETCH_ITEMS_REQUEST } }
    function success(items) { return { type: userConstants.FETCH_ITEMS_SUCCESS, items } }
    function failure(error) { return { type: userConstants.FETCH_ITEMS_FAILURE, error } }
}

function placeOrder(data) {
    return dispatch => {
        dispatch(request());
        userService.placeOrder(data)
            .then((response) => {
                dispatch(success(response.data));
            }).catch((error) => {
                dispatch(failure(JSON.stringify(error.data)));
                sessionStorage.clear();
                cookie.remove("token");
                history.push("/login")
            })
    };
    function request() { return { type: userConstants.PLACE_ORDER_REQUEST } }
    function success(message) { return { type: userConstants.PLACE_ORDER_SUCCESS, message } }
    function failure(error) { return { type: userConstants.PLACE_ORDER_FAILURE, error } }
}