import React, { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../index";
import axios from "axios";

const RoomCreation = () => {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");

  // Retrieve user data from local storage
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");

    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      setUserName(userData.name);
      setUserImage(userData.picture);
    }
  }, []);

  // Logout function
  const logout = () => {
    window.open(`${process.env.REACT_APP_API_URL}/auth/logout`, "_self");
  };

  // Create a new room
  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success("Created a new room");
  };

  // Join a room
  const joinRoom = () => {
    if (!roomId || !userName) {
      toast.error("ROOM ID & username is required");
      return;
    }

    navigate(`/editor/${roomId}`, {
      state: {
        userName,
      },
    });
  };

  const handleInputEnter = (e, inputType) => {
    if (e.code === "Enter") {
      if (inputType === "roomId") {
        setRoomId(e.target.value);
      } else if (inputType === "userName") {
        setUserName(e.target.value);
      }
      joinRoom();
    }
  };

  const goToPage = (url) => {
    navigate(url);
  };

  return (
    <div className="flex flex-col text-white">
      <Toaster />
      <div className="flex justify-left gap-3 " style={{ backgroundColor: "#282a36" }}>
        <button
          className="align-middle transition duration-150 ease-in-out h-full rounded-lg my-3 ml-3 py-1 px-3 text-white bg-slate-600 hover:bg-slate-700 hover:scale-105"
          onClick={() => goToPage("/about-us")}
        >
          About Us
        </button>
        <button
          className="align-middle transition duration-150 ease-in-out delay-0 h-full rounded-lg my-3 py-1 px-3 text-white bg-slate-600 hover:bg-slate-700 hover:scale-105"
          onClick={() => goToPage("/faq")}
        >
          FAQ
        </button>
      </div>
      <div className="h-screen flex flex-col justify-center items-center" style={{ backgroundColor: "#222" }}>
        <div className="p-5 rounded-lg" style={{ backgroundColor: "#282a36", width: "400px", maxWidth: "90%" }}>
          <div className="flex items-center justify-center mb-5">
            <img src={userImage} alt="profile-image" className="w-20 rounded-full object-cover"></img>
          </div>
          <h2 className="text-xl">
            {userName && <p className="text-2xl madimi-one-regular">{userName}</p>}
          </h2>
          <h4 className="mb-5 text-xl">Join a Room</h4>
          <div className="flex flex-col">
            <input
              type="text"
              className="p-2.5 rounder-md mb-3.5 text-base font-bold placeholder-gray-500 text-gray-700"
              style={{ backgroundColor: "#eee" }}
              placeholder="ROOM ID"
              onChange={(e) => setRoomId(e.target.value)}
              value={roomId}
              onKeyUp={(e) => handleInputEnter(e, "roomId")}
            />
            <input
              type="text"
              className="p-2.5 rounder-md mb-3.5 text-base font-bold placeholder-gray-500 text-gray-700"
              style={{ backgroundColor: "#eee" }}
              placeholder="USERNAME"
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
              onKeyUp={(e) => handleInputEnter(e, "userName")}
            />
            <button
              className="cursor-pointer font-bold rounded-md p-2.5 text-base w-full ml-auto text-cyan-0 bg-green-400 hover:bg-green-600 hover:scale-105"
              onClick={joinRoom}
            >
              JOIN
            </button>
            <span className="mt-5">
              If you don't have an invite, click on &nbsp;
              <a
                onClick={createNewRoom}
                href=""
                className="transition delay-100 ease-in-out text-green-500 hover:text-green-600 hover:underline underline-offset-4"
              >
                Create New Room
              </a>
            </span>
          </div>
        </div>
        <div>
          <button className="p-2.5 rounded-md cursor-pointer font-bold text-base w-24 ml-auto mt-2.5 bg-red-700 hover:bg-red-800" onClick={logout}>
            Log Out
          </button>
        </div>
     
