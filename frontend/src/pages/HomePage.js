import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'

const HomePage = () => {
  const [notes, setNotes] = useState([])
  const {authTokens, logoutUser} = useContext(AuthContext)

  useEffect(() => {
    getNotes()
  }, [])

  let getNotes = async () => {
    const response = await fetch('http://127.0.0.1:8000/api/notes/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(authTokens.access)
      }
    })
    const data = await response.json()

    if (response.status === 200) {
      setNotes(data)
      // logouts user if unauthorized
    } else if (response.statusText === 'Unauthorized') {
      logoutUser()
    }
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