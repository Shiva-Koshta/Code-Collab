import React, { useEffect, useRef } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";

const Editor = ({ fileContent }) => {
  const editorRef = useRef(null);

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
      // editorRef.current.on("change",(instance,changes) => {console.log("changes",changes);})
      if (fileContent) {
        // console.log("here")
        editorRef.current.setValue(fileContent); // Set file content to CodeMirror editor
      }
    }
    init();
  }, [fileContent]);

  return <textarea  id="realEditor"></textarea>;
};

export default Editor;
