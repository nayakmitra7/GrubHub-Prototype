
import axios from 'axios';
export const ownerService = {
    login, signUp, UpdateOwner, FetchOwner, FetchRestaurant,UpdateRestaurant
};

function login(username, password) {
    var data = { username: username, password: password }

    return axios.post('http://localhost:3001/loginOwner', data)
        .then(response => {
            console.log("Status Code : ", response.status);
            if (response.status === 200) {
                sessionStorage.setItem("username", username);
                return Promise.resolve(username);
            }
            else if (response.status === 201) {
                return Promise.reject(response.data);
            }
        });
}


function signUp(data) {
    var username = data.email;

    return axios.post('http://localhost:3001/SignUpOwner', data)
        .then(response => {
            console.log("Status Code : ", response.status);
            if (response.status === 200) {
                console.log("Service " + username)
                sessionStorage.setItem("username", username);
                return Promise.resolve(username);
            }
            else if (response.status === 201) {
                return Promise.reject(response.data);
            }
        });
}


function UpdateOwner(data) {
    const data1 = { ownerFirstName: data.firstName, ownerLastName: data.lastName, ownerEmail: data.email, ownerPhone: data.phone, ownerId: data.ownerId, restaurantId: data.restaurantId, restaurantName: data.restaurantName, restaurantAddress: data.restaurantAddress, restaurantCuisine: data.restaurantCuisine, restaurantZipCode: data.restaurantZipCode };
    return axios.post('http://localhost:3001/UpdateOwner', data)
        .then(response => {
            if (response.status === 201) {
                var array = [];
                array.push(data1);
                array.push(response.data)
                return Promise.reject(array);
            }
            else if (response.status === 200) {
                return Promise.resolve();
            } else {
                var array = [];
                array.push(data1);
                array.push(response.data)
                return Promise.reject(array);
            }
        })
}
function UpdateRestaurant(data) {
    const data1 = { ownerFirstName: data.firstName, ownerLastName: data.lastName, ownerEmail: data.email, ownerPhone: data.phone, ownerId: data.ownerId, restaurantId: data.restaurantId, restaurantName: data.restaurantName, restaurantAddress: data.restaurantAddress, restaurantCuisine: data.restaurantCuisine, restaurantZipCode: data.restaurantZipCode };
    return axios.post('http://localhost:3001/UpdateRestaurant', data)
        .then(response => {
            console.log("Status Code : ", response.status);
            if (response.status === 200) {
                return Promise.resolve(data1)
            }
            else if (response.status === 201) {
                var array = []
                array.push(data1);
                array.push(response);
                return Promise.reject(array);
            } else {
                var array = []
                array.push(data1);
                array.push(response);
                return Promise.reject(array);
            }
        });

}
function FetchOwner(data) {
    return axios.post('http://localhost:3001/DetailsOwner/' + data)
        .then(response => {
            console.log("Status Code : ", response.status);
            if (response.status === 200) {
                console.log("resp" + response.data)
                return Promise.resolve(response.data)
            } else if (response.status === 201) {

                return Promise.reject(response.data)
            }
        })
}
function FetchRestaurant(data) {
    console.log(data)
    return axios.get('http://localhost:3001/OwnerAndRestaurant/' + data).then((responses) => {
        if (responses.status == 200) {
                        return Promise.resolve(responses.data)
        } else {

            return Promise.reject(responses.data)
        }
    })
}


