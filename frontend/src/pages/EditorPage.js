import React from "react";
import "./Editor.css";
import Editor from '../components/Editor';


const EditorPage = () => {
  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img className="logoImage" src="/code-sync.png" alt="logo" />
            <div>
                <h3>FILE TREE VIEW HERE...</h3>
            </div>
          </div>
          <h3>Connected</h3>
          {/* <div className="clientsList">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div> */}
        </div>
        <button className="btn copyBtn">Copy ROOM ID</button>
        <button className="btn leaveBtn">Leave</button>
      </div>
      {/* onClick={copyRoomId} onClick={leaveRoom} */}
      {/* <div className="editorWrap">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div> */}
      <div className="EditorWrap">
        <Editor></Editor>
      </div>
    </div>
  );
};

export default EditorPage;
