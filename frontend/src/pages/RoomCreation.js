import React, { useEffect, useState } from 'react'
import { v4 as uuidV4 } from 'uuid'
import toast, { Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import '../index'
import axios from 'axios'
const MAXUSERS = 10 // Maximum number of users allowed in a room


// Function to get the number of users in a room
export async function getRoomUsersCount(roomId) {
  const apiurl = `${process.env.REACT_APP_API_URL}/rooms/numUsersInRoom`
  const requestBody = {
    roomId: roomId
  }

  try {
    const response = await axios.post(apiurl, requestBody)
    if (response.status !== 200) {
      return -1
    }
    return response.data.numUsers
  } catch (error) {
    return -1
  }
}

const RoomCreation = () => {
  const navigate = useNavigate()

  const [roomId, setRoomId] = useState('')
  const [userName, setUserName] = useState('')
  const [userimage, setUserimage] = useState('')
  const [loading, setLoading] = useState(false)


  // Function to log out the user
  const logout = () => {
    window.open(`${process.env.REACT_APP_API_URL}/auth/logout`, '_self')
  }

  useEffect(() => {
    // Retrieve user data from local storage
    const storedUserData = window.localStorage.getItem('userData')

    if (storedUserData) {
      const userData = JSON.parse(storedUserData)
      // Assuming the user's name is stored in the 'name' property
      setUserName(userData.name)
      setUserimage(userData.picture)
    }
  }, [])

  // Function is used to create a new room
  const createNewRoom = (e) => {
    e.preventDefault()
    setLoading(true)
    const id = uuidV4()
    setRoomId(id)

    // creating the root directory
    const apiurl = `${process.env.REACT_APP_API_URL}/filesystem/createrootdirectory`
    const requestBody = {
      roomId: id,
    }
    const postData = async () => {
      try {
        const response = await axios.post(apiurl, requestBody)
        console.log('Response:', response.data)
        // the create room button should lead directly to the editor page and not after explicitly clicking the join button
        await axios.post(`${process.env.REACT_APP_API_URL}initialize`, {
          roomId: id,
          username: userName,
        })
        navigate(`/editor/${id}`, {
          state: {
            userName,
          },
        })
      } catch (error) {
        //console.error('Error:', error)
      }
      finally {
        setLoading(false) // Set loading state to false when finished
      }
    }
    postData()

  }

  // this function is used to join a room
  const joinRoom = async () => {


    if (!roomId || !userName) {
      toast.error('ROOM ID & username is required')
      return
    }

    let numUsers = await getRoomUsersCount(roomId)
    console.log('numUsers:', numUsers)
    if (numUsers === -1) {
      toast.error('Error joining room')
      return
    }
    if (numUsers >= MAXUSERS) {
      toast.error('Room is full')
      return
    }

    try {
      // Call the initialize endpoint with roomId and username in the request body
      await axios.post(`${process.env.REACT_APP_API_URL}/initialize`, {
        roomId,
        username: userName,
      })

      // Navigate to the editor page
      navigate(`/editor/${roomId}`, {
        state: {
          userName,
        },
      })
    } catch (error) {
      //console.error('Failed to call initialize endpoint:', error.message)
    }
  }

  // This is just required to send Join room by clicking Enter
  const handleInputEnter = (e) => {
    if (e.code === 'Enter') {
      joinRoom()
    }
  }
  // Navigate to given URL
  const goToPage = (url) => {
    navigate(url)
  }

  return (
    <div className='flex flex-col text-white'>
      <Toaster />
      {loading && (
        <div className='loader absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50'>
          <div className='loader-circle'></div>
        </div>
      )}
      <div
        className='flex justify-left gap-3 '
        style={{ backgroundColor: '#282a36' }}
      >
        <button
          className='align-middle transition duration-150 ease-in-out h-full rounded-lg my-3 ml-3 py-1 px-3 text-white bg-slate-600 hover:bg-slate-700 hover:scale-105'
          onClick={() => goToPage('/about-us')}
        >
          About Us
        </button>
        <button
          className='align-middle transition duration-150 ease-in-out delay-0 h-full rounded-lg my-3 py-1 px-3 text-white bg-slate-600 hover:bg-slate-700 hover:scale-105'
          onClick={() => goToPage('/faq')}
        >
          FAQ
        </button>
      </div>
      <div
        className='h-screen flex flex-col justify-center items-center'
        style={{ backgroundColor: '#222' }}
      >
        <div
          className='p-5 rounded-lg'
          style={{
            backgroundColor: '#282a36',
            width: '400px',
            maxWidth: '90%',
          }}
        >
          <div className='flex items-center justify-center mb-5'>
            <img
              src={userimage}
              alt='profile'
              className='w-20 rounded-full object-cover'
            />
          </div>
          <h2 className='text-xl'>
            {' '}
            {userName && (

              <p className=''>
                Hello,{' '}
                <span className=' text-2xl madimi-one-regular'>{userName}</span>{' '}
              </p>
            )}{' '}
          </h2>
          <h4 className='mb-5 text-xl'>Join a Room</h4>
          <div className='flex flex-col'>
            <input
              type='text'
              className='p-2.5 rounder-md mb-3.5 text-base font-bold placeholder-gray-500 text-gray-700'
              style={{ backgroundColor: '#eee' }}
              placeholder='ROOM ID'
              onChange={(e) => setRoomId(e.target.value)}
              value={roomId}
              onKeyUp={handleInputEnter}
            />
            <input
              type='text'
              className='p-2.5 rounder-md mb-3.5 text-base font-bold placeholder-gray-500 text-gray-700'
              style={{ backgroundColor: '#eee' }}
              disabled
              placeholder='USERNAME'

              onChange={(e) => setUserName(e.target.value)}
              value={userName}
              onKeyUp={handleInputEnter}
            />
            <button
              className='cursor-pointer font-bold rounded-md p-2.5 text-base w-full ml-auto text-cyan-0 bg-green-400 hover:bg-green-600 hover:scale-105'
              onClick={joinRoom}
            >
              JOIN
            </button>
            <span className='mt-5'>
              If you don't have an invite, click on &nbsp;
              <a
                onClick={createNewRoom}
                href=''
                className='transition delay-100 ease-in-out text-green-500 hover:text-green-600 hover:underline underline-offset-4'
              >
                Create New Room
              </a>
            </span>
          </div>
        </div>
        <div>
          <button
            className='p-2.5 rounded-md cursor-pointer font-bold text-base w-24 ml-auto mt-2.5 bg-red-700 hover:bg-red-800'
            onClick={logout}
          >
            Log Out
          </button>
        </div>
      </div>
      <style jsx>{`
        .loader-circle {
          width: 40px
          height: 40px
          border-radius: 50%
          border: 4px solid rgba(255, 255, 255, 0.3)
          border-top-color: #fff
          animation: spin 1s linear infinite
        }

        @keyframes spin {
          to {
            transform: rotate(360deg)
          }
        }
      `}</style>
    </div>

  )
}
export default RoomCreation

