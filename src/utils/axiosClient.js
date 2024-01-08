import axios from 'axios';

const axiosClient = axios.create();
console.log("api: ", import.meta.env.VITE_APP_API_BASE)
axiosClient.interceptors.request.use(
    config => {
        config.headers['Content-Type'] = 'application/json';
        config.baseURL = import.meta.env.VITE_APP_API_BASE;

        return config;
    },
    error => {
        Promise.reject(error)
    });

axiosClient.interceptors.response.use(response => {
    return response;
}, error => {
    return Promise.reject(error);
});


export default axiosClient;
