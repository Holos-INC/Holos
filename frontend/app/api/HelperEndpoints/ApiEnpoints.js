import axios from "axios";

axios.defaults.baseURL = 'http://localhost:8080/api/v1';

const get = route => {
    return new Promise(function (resolve, reject) {
        axios.get(route)
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                reject(error)
            })
    });
}

const post = (route, data = null) => {
    return new Promise(function (resolve, reject) {
        axios.post(route, data)
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                reject(error)
            })
    });
}

export { get, post };