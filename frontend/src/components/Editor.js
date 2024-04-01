import React, { useEffect } from 'react'
import Codemirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'
import ACTIONS from '../Actions'

const Editor = ({ handleDownloadFile, socketRef, roomId, editorRef, fileContent, setFileContent, contentChanged }) => {
  // const [fileContent, setFileContent] = useState("")
  // const [contentChanged, setContentChanged] = useState(false)
  // useEffect(() => {
  //   const handleStorageChange = () => {
  //     setFileContent(window.localStorage.getItem('fileContent'))
  //     setContentChanged(window.localStorage.getItem('contentChange'))
  //   }
  //   window.addEventListener('storage', handleStorageChange)
  //   return () => {
  //     window.removeEventListener('storage', handleStorageChange)
  //   }
  // }, [])
  // useEffect(() => {
  //   setFileContent(window.localStorage.getItem("fileContent"))
  //   setContentChanged(window.localStorage.getItem("contentChanged"))
  // }, [])

  window.localStorage.setItem('roomid', roomId)

  useEffect(() => {
    // Create style element
    const style = document.createElement("style");
    style.textContent = `
      @keyframes blinkCursor {
        0%, 100% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }
    `;

    // Append style to document head
    document.head.appendChild(style);

    // Clean up function to remove style element when component unmounts
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    // console.log("hi");
    if (!editorRef.current) return

    editorRef.current.setValue('')// to avoid repetition of old instances
    // console.log("fileref  current:",fileRef.current)
    if (fileContent) {
      editorRef.current.setValue(fileContent)
    }
  }, [fileContent, contentChanged])
  useEffect(() => {
    // console.log("file added");
    if (fileContent) {
      console.log(fileContent)
      const code = fileContent
      socketRef.current.emit(ACTIONS.CODE_CHANGE, {
        roomId,
        code
      })
    }
  }, [fileContent, contentChanged])
  useEffect(() => {
    async function init () {
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById('realEditor'),
        {
          mode: { name: 'javascript', json: true },
          theme: 'dracula',
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true
        }
      )

      if (fileContent) {
        editorRef.current.setValue(fileContent)
        // socketRef.current.emit(ACTIONS.CODE_CHANGE, {
        //   roomId,
        //   fileRef.current,
        // }); // Set file content to CodeMirror editor
      }

      editorRef.current.on('change', (instance, changes) => {
        // console.log(changes)
        const { origin } = changes
        const code = instance.getValue()
        if (origin !== 'setValue') {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code
          })
        }
      })
    }
    init()
  }, [])
 
  useEffect(() => {
    editorRef.current.on("cursorActivity", (instance) => {
      const cursor = instance.getCursor();
      const userData = JSON.parse(localStorage.getItem("userData"));
      const cursorData = {
        cursor: { line: cursor.line, ch: cursor.ch },
        user: {email: userData.email, name: userData.name },
        tab: null,
      }
      console.log(cursorData);
      socketRef.current.emit(ACTIONS.CURSOR_CHANGE, {
        roomId,
        cursorData,
      })
    })
  },[editorRef])
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        // console.log("hi");
        if (code !== null) {
          editorRef.current.setValue(code)
        }
      })
      socketRef.current.on(ACTIONS.CURSOR_CHANGE, ({cursorData}) => {
        console.log("cursorData retrieved from user: "+cursorData.user.name)
        console.log(cursorData)
      })
    }
  }, [socketRef.current])
  useEffect(() => {
    // Fetch code from the backend using room ID
    if (roomId) {
      console.log(JSON.stringify({ roomId }))
      async function fetchCode () {
        try {
          const response = await fetch('http://localhost:8080/receivecode', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ roomId })
          })
          if (response.ok) {
            const { code } = await response.json()
            if (code !== null) {
              editorRef.current.setValue(code)
            }
          } else {
            console.error('Failed to fetch code')
          }
        } catch (error) {
          console.error('Error fetching code:', error)
        }
      }
      fetchCode()
    }
  }, [roomId])

  // useEffect(() => {
  //   console.log(newusernameRef.current)
  //   if (socketRef.current && newusernameRef.current !== null) {
  //     if (newusernameRef.current === "RITESH PATIL") {
  //       console.log("entered here")
  //       console.log(newusernameRef.current)
  //       var code = editorRef.current.getValue()
  //       console.log("code1 :",code)
  //       socketRef.current.emit(ACTIONS.CODE_CHANGE, {
  //         roomId,
  //         code,
  //       })
  //     }
  //   }
  // }, [newuserRef.current, socketRef.current, newusernameRef.current])
  // useEffect(() => {
  //   if (socketRef.current) {
  //     console.log("hi")
  //     socketRef.current.on(ACTIONS.SYNC_CHANGE, ({ code }) => {
  //       if (code !== null) {
  //         editorRef.current.setValue(code);
  //       }
  //     });
  //   }
  // }, [socketRef.current]);
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  // Function to render cursors
  const renderCursors = (cursorInfoList) => {
    if (cursorInfoList) {
      const { cursor,tab, user } = cursorInfoList;
      const { ch, line } = cursor;
      // const cursorMarkerId = `cursor-marker-${user.email}`;
      // let cursorMarker = document.getElementById(cursorMarkerId);
      // Create a cursor marker element if not present
      // if (!cursorMarker){
        const prevCursorMarkers = document.querySelectorAll(`.cursor-marker[title="${user.name}"]`);
      prevCursorMarkers.forEach((marker) => marker.remove());

      const cursorMarker = document.createElement("div");
      cursorMarker.className = "cursor-marker";
      cursorMarker.style.position = "absolute";
      cursorMarker.classList.add("h-8", "w-px");

      cursorMarker.style.backgroundColor = getRandomColor(); // Assign a random color
      cursorMarker.title = user.name;

      // Append cursor marker to CodeMirror editor container
      editorRef.current.getWrapperElement().appendChild(cursorMarker);
      cursorMarker.style.animation = "blinkCursor 1s infinite";
      // }

      cursorMarker.style.left = `${
        editorRef.current.charCoords({ line, ch }).left
      -324}px`;
      cursorMarker.style.top = `${
        editorRef.current.charCoords({ line, ch }).top
      }px`;
      // console.log(editorRef.current.charCoords({ line, ch }).top);
      // Define CSS keyframes for blinking effect
    }
  };
  // Clean up cursor markers when component unmounts
  useEffect(() => {
    return () => {
      document
        .querySelectorAll(".cursor-marker")
        .forEach((node) => node.remove());
    };
  }, []);
  return <textarea id='realEditor' />
}

export default Editor
