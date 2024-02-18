import React from "react";
import { Navigate } from "react-router-dom";
import "./Editor.css";
import Editor from "../components/Editor";
import FileView from "../components/FileView";

const EditorPage = () => {
  
  const leaveRoom = () => {
    <Navigate to ="/"></Navigate>;
  };

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
        <button className="btn copyBtn">Copy ROOM ID</button>
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
