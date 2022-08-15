import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7119/api/",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "cache",
    Expires: "1000",
  },
});

// request
api.interceptors.request.use((request) => {
  for (const key in request.params) {
    if (request.params[key] === "") {
      request.params[key] = null;
    }
  }
  return request;
});

// response
api.interceptors.response.use(
  (response) => {
    return Promise.resolve(response);
  },
  function (error) {
    switch (error.response.status) {
      case 401:
        window.location.assign("/login");
        break;
      default:
        break;
    }
    return Promise.reject(error);
  }
);
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
export default api;
