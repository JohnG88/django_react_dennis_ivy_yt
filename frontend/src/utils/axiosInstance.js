import axios from 'axios';
import jwt_decode from "jwt-decode";
import dayjs from 'dayjs';

const baseURL = "http://127.0.0.1:8000";

const authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null 

console.log("authTokens access", authTokens.access)
console.log("authTokens refresh", authTokens.refresh)

const axiosInstance = axios.create({
    baseURL,
    headers: {Authorization: `Bearer ${authTokens?.access}`}
});

axiosInstance.interceptors.request.use(async req => {
    if (!authTokens) {
        const authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null 
        req.headers.Authorization = `Bearer ${authTokens?.access}`
    }
    // when the access token is placed through jwt.io, it will give you some info, the token has an expiration time an that what is what isExpired variable is
    const user = jwt_decode(authTokens.access)
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
    console.log("isExpired: ", isExpired);
    if (!isExpired) return req

    const response = await axios.post(`${baseURL}/api/token/refresh/`, {
        refresh: authTokens.refresh
    }) 

    localStorage.setItem('authTokens', JSON.stringify(response.data))
    req.headers.Authorization = `Bearer ${response.data.access}`
    
    return req
})

export default axiosInstance