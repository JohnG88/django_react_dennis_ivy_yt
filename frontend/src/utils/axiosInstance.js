import axios from 'axios';
import jwt_decode from "jwt-decode";
import dayjs from 'dayjs';

const baseURL = "http://127.0.0.1:8000"

const authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null 

const axiosInstance = axios.create({
    baseURL,
    headers: {Authorization: `Bearer ${authTokens?.access}`}
});

axiosInstance.interceptors.request.use(async req => {
    if (!authTokens) {
        authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null 
        req.headers.Authorization = `Bearer ${authTokens?.access}`
    }
    
    return req
})

export default axiosInstance