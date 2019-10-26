import axios from 'axios';
import { address } from '../../constant'
import cookie from 'js-cookie';


export const userService = {
    login,signUp,updateProfile,fetchProfile,fetchBasic,fetchPastOrder,fetchUpcomingOrder,sendMessage,fetchMessageSent,fetchMessageReceived
};

function login(username, password) {
    var data = { username: username, password: password }

    return axios.post(address + '/users/login', data).
        then((response) => {
            if (response.status === 200) {
                return Promise.resolve(response);
            }
            else if (response.status === 201) {
                return Promise.reject(response.data);
            } else {
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

function signUp(data) {
    var username = data.email;
    return axios.post("http://localhost:3001/signup", data)
        .then((response) => {
            if (response.status === 200) {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    sessionStorage.setItem("username", username);
                    return Promise.resolve(username);
                }

            } else if (response.status === 201) {
                return Promise.reject(response.data);
            } else {
                return Promise.reject(response.data);

            }

        })
}
function updateProfile(data) {
    var username = data.email;
    return axios.post('http://localhost:3001/updateBuyer', data)
        .then(response => {
            console.log("Status Code : ", response.status);
            if (response.status === 200) {
                sessionStorage.setItem("username", username);
                var data1 = { buyerID: data.ID, buyerFirstName: data.firstName, buyerLastName: data.lastName, buyerEmail: data.email, buyerPhone: data.phone }
                return Promise.resolve(data1);
            }
            else if (response.status === 201) {
                var array = [];
                array.push(response.data);
                var data1 = { buyerID: data.ID, buyerFirstName: data.firstName, buyerLastName: data.lastName, buyerEmail: data.email, buyerPhone: data.phone }
                array.push(data1)

                return Promise.reject(array);
            } else {
                var array = [];
                array.push(response.data);
                var data1 = { buyerID: data.ID, buyerFirstName: data.firstName, buyerLastName: data.lastName, buyerEmail: data.email, buyerPhone: data.phone }
                array.push(data1)

                return Promise.reject(array);
            }
        });
}

function fetchProfile(data) {
    return axios.post('http://localhost:3001/Details', data)
        .then(response => {
            console.log("Status Code : ", response.status);
            if (response.status === 200) {
                return Promise.resolve(response.data);
            } else if (response.status === 201) {
                console.log(response.data);
                return Promise.reject(response.data);
            } else {
                return Promise.reject(response.data);
            }
        });
}

