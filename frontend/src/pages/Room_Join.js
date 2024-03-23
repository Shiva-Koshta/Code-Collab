import React, { useState } from 'react'
import { v4 as uuidV4 } from 'uuid'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
const Home = () => {
  const navigate = useNavigate()

  const [roomId, setRoomId] = useState('')
  const [username, setUsername] = useState('')
  const createNewRoom = (e) => {
    e.preventDefault()
    const id = uuidV4()
    setRoomId(id)
    toast.success('Created a new room')
  }

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error('ROOM ID & username is required')
      return
    }

    // Redirect
    navigate(`/editor/${roomId}`, {
      state: {
        username
      }
    })
  }

  const handleInputEnter = (e) => {
    if (e.code === 'Enter') {
      joinRoom()
    }
  }
  const goToPage = (url) => {
    navigate(url)
  }

  return (

    <div>

      {/* first div */}
      <div>
        <nav className='navbar'>
          <button className='navbar-button' onClick={() => goToPage('/aboutus')}>About Us</button>
          <button className='navbar-button' onClick={() => goToPage('/faq')}>FAQ</button>

        </nav>
      </div>

      <div className='homePageWrapper'>
        <div className='formWrapper'>
          <h1 className='mainHeading'>Welcome to Code-Collab</h1>
          <h4 className='mainLabel'>Join a Room</h4>
          <div className='inputGroup'>
            <input
              type='text'
              className='inputBox'
              placeholder='ROOM ID'
              onChange={(e) => setRoomId(e.target.value)}
              value={roomId}
              onKeyUp={handleInputEnter}
            />
            <input
              type='text'
              className='inputBox'
              placeholder='USERNAME'
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              onKeyUp={handleInputEnter}
            />
            <button className='btn joinBtn' onClick={joinRoom}>
              Join
            </button>
            <span className='createInfo'>
              If you don't have an invite, click on &nbsp;
              <a
                onClick={createNewRoom}
                href=''
                className='createNewBtn'
              >
                Create New Room
              </a>
            </span>
          </div>
        </div>
      </div>

      <footer />
    </div>

  )
}

export default Home
