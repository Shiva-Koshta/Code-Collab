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
        // console.log(changes);
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
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        //console.log("hi");
        if (code !== null) {
          editorRef.current.setValue(code);
        }
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