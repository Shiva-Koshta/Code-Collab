import React, { useEffect, useState } from "react";
import { v4 as uuidV4 } from 'uuid';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import "../styles/Room_Creation.css";
import axios from "axios";


const Room_Creation = () => {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState("");
  const [userimage, setUserimage] = useState("");


  //this function is used to logout the user
  const logout = () => {
    window.open(`${process.env.REACT_APP_API_URL}/auth/logout`, "_self");
  };



  useEffect(() => {
    // Retrieve user data from local storage
    const storedUserData = localStorage.getItem("userData");

    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      // Assuming the user's name is stored in the 'name' property
      setUserName(userData.name);
      setUserimage(userData.picture);
    }
  }, []);

  //this function is used to create a new room
  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success('Created a new room');
  };

  //this function is used to join a room
  const joinRoom = () => {
    if (!roomId || !userName) {
      toast.error('ROOM ID & username is required');
      return;
    }

    //this will navigate to the editor page
    // axios.post("http://localhost:8080/createroom", { "roomId" : roomId})
    navigate(`/editor/${roomId}`, {
      state: {
        userName,
      },
    });
    // axios.get("https://localhost:8080/editor/:id", {"roomId" : roomId})
    //   .then(res => {
    //     console.log("Response:", res.data);
    //   })
    //   .catch(error => {
    //     console.error("Axios request failed:", error.message);
    //   })
  };

  const handleInputEnter = (e) => {
    if (e.code === 'Enter') {
      joinRoom();
    }
  };
  const goToPage = (url) => {
    navigate(url);
  };


  return (
    <div>
      <div>
      <Toaster/>
        {/* first div */}
        <div>
          <nav className="navbar">
            <button className="navbar-button" onClick={() => goToPage('/aboutus')}>About Us</button>
            <button className="navbar-button" onClick={() => goToPage('/faq')}>FAQ</button>

          </nav>
        </div>


        <div className="homePageWrapper dark-background">
          <div className="formWrapper">
          <div className="imageWrapper">
          <img src={userimage} alt="profile" className="profileImage"/>
          </div>
          <h2> {userName && <p>Hello, {userName}</p>}</h2>
            <h4 className="mainLabel">Join a Room</h4>
            <div className="inputGroup">
              <input
                type="text"
                className="inputBox"
                placeholder="ROOM ID"
                onChange={(e) => setRoomId(e.target.value)}
                value={roomId}
                onKeyUp={handleInputEnter}
              />
              <input
                type="text"
                className="inputBox"
                placeholder="USERNAME"
                onChange={(e) => setUserName(e.target.value)}
                value={userName}
                onKeyUp={handleInputEnter}
              />
              <button className="btn joinBtn" onClick={joinRoom}>
                Join
              </button>
              <span className="createInfo">
                If you don't have an invite, click on &nbsp;
                <a
                  onClick={createNewRoom}
                  href=""
                  className="createNewBtn"
                >
                  Create New Room
                </a>
              </span>
            </div>
          </div>


          <div >
          <button className="logout_btn" onClick={logout}>Log Out</button>
          </div>
        </div>

        <footer>
        
        </footer>
      </div>




      <div>
        <h1>Welcome to the Homepage(just a example homepage)</h1>
        {userName && <p>Hello, {userName}!</p>}
        <img src={userimage} alt="profile" />
        <button onClick={logout}>Log Out</button>
      </div>

    </div>
  );
};


export default Room_Creation;



