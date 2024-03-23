import React, { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import '../index';
import axios from "axios";

const Room_Creation = () => {
	const navigate = useNavigate();

	const [roomId, setRoomId] = useState("");
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
		toast.success("Created a new room");
	};

	//this function is used to join a room
	const joinRoom = () => {
		if (!roomId || !userName) {
			toast.error("ROOM ID & username is required");
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
		if (e.code === "Enter") {
			joinRoom();
		}
	};
	const goToPage = (url) => {
		navigate(url);
	};

	return (
		<div className="flex flex-col text-white">
			<Toaster />
			<div className="flex justify-left gap-3 " style={{backgroundColor: "#282a36"}}>
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
            <div className="h-screen flex flex-col justify-center items-center" style={{backgroundColor: "#222"}}>
                <div className="p-5 rounded-lg" style={{backgroundColor: "#282a36", width: "400px", maxWidth: "90%"}}>
                    <div className="flex items-center justify-center mb-5">
                        <img src={userimage} alt="profile-image" className="w-20 rounded-full object-cover"></img>
                    </div>
                    <h2 className="text-xl"> { userName && <p className="">Hello, <span className= " text-2xl madimi-one-regular">{userName}</span> </p> } </h2>
                    <h4 className="mb-5 text-xl">Join a Room</h4>
                    <div className="flex flex-col">
                        <input
                            type="text"
                            className="p-2.5 rounder-md mb-3.5 text-base font-bold placeholder-gray-500 text-gray-700"
                            style={{backgroundColor: "#eee"}}
                            placeholder="ROOM ID"
                            onChange={(e) => setRoomId(e.target.value)}
                            value={roomId}
                            onKeyUp={handleInputEnter}
                        />
                        <input
                            type="text"
                            className="p-2.5 rounder-md mb-3.5 text-base font-bold placeholder-gray-500 text-gray-700"
                            style={{backgroundColor: "#eee"}}
                            placeholder="USERNAME"
                            onChange={(e) => setUserName(e.target.value)}
                            value={userName}
                            onKeyUp={handleInputEnter}
                        />
                        <button 
                            className="cursor-pointer font-bold rounded-md p-2.5 text-base w-full ml-auto text-cyan-0 bg-green-400 hover:bg-green-600 hover:scale-105" 
                            onClick={joinRoom}
                        >
                            JOIN
                        </button>
                        <span className="mt-5">
                            If you don't have an invite, click on &nbsp;
                            <a onClick={createNewRoom} href="" className="transition delay-100 ease-in-out text-green-500 hover:text-green-600 hover:underline underline-offset-4">
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
            </div>
		</div>
	);
};

export default Room_Creation;
