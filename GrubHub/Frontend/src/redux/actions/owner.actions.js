import { ownerConstants } from '../constants/owner.constants';
import { ownerService } from '../services/owner.service';
import { history } from '../helper/history';
import { alertActions } from '../actions/alert.actions';

export const ownerActions = {
    login, signUp, UpdateOwner, FetchOwner
};

function login(username, password) {
    return dispatch => {
        dispatch(request({ username }));

        ownerService.login(username, password)
            .then(() => {
                console.log("success")
                dispatch(success(username));
                history.push("/HomeOwner");
            }).catch((error) => {
                console.log(error)
                dispatch(failure(JSON.stringify(error)));
                dispatch(alertActions.error(error));
            })
    };
    function request(user) { return { type: ownerConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: ownerConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: ownerConstants.LOGIN_FAILURE, error } }
}

function signUp(data) {
    var username = data.username;
    return dispatch => {
        dispatch(request({ username }));

        ownerService.signUp(data)
            .then(() => {
                console.log("success")
                dispatch(success(username));
                history.push("/UpdateDetailsOwner");
            }).catch((error) => {
                console.log(error)
                dispatch(failure(JSON.stringify(error)));
                dispatch(alertActions.error(error));
            })
    };
    function request(user) { return { type: ownerConstants.SIGNUP_REQUEST, user } }
    function success(user) { return { type: ownerConstants.SIGNUP_SUCCESS, user } }
    function failure(error) { return { type: ownerConstants.SIGNUP_FAILURE, error } }
}

function UpdateOwner(data) {
    var username = data.email;
    return dispatch => {
        dispatch(request({ username }));

        ownerService.UpdateOwner(data)
            .then(() => {
                ownerService.UpdateRestaurant(data).then((response)=>{
                    dispatch(success(response));
                    var successMessage = [];
                    successMessage.push({ msg: "Successfully Updated" })
                    dispatch(alertActions.success(successMessage));
                })
               

            }).catch((error) => {
                console.log(error)
                dispatch(failure(error[0]));
                dispatch(alertActions.error(error[1]));
            })
    };
    function request(user) { return { type: ownerConstants.UPDATE_REQUEST, user } }
    function success(user) { return { type: ownerConstants.UPDATE_SUCCESS, user } }
    function failure(user) { return { type: ownerConstants.UPDATE_FAILURE, user } }
}
function FetchOwner(data) {
    var username = data.username;
    return dispatch => {
        dispatch(request({ username }));

        ownerService.FetchOwner(username).then((response) => {
            console.log("fetch"+response)
                ownerService.FetchRestaurant(response.restaurantId).then((responses) => {
                    console.log("resposnes"+JSON.stringify(responses[0]) )
                    dispatch(success(responses[0]));
                })

            }).catch((error) => {
                console.log(error)
                dispatch(failure(error));
                dispatch(alertActions.error(error));
            })
    };
    function request(user) { return { type: ownerConstants.FETCH_REQUEST, user } }
    function success(user) { return { type: ownerConstants.FETCH_SUCCESS, user } }
    function failure(user) { return { type: ownerConstants.FETCH_FAILURE, user } }
}