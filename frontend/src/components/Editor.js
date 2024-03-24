import React, { useEffect, useState } from 'react'
import Codemirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'
import ACTIONS from '../Actions'

const Editor = ({
  handleDownloadFile,
  socketRef,
  roomId,
  editorRef,
  fileContent,
  setFileContent
}) => {
  // const [fileContent, setFileContent] = useState("")
  const [contentChanged] = useState(false)
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

  console.log(fileContent)
  console.log(contentChanged)

  // useEffect(() => {
  //   setFileContent(window.localStorage.getItem("fileContent"))
  //   setContentChanged(window.localStorage.getItem("contentChanged"))
  // }, [])

  window.localStorage.setItem('roomid', roomId)
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
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        // console.log("hi");
        if (code !== null) {
          editorRef.current.setValue(code)
        }
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

  return <textarea id='realEditor' />
}

export default Editor
