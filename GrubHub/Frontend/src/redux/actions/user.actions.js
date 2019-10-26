import { userConstants } from '../constants/user.constants';
import { userService } from '../services/user.service';
import { history } from '../helper/history';
import { alertActions } from '../actions/alert.actions';
import cookie from 'js-cookie';

export const userActions = {
    login, signUp, updateProfile, fetchProfile, fetchBasic, fetchPastOrder, fetchUpcomingOrder, sendMessage,fetchMessageSent,fetchMessageReceived
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
                sessionStorage.setItem("BuyerId", response.data._id);
            }).catch((error) => {
                dispatch(failure(JSON.stringify(error)));
                dispatch(alertActions.error(error));
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
                localStorage.clear();
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
                localStorage.clear();
                cookie.remove("token");
                history.push("/login")
            })
    };
    function request() { return { type: userConstants.FETCH_UPCOMING_ORDER_REQUEST } }
    function success(order) { return { type: userConstants.FETCH_UPCOMING_ORDER_SUCCESS, order } }
    function failure(error) { return { type: userConstants.FETCH_UPCOMING_ORDER_FAILURE, error } }
}
function sendMessage(data) {
    var details = data;
    return dispatch => {
        dispatch(request());
        userService.sendMessage(details)
            .then((response) => {
                dispatch(success(response.data));
            }).catch((error) => {
                dispatch(failure(JSON.stringify(error)));
                sessionStorage.clear();
                localStorage.clear();
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
                localStorage.clear();
                cookie.remove("token");
                history.push("/login")
            })
    };
    function request() { return { type: userConstants.FETCH_SENT_MESSAGE_REQUEST } }
    function success(message) { return { type: userConstants.FETCH_SENT_MESSAGE_SUCCESS,message } }
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
                localStorage.clear();
                cookie.remove("token");
                history.push("/login")
            })
    };
    function request() { return { type: userConstants.FETCH_RECEIVED_MESSAGE_REQUEST } }
    function success(message) { return { type: userConstants.FETCH_RECEIVED_MESSAGE_SUCCESS,message } }
    function failure(error) { return { type: userConstants.FETCH_RECEIVED_MESSAGE_FAILURE, error } }
}
function signUp(data) {
    var username = data.username;
    return dispatch => {
        dispatch(request({ username }));

        userService.signUp(data)
            .then(() => {
                console.log("success")
                dispatch(success(username));
                history.push("/HomePage");
            }).catch((error) => {
                console.log(error)
                dispatch(failure(JSON.stringify(error)));
                dispatch(alertActions.error(error));
            })
    };
    function request(username) { return { type: userConstants.SIGNUP_REQUEST, username } }
    function success(username) { return { type: userConstants.SIGNUP_SUCCESS, username } }
    function failure(error) { return { type: userConstants.SIGNUP_FAILURE, error } }
}
function updateProfile(data) {
    var username = data.email;
    return dispatch => {
        dispatch(request({ username }));

        userService.updateProfile(data)
            .then((response) => {
                console.log("success")
                dispatch(success(response));
                var successMessage = [];
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

function fetchProfile(data) {
    var username = data.username
    return dispatch => {
        dispatch(request({ username }));

        userService.fetchProfile(data)
            .then((response) => {
                console.log("success")
                dispatch(success(response));
            }).catch((error) => {
                console.log(error)
                dispatch(failure(JSON.stringify(error)));
                dispatch(alertActions.error(error));
            })
    };
    function request(username) { return { type: userConstants.FETCH_PROFILE_REQUEST, username } }
    function success(user) { return { type: userConstants.FETCH_PROFILE_SUCCESS, user } }
    function failure(error) { return { type: userConstants.FETCH_PROFILE_FAILURE, error } }
}