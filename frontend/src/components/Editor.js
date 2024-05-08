import React, { useEffect,useRef,useState } from 'react'
import Codemirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'
import ACTIONS from '../Actions'

const Editor = ({
  socketRef,
  roomId,
  editorRef,
  fileContent,
  contentChanged,
  connectedClients,
}) => {
  let editorChanged = false
  const [UserName,setUserName] = useState()
  const scrollTopRef = useRef(0)
  window.localStorage.setItem('roomid', roomId)
  // Retrieve user data from local storage
  useEffect(() => {
    const storedUserData = window.localStorage.getItem('userData')
    if (storedUserData) {
      const userData = JSON.parse(storedUserData)
      setUserName(userData.name)
    }
  }, [])
  //inputs: 1.cursorPosition- list containing cursor position of all users in room, 2.currentUserId- socketId of current user 
  //This function loops through cursorposition list and calls rendercursor for all users other self
  const renderAllCursors = (cursorPosition,currentUserId) => {
    Object.entries(cursorPosition).forEach(([userId,cursorData]) => {
      if(userId!==currentUserId){
        renderCursors(cursorData)
      }
    })
  }
  //add blinkcursor style to document and remove when unmounts
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes blinkCursor {
        0%, 100% {
          opacity: 1
        }
        100% {
          opacity: 0
        }
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])
  //update editor content when file is uploaded and emit changed code to room
  useEffect(() => {
    if (!editorRef.current) return
    editorRef.current.setValue('') // to avoid repetition of old instances
    if (fileContent) {
      editorRef.current.setValue(fileContent)
      const code = fileContent
      socketRef.current.emit(ACTIONS.CODE_CHANGE, {
        roomId,
        code,
      })
    }
  }, [fileContent, contentChanged])
  
  useEffect(() => {
    async function init() {
      //create codemirror editor instance from textarea element and sets it theme and readonly initially
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById('realEditor'),
        {
          mode: { name: 'javascript', json: true },
          theme: 'dracula',
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
          readOnly: true,
        }
      )
      //set editor value if file is present
      if (fileContent) {
        editorRef.current.setValue(fileContent)
      }
      //attach event listener to listen code change event by codemirror and callback function which has
      //inputs: instance- instance of codemirror where change occured , changes- contains information of code change
      //the function checks if change has occured non programatically and emits the cursor info and code to the room
      editorRef.current.on('change', (instance, changes) => {
        scrollTopRef.current = editorRef.current.getScrollInfo().top
        editorChanged = true
        const { origin } = changes
        const code = instance.getValue()
        if (origin !== 'setValue') {
          const cursor = instance.getCursor()
          const userData = JSON.parse(localStorage.getItem('userData'))
          const cursorData = {
            cursor: { line: cursor.line, ch: cursor.ch },
            user: {email: userData.email, name: userData.name },
            tab: null,
          }
          const socketid = socketRef.current.id
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
            cursorData,
            socketid
          })
        }
      })
    }
    init()
  }, [])
  //attach event listener to listen cursorActivity event by codemirror and callback function which has
  //input: instance- the code mirror instance where cursor activity was observed
  //this function checks if the cursor has been moved without editor content being changed and
  //in which case emits the cursor info to the room 
  useEffect(() => {
    editorRef.current.on('cursorActivity', (instance) => {
      const cursor = instance.getCursor()
      const userData = JSON.parse(localStorage.getItem('userData'))
      const cursorData = {
        cursor: { line: cursor.line, ch: cursor.ch },
        user: { email: userData.email, name: userData.name },
        tab: null,
      }
      if (!editorChanged) {
        socketRef.current.emit(ACTIONS.CURSOR_CHANGE, {
          roomId,
          cursorData,
        })
      }
      editorChanged = false
      }
    )
  },[editorRef])
  
  useEffect(() => {
    if (socketRef.current) {
      //if socket connection is availale listen CODE_CHANGE event which has
      //input: code- contains new change code, cursorPosition- contains cursor position list of all users in room
      //and set editor value to code recieved and call renderAllCursors function with cursorPosition and scoket id as parameters
      //and prevent scrolling to top
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code , cursorPosition}) => {
        if (code !== null) {
          editorRef.current.setValue(code)
        }
        renderAllCursors(cursorPosition, socketRef.current.id)
        editorRef.current.scrollTo(null,scrollTopRef.current )
      })
      //listen for CURSOR_CHANGE event and call rendercursors with cursorData as parameter
      //input- cursorData: info of cursor changed
      socketRef.current.on(ACTIONS.CURSOR_CHANGE, ({ cursorData }) => {
        renderCursors(cursorData)
      })
      //listen for DISCONNECTED event and remove cursors of that user if present
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ username }) => {
        const prevCursorMarkers = document.querySelectorAll(
          `.cursor-marker[title='${username}']`
        )
        prevCursorMarkers.forEach((marker) => marker.remove())
      })
    }
  }, [socketRef.current])
  
  useEffect(() => {
    // Fetch code from the backend using room ID
    if (roomId) {
      async function fetchCode() {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/receivecode`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ roomId }),
          })
          if (response.ok) {
            const { code } = await response.json()
            if (code !== null) {
              editorRef.current.setValue(code)
            }
          } else {
            console.log('Failed to fetch code')
          }
        } catch (error) {
          console.log('Error fetching code:', error)
        }
      }
      fetchCode()
    }
  }, [roomId])
  //function generates random color each time using random()
  //input- none ,output- random generated color number format "#AAAAAA"
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }
  // Function renders cursor with cursor info provided, assigns proper style to cursor and tooltip displaying username
  // input: cursorInfoList- cursor info of the cursor to be rendered ,output- attaches cursor div to document at
  // the desired position
  const renderCursors = (cursorInfoList) => {
    if (cursorInfoList) {
      const { cursor, tab, user } = cursorInfoList
      const { ch, line } = cursor
      if (!connectedClients.current.includes(user.name) || user.name===UserName) return

      const prevCursorMarkers = document.querySelectorAll(
        `.cursor-marker[title='${user.name}']`
      )
      prevCursorMarkers.forEach((marker) => marker.remove())

      const cursorMarker = document.createElement('div')
      cursorMarker.className = 'cursor-marker'
      cursorMarker.style.position = 'absolute'
      cursorMarker.classList.add('h-8', 'w-0.5')
      cursorMarker.style.backgroundColor = getRandomColor() // Assign a random color
      cursorMarker.title = user.name
      const editorContainer = document.querySelector('.CodeMirror-scroll')
      editorContainer.appendChild(cursorMarker)
      cursorMarker.style.animation = 'blinkCursor 1s infinite'
      cursorMarker.style.left = `${
        editorRef.current.charCoords({ line, ch }).left
      -300}px`
      const cursorPosition1 = editorRef.current.charCoords({ line, ch },'local')
      const topPosition = cursorPosition1.top 
      cursorMarker.style.top = `${topPosition}px`

      const tooltip = document.createElement('div')
      tooltip.className = 'tooltip'
      tooltip.innerText = user.name.split(' ')[0]
      tooltip.style.fontSize = '10px'
      tooltip.style.padding = '2px 4px'
      cursorMarker.appendChild(tooltip)
    }
  }
  // Clean up cursor markers when component unmounts
  useEffect(() => {
    return () => {
      document
        .querySelectorAll('.cursor-marker')
        .forEach((node) => node.remove())
    }
  }, [])
  return (
    <div className='editor-container' style={{ overflow: 'auto'}}>
      <textarea id='realEditor' style={{}} />
    </div>
  )
}

export default Editor
