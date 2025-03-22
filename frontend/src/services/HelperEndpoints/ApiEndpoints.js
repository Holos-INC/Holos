import { API_URL } from "@/src/constants/api";
import axios from "axios";

axios.defaults.baseURL = API_URL;

const get = (route) => {
  return new Promise((resolve, reject) => {
    axios
      .get(route)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

const post = (route, data = null) => {
  return new Promise((resolve, reject) => {
    axios
      .post(route, data)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

const put = (route, data = null) => {
  return new Promise((resolve, reject) => {
    axios
      .put(route, data)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

const del = (route) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(route)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

export { get, post, put, del };
