import { createContext, useState, useEffect } from 'react';

import jwt_decode from "jwt-decode";
// react-router-dom useHistory() replaced by useNavigate()
// import { useHistory } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext()

export default AuthContext

export const AuthProvider = ({children}) => {
    // getting authToken and then destringifying authToken
    // setting a callBack function for token to load once and not recall every time
    const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null )
    // decoding user info with jwt_decode
    const [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)
    const [loading, setLoading] = useState(true)
    
    // react-router-dom uses useNavigate instead of useHistory
    // const history = useHistory()
    const navigate = useNavigate()

    const loginUser = async (e) => {
        e.preventDefault()
        // console.log('Form submitted')

        const response = await fetch('http://127.0.0.1:8000/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // the target here is the form
            body: JSON.stringify({'username': e.target.username.value, 'password': e.target.password.value})
        })
        const data = await response.json()
        // console data will give access and refresh token
        // console.log('data:', data)
        // console response will give you response of fetch
        // console.log('response:', response)

        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))

            // history.push('/')
            navigate('/')
        } else {
            alert('Something went wrong!')
        }
    }

    const logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        navigate('/login')
    }

    const updateToken = async () => {
        console.log('Updated Token')
        const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            //  if authToken not there '?' stops refresh token from refreshing if no access token yet
            body: JSON.stringify({'refresh': authTokens?.refresh })
        })
        const data = await response.json()

        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
        } else {
            logoutUser()
        }
        if (loading) {
            setLoading(false)
        }
    }

    const contextData = {
        // key: value pair
        user:user,
        authTokens: authTokens,
        loginUser:loginUser,
        logoutUser: logoutUser
    }

    useEffect(() => {
        if (loading) {
            updateToken()
        }

        const fourMinutes = 1000 * 60 * 4
        const interval = setInterval(() => {
            if(authTokens) {
                updateToken()
            }
        }, fourMinutes)
        // line below will clear infinite loop
        return () => clearInterval(interval)
    }, [authTokens, loading])
    // authTokens, loading

    return (
        // We want value to be available throughout application
        <AuthContext.Provider value={contextData}>
        {/* make sure no children render out before everything loads */}
            {loading ? null : children}
        </AuthContext.Provider>
    )
}