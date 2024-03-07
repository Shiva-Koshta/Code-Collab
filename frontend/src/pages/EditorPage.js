import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Editor.css";
import Editor from "../components/Editor";
import FileView from "../components/FileView";
import logo from "../res/bg.png";

const EditorPage = () => {
  const navigate = useNavigate();

  const [fileContent, setFileContent] = useState(""); 

  const handleFileChange = (event) => {
    console.log("reached");
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      setFileContent(content);
      console.log(content); 
    };

    reader.readAsText(file); 
  };

  const leaveRoom = () => {
    navigate("/");
  };

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img className="logoImage" src={logo} alt="logo" />
            <div >Code Collab</div>
          </div>
          <div className="fileTreeView">
            <label
              className="fileLabel"
              for="file_input"
            >
              Upload file
            </label>
            <input
              className="FileInput"
              id="file_input"
              type="file"
              onChange={handleFileChange}
            />
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
      <div>
        <Editor fileContent={fileContent}></Editor>
      </div>
    </div>
  );
};

export default EditorPage;
