import { address } from '../../constant'
import axios from 'axios';
import cookie from 'js-cookie';


export const ownerService = {
    login, signUp,fetchBasic,fetchMessageReceived,fetchMessageSent,fetchNewOrders,updateDetails,
    fetchConfirmedOrders,fetchPreparingOrders,fetchReadyOrders,fetchCancelledOrders,cancelOrders,statusChange,sendMessage,fetchPastOrder,uploadOwnerImage,
    uploadRestaurantImage,fetchOwnerDetails,getSections,getItems,addSection,updateSection,deleteItem,addItem,addItemImage,updateItem,deleteSection
};
function login(username, password) {
    let data = { username: username, password: password }
    return axios.post(address + '/owner/login', data).
        then((response) => {
            if (response.status === 200) {
                return Promise.resolve(response);
            }
            else {
                return Promise.reject(response);

            }
        })
}
function fetchBasic(username) {
    return axios.get(address+'/owner/detailsBasic/'+username)
        .then(response => {
            if (response.status === 200) {
                return Promise.resolve(response);
            }

        });

}
function fetchMessageReceived() {
    return axios.get(address + '/message/received/' + sessionStorage.getItem("RestaurantID"), { headers: { Authorization: 'JWT ' + cookie.get("token") } })
        .then(response => {
            return Promise.resolve(response);
        }).catch(error => {
            return Promise.reject(error);
        });
}
function fetchMessageSent() {
    return axios.get(address + '/message/sent/' + sessionStorage.getItem("RestaurantID"), { headers: { Authorization: 'JWT ' + cookie.get("token") } })
        .then(response => {
            return Promise.resolve(response);
        }).catch(error => {
            return Promise.reject(error);
        });

}
function fetchNewOrders() {
    return axios.get(address + '/order/new/' + sessionStorage.getItem("RestaurantID"), { headers: { Authorization: 'JWT ' + cookie.get("token") } })
        .then(response => {
            return Promise.resolve(response);
        }).catch(error => {
            return Promise.reject(error);
        });

}
function fetchConfirmedOrders() {
    return axios.get(address + '/order/confirmed/' + sessionStorage.getItem("RestaurantID"), { headers: { Authorization: 'JWT ' + cookie.get("token") } })
        .then(response => {
            return Promise.resolve(response);
        }).catch(error => {
            return Promise.reject(error);
        });

}
function fetchPreparingOrders() {
    return axios.get(address + '/order/preparing/' + sessionStorage.getItem("RestaurantID"), { headers: { Authorization: 'JWT ' + cookie.get("token") } })
        .then(response => {
            return Promise.resolve(response);
        }).catch(error => {
            return Promise.reject(error);
        });

}
function fetchReadyOrders() {
    return axios.get(address + '/order/ready/' + sessionStorage.getItem("RestaurantID"), { headers: { Authorization: 'JWT ' + cookie.get("token") } })
        .then(response => {
            return Promise.resolve(response);
        }).catch(error => {
            return Promise.reject(error);
        });

}
function fetchCancelledOrders() {
    return axios.get(address + '/order/cancelled/' + sessionStorage.getItem("RestaurantID"), { headers: { Authorization: 'JWT ' + cookie.get("token") } })
        .then(response => {
            return Promise.resolve(response);
        }).catch(error => {
            return Promise.reject(error);
        });

}
function cancelOrders(data) {
    return axios.post(address + '/order/cancel/', data, { headers: { Authorization: 'JWT ' + cookie.get("token") } })
        .then(response => {
            return Promise.resolve(response);
        }).catch(error => {
            return Promise.reject(error);
        });
}
function statusChange(data) {
    return axios.post(address + '/order/statusChange', data, { headers: { Authorization: 'JWT ' + cookie.get("token") } })
        .then(response => {
            return Promise.resolve(response);
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
function fetchPastOrder() {
    return axios.get(address+'/order/pastOrders/owner/' + sessionStorage.getItem("RestaurantID"),{headers: {Authorization: 'JWT '+cookie.get("token")}})
        .then(response => {
            return Promise.resolve(response);
        }).catch(error => {
            return Promise.reject(error);
        });

}
function uploadOwnerImage(formData, config) {
    return axios.post(address + "/owner/ownerImage", formData, config)
        .then(response => {
            return Promise.resolve(response);
        }).catch(error => {
            return Promise.reject(error);
        });
}
function uploadRestaurantImage(formData, config) {
    return axios.post(address + "/owner/restaurantImage", formData, config)
        .then(response => {
            return Promise.resolve(response);
        }).catch(error => {
            return Promise.reject(error);
        });

}
function fetchOwnerDetails() {
    return axios.get(address + '/owner/details/' + sessionStorage.getItem("RestaurantID"),{headers: {Authorization: 'JWT '+cookie.get("token")}}).then(response => {
        if (response.status === 200) {
            return Promise.resolve(response);
        }
        else {
            return Promise.reject(response);
        }

    });
}

function updateDetails(data) {
    return axios.post(address + '/owner/update', data, { headers: { Authorization: 'JWT ' + cookie.get("token") } })
        .then(response => {
            if (response.status === 200) {
                return Promise.resolve(response);
            }
            else{
                return Promise.reject(response);
            }
        });
}

function signUp(data) {
    return  axios.post(address+"/owner/signup", data)
        .then(response => {
            if (response.status === 200) {
                return Promise.resolve(response);
            }
            else{
                return Promise.reject(response);
            }
        });
}
function getSections(restaurantId) {
    return  axios.get(address+'/section/' + restaurantId,{headers: {Authorization: 'JWT '+cookie.get("token")}})
        .then(response => {
            if (response.status === 200) {
                return Promise.resolve(response);
            }
            else{
                return Promise.reject(response);
            }
        });
}
function getItems(restaurantId) {
    return  axios.get(address+'/item/' + restaurantId,{headers: {Authorization: 'JWT '+cookie.get("token")}})
        .then(response => {
            if (response.status === 200) {
                return Promise.resolve(response);
            }
            else{
                return Promise.reject(response);
            }
        });
}

function addSection(data) {
    return  axios.post(address + '/section', data, { headers: { Authorization: 'JWT ' + cookie.get("token") } })
        .then(response => {
            if (response.status === 200) {
                return Promise.resolve(response);
            }
            else{
                return Promise.reject(response);
            }
        });
}
function updateSection(data) {
    return  axios.put(address + "/section", data, { headers: { Authorization: 'JWT ' + cookie.get("token") } })
        .then(response => {
            if (response.status === 200) {
                return Promise.resolve(response);
            }
            else{
                return Promise.reject(response);
            }
        });
}

function deleteItem(itemId) {
    return  axios.delete(address + "/item/" + itemId, { headers: { Authorization: 'JWT ' + cookie.get("token") } })
        .then(response => {
            if (response.status === 200) {
                return Promise.resolve(response);
            }
            else{
                return Promise.reject(response);
            }
        });
}

function addItem(data) {
    return  axios.post(address + '/item', data, { headers: { Authorization: 'JWT ' + cookie.get("token") } })
        .then(response => {
            if (response.status === 200) {
                return Promise.resolve(response);
            }
            else{
                return Promise.reject(response);
            }
        });
}
function addItemImage(formData,config) {
    return  axios.post(address + "/item/image", formData, config)
        .then(response => {
            if (response.status === 200) {
                return Promise.resolve(response);
            }
            else{
                return Promise.reject(response);
            }
        });
}
function updateItem(data) {
    return  axios.put(address + "/item", data, { headers: { Authorization: 'JWT ' + cookie.get("token") } })
        .then(response => {
            if (response.status === 200) {
                return Promise.resolve(response);
            }
            else{
                return Promise.reject(response);
            }
        });
}

function deleteSection(sectionId) {
    return  axios.delete(address + "/section/" + sectionId, { headers: { Authorization: 'JWT ' + cookie.get("token") } })
        .then(response => {
            if (response.status === 200) {
                return Promise.resolve(response);
            }
            else{
                return Promise.reject(response);
            }
        });
}
