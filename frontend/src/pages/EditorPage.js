import React, { useState, useEffect, useRef } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import "./Editor.css";
import ACTIONS from "../Actions";
import toast from 'react-hot-toast';
import Editor from "../components/Editor";
import FileView from "../components/FileView";
import { initSocket } from "../socket";

const EditorPage = () => {

  const { roomId } = useParams();
  const socketRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const leaveRoom = () => {
    console.log("in LeaveRoom")
    navigate('/', {
      roomId: roomId,
    });
  };

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error', (err) => handleErrors(err));
      socketRef.current.on('connect_failed', (err) => handleErrors(err));

      function handleErrors(e) {
        console.log('socket error', e);
        toast.error('Socket connection failed, try again later.');
    }

    socketRef.current.emit(ACTIONS.JOIN, {
      roomId,
      username: location.state?.username,
    });
    }
    init();
  }, []);

  async function copyRoomId() {
    try {
        await navigator.clipboard.writeText(roomId);

        toast.success('Room ID has been copied to your clipboard');
    } catch (err) {
        toast.error('Could not copy the Room ID');
        console.error(err);
    }
}

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img className="logoImage" src="" alt="logo" />
          </div>
          <div className="fileTreeView">
            <FileView></FileView>
          </div>
          </div>
          <div className="Users">
            <h3>Connected Users here</h3>
          </div>
        <button className="btn copyBtn" onClick={copyRoomId}>Copy ROOM ID</button>
        <button className="btn leaveBtn" onClick={leaveRoom}>
          Leave
        </button>
      </div>

      <div >
        <Editor></Editor>
      </div>
    </div>
  );
};

export default EditorPage;
