import axios from 'axios';
import { address } from '../../constant'
import cookie from 'js-cookie';


export const userService = {
    login, signUp, updateUserDetails, fetchBasic, fetchPastOrder, fetchUpcomingOrder, sendMessage, fetchMessageSent, fetchMessageReceived, fetchUserDetails,
    uploadUserPhoto,fetchRestaurants,fetchSections,fetchItems,placeOrder
};

function login(username, password) {
    let data = { username: username, password: password }
    return axios.post(address + '/users/login', data).
        then((response) => {
            if (response.status === 200) {
                return Promise.resolve(response);
            }
            else {
                return Promise.reject(response.data);

            }
        })
}

function fetchBasic(username) {
    return axios.get(address + '/users/detailsBasic/' + username)
        .then(response => {
            if (response.status === 200) {
                return Promise.resolve(response);
            }

        });

}
function fetchPastOrder() {
    return axios.get(address + '/order/pastOrders/user/' + sessionStorage.getItem("BuyerId"), {
        headers: { Authorization: 'JWT ' + cookie.get("token") }
    }).then(response => {
        if (response.status === 200) {
            return Promise.resolve(response);
        }
    }).catch(error => {
        return Promise.reject(error);
    });

}
function fetchUpcomingOrder() {
    return axios.get(address + '/order/upcomingOrders/user/' + sessionStorage.getItem("BuyerId"), {
        headers: { Authorization: 'JWT ' + cookie.get("token") }
    }).then(response => {
        if (response.status === 200) {
            return Promise.resolve(response);
        }
    }).catch(error => {
        return Promise.reject(error);
    });

}
function sendMessage(data) {
    return axios.post(address + '/message', data, { headers: { Authorization: 'JWT ' + cookie.get("token") } })
        .then(response => {
            return Promise.resolve(response);
        }).catch(error => {
            return Promise.reject(error);
        });

}
function fetchMessageSent() {
    return axios.get(address + '/message/sent/' + sessionStorage.getItem("BuyerId"), { headers: { Authorization: 'JWT ' + cookie.get("token") } })
        .then(response => {
            return Promise.resolve(response);
        }).catch(error => {
            return Promise.reject(error);
        });
}
function fetchMessageReceived() {
    return axios.get(address + '/message/received/' + sessionStorage.getItem("BuyerId"), { headers: { Authorization: 'JWT ' + cookie.get("token") } })
        .then(response => {
            return Promise.resolve(response);
        }).catch(error => {
            return Promise.reject(error);
        });

}
function uploadUserPhoto(formData, config) {
    return axios.post(address + "/users/upload/photo", formData, config)
        .then(response => {
            return Promise.resolve(response);
        }).catch(error => {
            return Promise.reject(error);
        });

}

function signUp(data) {
    return axios.post(address + "/users/signup", data)
        .then((response) => {
            if (response.status === 200) {
                return Promise.resolve(response);
            } else {
                return Promise.reject(response);

            }

        })
}
function updateUserDetails(data) {
    return axios.post(address + '/users/update', data, {
        headers: { Authorization: 'JWT ' + cookie.get("token") }
    }).then(response => {
        if (response.status === 200) {
            return Promise.resolve(response);
        }
        else {
            return Promise.reject(response);
        }

    });
}

function fetchUserDetails() {
    return axios.get(address + '/users/details/' + sessionStorage.getItem("BuyerId"), {
        headers: { Authorization: 'JWT ' + cookie.get("token") }
    }).then(response => {
        if (response.status === 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    });
}

function fetchRestaurants(itemSearched) {
    return  axios.get(address + '/owner/searched/' +itemSearched, {
        headers: { Authorization: 'JWT ' + cookie.get("token") }
    }).then(response => {
        if (response.status === 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    });
}

function fetchSections(restaurantId) {
    return  axios.get(address + '/section/' + restaurantId, {
        headers: { Authorization: 'JWT ' + cookie.get("token") }
    }).then(response => {
        if (response.status === 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    });
}
function fetchItems(restaurantId) {
    return   axios.get(address + '/item/' + restaurantId, {
        headers: { Authorization: 'JWT ' + cookie.get("token") }
    }).then(response => {
        if (response.status === 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    });
}
function placeOrder(data) {
    return axios.post(address + '/order/placeOrder', data, {
        headers: { Authorization: 'JWT ' + cookie.get("token") }
    }).then(response => {
        if (response.status === 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    });
}