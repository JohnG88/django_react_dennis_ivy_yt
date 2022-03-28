import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext';
// import axiosInstance from '../utils/axiosInstance';
import useAxios from '../utils/useAxios';

const HomePage = () => {
  const [notes, setNotes] = useState([])
  const {authTokens, logoutUser} = useContext(AuthContext)
  const api = useAxios()

  useEffect(() => {
    getNotes()
  }, [])

  const getNotes = async () => {
    const response = await api.get('/api/notes/')

    // const response = await fetch('http://127.0.0.1:8000/api/notes/', {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer ' + String(authTokens.access)
    //   }
    // })
    
    // Don't need this line below using axios 
    // const data = await response.json()
    
    if (response.status === 200) {
      setNotes(response.data)
    }

    // use line above and line below while using fetch
    // if (response.status === 200) {
    //   setNotes(data)
    //   // logouts user if unauthorized
    // } else if (response.statusText === 'Unauthorized') {
    //   logoutUser()
    // }
  } 

  return (
    <div>
        <p>You are logged into the home page!</p>

        <ul>
          {notes.map(note => (
            <li key={note.id}>{note.body}</li>
          ))}
        </ul>
    </div>
  )
}

export default HomePage