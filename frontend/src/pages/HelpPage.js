import React, { useState } from 'react'
import '../styles/helpPage.css'
import LoginDemo from '../images/LoginDemo.png'
import SignUp from '../images/SignUp.png'
import Password from '../images/Password.png'
import Room from '../images/Room.png'
import RoomCreation from '../images/RoomCreation.png'
import ChatBox from '../images/ChatBox.png'
import { Toaster } from 'react-hot-toast'

const HelpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('http://localhost:8080/help', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        // Handle success, e.g., show a success message
        console.log('Form submitted successfully')
      } else {
        // Handle error, e.g., show an error message
        console.error('Form submission failed')
      }
      setFormData({
        name: '',
        email: '',
        message: ''
      })
    } catch (error) {
      console.error('Error:', error)
    }

    // Clear form data after submission
    setFormData({
      name: '',
      email: '',
      message: ''
    })
  }

  return (
    <div className='xwz'>
      <div className='smpct'>
        <h1 className='hdng'>Help</h1>
        <div className='stt'>
          <div className='sttcntnt'>
            <div className='stinfo'>
              <h2>Step 1: Login</h2>
              <p>
                On the login screen, you will see an option to sign in with your
                Google account.
              </p>
              <p>Click on the 'Sign in with Google' button.</p>
            </div>
            <div className='stimge'>
              <img src={LoginDemo} alt='Login Demo' />
            </div>
          </div>
        </div>

        <div className='stt'>
          <div className='sttcntnt'>
            <div className='stimge'>
              <img src={SignUp} alt='Authenticate Demo' />
            </div>
            <div className='stinfo'>
              <h2>Step 2: Authenticate with Google</h2>
              <p>You will be redirected to Google's authentication page.</p>
              <p>
                Enter your Google credentials or use an already saved account.
              </p>
            </div>
          </div>
        </div>

        <div className='stt'>
          <div className='sttcntnt'>
            <div className='stinfo'>
              <h2>Step 3: Password verification</h2>
              <p>
                Enter your password and click on 'Next' to continue with the
                sign-in process.
              </p>
              <p>
                If you don't remember your password, click on the forgot
                password option.
              </p>
            </div>
            <div className='stimge'>
              <img src={Password} alt='Password Demo' />
            </div>
          </div>
        </div>

        <div className='stt'>
          <div className='sttcntnt'>
            <div className='stimge'>
              <img src={RoomCreation} alt='Room Demo' />
            </div>
            <div className='stinfo'>
              <h2>Step 4: Room creation and Joining</h2>
              <p>
                If you have a room ID available, enter it in the 'Room ID”
                option and click on 'Join'.
              </p>
              <p>
                If you want to create a new room, click on the “Create New Room
                option”.
              </p>
              <p>
                This will prompt a new room ID which will be visible to you in
                the 'Room ID' option. Now, click on 'Join'.
              </p>
            </div>
          </div>
        </div>

        <div className='stt'>
          <div className='sttcntnt'>
            <div className='stinfo'>
              <h2>Step 5: Code editor</h2>
              <p>
                UPLOAD FILE: This option allows you to upload any file from your
                local device to your editor screen. All users currently present
                in the same room as you would be able to view it and all changes
                made to it.
              </p>
              <p>
                CONNECTED USERS HERE: Here, you can see the usernames of all
                connected users in the room.
              </p>
              <p>
                COPY ROOM ID: This allows you to copy your current room ID so
                that you can share it with the collaborators to your project.
              </p>
              <p>
                LEAVE: This button prompts the user to leave the current room
                the user is in.
              </p>
              <p>
                EDITOR: The code editor has real-time synchronization to handle
                multiple cursors at the same time. All users present in a room
                currently can modify the editor's code.
              </p>
              <p>
                CHAT: This button opens up a chat box where you can communicate
                with other users in the same room as you.
              </p>
            </div>
            <div className='stimge'>
              <div className='stimge'>
                <img src={Room} alt='Editor Demo' />
              </div>
              <div className='stimge'>
                <img src={ChatBox} alt='Editor Demo' />
              </div>
            </div>
          </div>
        </div>
        <div className='w-full flex justify-center'>
          <div className='flex justify-center h-96 w-3/4 gap-6'>
            <div className='flex flex-col justify-center w-1/2 gap-6'>
              <p className='text-5xl text-center satisfy-regular font-bold'>
                Contact Us
              </p>
              <p className='text-xl text-center satisfy-regular p-12'>
                Great things are not done by impulse, but by a series of small
                things brought together.
              </p>
            </div>
            <div className='flex flex-col justify-center w-1/4'>
              <form
                onSubmit={handleSubmit}
                className='flex flex-col'
                method='POST'
              >
                <div className='mb-5'>
                  <label className='text-lg mb-2' htmlFor='name'>
                    Name
                  </label>
                  <input
                    className='w-full text-gray-700 p-2.5 text-lg border-2 border-solid rounded-md outline-none border-stone-300'
                    type='text'
                    id='name'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className='frmgp'>
                  <label className='text-lg mb-2' htmlFor='email'>
                    Email
                  </label>
                  <input
                    className='w-full text-gray-700 p-2.5 text-lg border-2 border-solid rounded-md outline-none border-stone-300'
                    type='email'
                    id='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className='frmgp'>
                  <label className='text-lg mb-2' htmlFor='message'>
                    Message
                  </label>
                  <textarea
                    className='w-full text-gray-700 p-2.5 text-lg border-2 border-solid rounded-md outline-none border-stone-300'
                    id='message'
                    name='message'
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button
                  type='submit'
                  className='w-full p-2.5 bg-blue-600 text-white text-lg border-none rounded-md cursor-pointer outline-none mb-6 hover:bg-blue-700'
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
        <Toaster />
      </div>
    </div>
  )
}

export default HelpPage
