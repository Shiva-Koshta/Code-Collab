import './App.css'
import Login from './pages/Login'
import RoomCreation from './pages/RoomCreation'
import EditorPage from './pages/EditorPage'
import HelpPage from './pages/HelpPage'
import About from './pages/About'

import Faq from './pages/Faq'
import {
  Routes,
  Route,
  Navigate,
  BrowserRouter
} from 'react-router-dom'

import { useEffect, useState } from 'react'
import axios from 'axios'


function App () {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      try {
        const url = `${process.env.REACT_APP_API_URL}/auth/login/success`
        const { data } = await axios.get(url, { withCredentials: true })
        setUser(data.user._json)
        window.localStorage.setItem('userData', JSON.stringify(data.user._json))
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setUser(null); // User is not authenticated
        } else {
          //console.log(err);
        }
      }
    };
    getUser();
  }, []);
  

  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path='/'
          element={user ? <RoomCreation /> : <Navigate to='/login' />}
        />
        <Route
          exact
          path='/login'
          element={user ? <RoomCreation /> : <Login />}
        />

        <Route path='/faq' element={<Faq />} />
        <Route path='/editor/:roomId' element={<EditorPage />} />
        <Route path='/help' element={<HelpPage />} />

        <Route path='/about-us' element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
