import React, { useEffect, useRef } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import ACTIONS from "../Actions";

const Editor = ({ fileRef, socketRef, roomId}) => {
  const editorRef = useRef(null);

  useEffect(() => {  
    // console.log("hi");
    if (!editorRef.current) return;

    editorRef.current.setValue(""); // to avoid repetition of old instances
    // console.log("fileref  current:",fileRef.current);
    if (fileRef.current) {
      editorRef.current.setValue(fileRef.current); 
    }
  }, [fileRef.current]);
  
  

  useEffect(() => {
    //console.log("file added");
    if (fileRef.current) {
      //console.log(fileRef.current);
      var code = fileRef.current;
      socketRef.current.emit(ACTIONS.CODE_CHANGE, {
        roomId,
        code,
      });
    }
  },[fileRef.current]);


  useEffect(() => {
    async function init() {
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById("realEditor"),
        {
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );

      if (fileRef.current) {
        editorRef.current.setValue(fileRef.current);
        // socketRef.current.emit(ACTIONS.CODE_CHANGE, {
        //   roomId,
        //   fileRef.current,
        // }); // Set file content to CodeMirror editor
      }

      editorRef.current.on("change", (instance, changes) => {
        console.log(changes);
        const { origin } = changes;
        const code = instance.getValue();
        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    }
    init();
  }, []);
  useEffect(() => {
    editorRef.current.on("cursorActivity", (instance) => {
      const cursor = instance.getCursor();
      const userData = JSON.parse(localStorage.getItem("userData"));
      const cursorData = {
        cursor: { line: cursor.line, ch: cursor.ch },
        user: { email: userData.email, name: userData.name },
        tab: null,
      };
      console.log("cursorData transmitted by user: "+cursorData.user.name );
      console.log(cursorData);
      // console.log('userData:');
      // console.log(userData);
      socketRef.current.emit(ACTIONS.CURSOR_CHANGE, {
        roomId,
        cursorData,
      });
    });
  }, [editorRef]);
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        //console.log("hi");
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
      socketRef.current.on(ACTIONS.CURSOR_CHANGE, ({ cursorData }) => {
        // Update cursor position in the editor
        console.log("cursorData retrieved from user: "+cursorData.user.name)
        console.log(cursorData)
        
      });
    }
  }, [socketRef.current]);
  // useEffect(() => {
  //   console.log(newusernameRef.current);
  //   if (socketRef.current && newusernameRef.current !== null) {
      
  //     if (newusernameRef.current === "RITESH PATIL") {
  //       console.log("entered here");
  //       console.log(newusernameRef.current);
  //       var code = editorRef.current.getValue();
  //       console.log("code1 :",code);
  //       socketRef.current.emit(ACTIONS.CODE_CHANGE, {
  //         roomId,
  //         code,
  //       });
  //     }
  //   }
  // }, [newuserRef.current, socketRef.current, newusernameRef.current]);
  
  // useEffect(() => {
  //   if (socketRef.current) {
  //     console.log("hi");
  //     socketRef.current.on(ACTIONS.SYNC_CHANGE, ({ code }) => {
  //       if (code !== null) {
  //         editorRef.current.setValue(code);
  //       }
  //     });
  //   }
  // }, [socketRef.current]);

  return <textarea id="realEditor"></textarea>;
};

export default Editor;