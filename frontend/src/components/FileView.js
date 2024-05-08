/* eslint-disable no-undef */
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import {
  CircularProgress,
} from '@mui/material'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import FolderIcon from '@mui/icons-material/Folder'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import AddIcon from '@mui/icons-material/Add'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import CreateIcon from '@mui/icons-material/Create'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload'
import axios from 'axios'
import audioIcon from '../icons/audio.png'
import cIcon from '../icons/c.png'
import cppIcon from '../icons/cpp.png'
import csharpIcon from '../icons/cs.png'
import cssIcon from '../icons/css.png'
import defaultIcon from '../icons/default.png'
import htmlIcon from '../icons/html.png'
import imageIcon from '../icons/image.png'
import jsIcon from '../icons/js.png'
import jsonIcon from '../icons/json.png'
import pdfIcon from '../icons/pdf.png'
import pythonIcon from '../icons/python.png'
import textIcon from '../icons/text.png'
import videoIcon from '../icons/video.png'
import { toast } from 'react-hot-toast'
import Tooltip from '@mui/material/Tooltip'
import DownloadIcon from '@mui/icons-material/Download'
import ACTIONS from '../Actions'

const FileView = ({
  editorRef  ,
  contentChanged  ,
  setContentChanged  ,
  socketRef  ,
  connectedUserRoles  ,
  storedUserData  ,
  currentFile  ,
}) => {
  const { roomId } = useParams()
  const [isDownloadTrue, setIsDownloadTrue] = useState(false)
  const [downloadFileExtension, setFileExtension] = useState('')
  const [downloadFileName, setFileName] = useState('')
  const parentRef  = useRef(null)
  const [parentWidth, setParentWidth] = useState(0)
  const [folders, setFolders] = useState([
    {
      _id: '0',
      name: 'Root',
      type: 'root',

      children: []
    }
  ])
  const [selectedFileFolder, setSelectedFileFolder] = useState({
    _id: '0',
    name: 'Root',
    type: 'root',
    children: []
  })
  const [selectedFileFolderParent, setSelectedFileFolderParent] = useState({})
  const [isFolderOpen, setIsFolderOpen] = useState({ 0: false })
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [loading, setLoading] = useState(false)
  //Fetches the file system tree from the server, updates the state with the root folder,
  // and returns the ID of the root folder.
  const handleFilesystemChange = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/filesystem/generatetree`,
        {
          roomId,
        }
      )
      const root = response.data.tree
      setSelectedFileFolder(root)
      setFolders([root])
      return root._id
    } catch (error) {
      console.log(error)
    }
  }
  //Sets up event listeners for keyboard shortcuts (Ctrl+S and Ctrl+D),handles read-only mode based on user role and file availability,
  //removes cursor markers, and runs with current file change dependency
  useEffect(() => {
    if (currentFile.current == null) {
      if (editorRef?.current) {
        editorRef.current.setOption('readOnly', true)
        editorRef.current.setValue('')
      }
    } else {
      const currentUserRole = connectedUserRoles.find(
        (user) => user.name === storedUserData.current.name
      )?.role
      if (currentUserRole === 'viewer') {
        editorRef.current.setOption('readOnly', true)
      } else {
        editorRef.current.setOption('readOnly', false)
      }
    }
    document.querySelectorAll('.cursor-marker').forEach((node) => node.remove())
    const handleCtrlS = (event) => {
      if (event.ctrlKey && event.key === 's') {
        handleSaveFile(currentFile.current, true)
        event.preventDefault()
      }
      else if (event.ctrlKey && event.key === 'd') {
        event.preventDefault()
        downloadZipFile(roomId)
      }
    }
    document.addEventListener('keydown', handleCtrlS)
    return () => {
      document.removeEventListener('keydown', handleCtrlS)
    }
  }, [currentFile.current])

  useEffect(() => {
    if (socketRef.current) {
      //if socket is connected, listens to FILESYSTEM_CHANGE event in room and manages file tree by calling handlefilesystemchange()
      socketRef.current.on(ACTIONS.FILESYSTEM_CHANGE,({isdelete})=> {
        if(isdelete){currentFile.current=null}
        handleFilesystemChange()
      })
      //listens to SELECTED_FILE_CHANGE event and calls handlefileclick and sets parent folders as recieved by input  
      socketRef.current.on(ACTIONS.SELECTED_FILE_CHANGE, ({folder, parentFolder}) =>{
        handleFileClick(folder,parentFolder,false)
        setSelectedFileFolder(folder)
        setSelectedFileFolderParent(parentFolder)
      })
    }

  }, [socketRef.current])
  //handles file save by emitting SAVE_FILE event to room with fileid and its code and shows success message if required
  const handleSaveFile = (fileId, show) => {
    if (!fileId) {
      return
    }
    socketRef.current.emit(ACTIONS.SAVE_FILE, {
      roomId,
      fileId,
      code: editorRef.current.getValue(),
    })
    if (show) {
      toast.success(`File saved`)
    }
  }
  // Fetches the file system tree on component mount, no dependecy runs only once
  // sets up a window resize listener, and initializes state variables.
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/filesystem/generatetree`,
          {
            roomId: roomId
          }
        )
        const root = response.data.tree
        setSelectedFileFolder(root)
        setFolders([root])
        return root._id
      } catch (error) {
        console.log(error)
      }
    })()

    function handleResize() {
      setIsSmallScreen(window.innerWidth < 1260)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    if (parentRef.current) {
      const width = parentRef.current.getBoundingClientRect().width
      setParentWidth(width)
    }

    return () => window.removeEventListener('resize', handleResize)
  }, [])
  //runs when file is uploaded and updates file system tree, and emits a Socket action for file system change.
  //takes input: event- file changed event and parentfolder
  const handleFileChange = (event, parentFolder = selectedFileFolder) => {
    const file = event.target.files[0]
    const reader = new FileReader()
    setContentChanged(!contentChanged)
    window.localStorage.setItem('contentChanged', contentChanged)
    reader.onload = (e) => {
      const content = e.target.result;
      (async () => {
        try {
          setLoading(true)

          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/filesystem/uploadfile`,
            {
              name: file.name,
              parentId: parentFolder._id,
              roomId: roomId,
              content: content
            }
          )
          const newFile = {
            _id: response.data.file._id,
            name: response.data.file.name,
            type: response.data.file.type,

          }
          parentFolder.children.push(newFile)
          setFolders([...folders])
          socketRef.current.emit(ACTIONS.FILESYSTEM_CHANGE, {
            roomId,
          })
        } catch (error) {
          console.log(error)
        } finally {
          setLoading(false)

        }
      })()
    }
    if (file) {
      reader.readAsText(file)
    }
    event.target.value = null
  }
  //runs when a file clicked by user or any another user, takes input as file, parentfolder and isClicked to check if clicked by current user
  //saves file, loads file content, and emits a Socket action for selected file change if clicked by current user.
  const handleFileClick = async (folder,parentFolder,isClicked) => {
    const fileId = folder._id
    if (currentFile.current != null) {
      handleSaveFile(currentFile.current, false)
    }
    try {
      currentFile.current=fileId
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/filesystem/fetchfile`,
        {
          nodeId: fileId,
        }
      )
      editorRef.current.setValue(response.data.file.content)
      if(isClicked)
      {socketRef.current.emit(ACTIONS.SELECTED_FILE_CHANGE, {
        roomId,
        folder,
        parentFolder
      })}
      if(!isClicked)
      {const fileElement = document.getElementById(fileId)
        if (fileElement) {
          fileElement.click()
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  // Downloads the file content as a text file
  const handleDownloadFile = () => {
    const myContent = editorRef.current.getValue()
    const element = document.createElement('a')
    const file = new Blob([myContent], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${downloadFileName}.${downloadFileExtension}`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }
  //takes folder as input and prompts user for a new folder name, renames the folder,
  //updates the file system tree, and emits a Socket event for file system change
  const renameFolder = (folder) => {
    const newName = prompt('Enter new folder name:', folder.name)
    if (newName) {
      (async () => {
        try {
          setLoading(true)
          const response = await axios.put(
            `${process.env.REACT_APP_API_URL}/filesystem/renamedirectory`,
            {
              name: newName,
              nodeId: folder._id,
            }
          )
          folder.name = newName
          setFolders([...folders])
          setSelectedFileFolder(folder)
          socketRef.current.emit(ACTIONS.FILESYSTEM_CHANGE, {
            roomId,
          })
        } catch (error) {
          console.log('error in renaming directory', error)
        } finally {
          setLoading(false)
        }
      })()
    }
  }
  //takes file as input and prompts user for a new file name, renames the file,
  //updates the file system tree, and emits a Socket event for file system change
  const renameFile = (file) => {
    const newName = prompt('Enter new file name:', file.name)
    if (newName) {
      (async () => {
        try {
          setLoading(true)
          const response = await axios.put(
            `${process.env.REACT_APP_API_URL}/filesystem/renamefile`,
            {
              name: newName,
              nodeId: file._id,
            }
          )
          file.name = newName
          setFolders([...folders])
          socketRef.current.emit(ACTIONS.FILESYSTEM_CHANGE, {
            roomId,
          })
        } catch (error) {
          console.log('error in renaming file', error)
        } finally {
          setLoading(false)
          handleFilesystemChange()
        }
      })()
    }
  }
  //takes folder and boolean flag as input and toggles the open/close state of the folder and updates the file system tree
  //when flag is set folder is opened and if flag is not set prev state is switched 
  const toggleFolder = (folder, flag = false) => {
    if (flag && folder.type !== 'file') {
      let folderOpen = isFolderOpen
      folderOpen[folder._id] = true
      setIsFolderOpen(folderOpen)
      setFolders([...folders])
    } else if (!flag && folder.type !== 'file') {
      let folderOpen = isFolderOpen
      folderOpen[folder._id] = !isFolderOpen[folder._id]
      setIsFolderOpen(folderOpen)
      setFolders([...folders])
    }
  }
  //takes folder and parentfolder as input and deletes the folder,
  //updates the file system tree, and emits a Socket event for file system change
  async function deleteFolder(folderId, parentFolder) {
    
    try {
      const index = parentFolder.children.indexOf(folderId)
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/filesystem/deletedirectory`,
        {
          data: {
            nodeId: folderId,
            fileType: 'folder',
          },
        }
      )
      if (index !== -1) {
        parentFolder.children.splice(index, 1)
        setFolders([...folders])
      }
      socketRef.current.emit(ACTIONS.FILESYSTEM_CHANGE, {
        roomId,
      })
    } catch (error) {
      console.log('Error deleting folder:', error.message)
      throw new Error('Failed to delete folder.')
    }
  }
  //takes fileid and parentfolder as input and deletes the file, sets editor content empty,
  //updates the file system tree, and emits a Socket event for file system change
  async function deleteFile(fileId, parentFolder) {
    if (currentFile.current === fileId._id) {
      editorRef.current.setValue('')
      currentFile.current=null
    }
    try {
      setLoading(true)
      const index = parentFolder.children.indexOf(fileId)
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/filesystem/deletefile`,
        {
          data: {
            nodeId: fileId,
            fileType: 'file',
          },
        }
      )
      if (index !== -1) {
        parentFolder.children.splice(index, 1)
        setFolders([...folders])
      }
      socketRef.current.emit(ACTIONS.FILESYSTEM_CHANGE, {
        roomId,
        isdelete: true
      })
    } catch (error) {
      console.log('Error deleting file:', error.message)
      throw new Error('Failed to delete file.')
    } finally {
      setLoading(false)
      handleFilesystemChange()
    }
  }
  //takes an array as input and sorts the array alphabetically with directories first
  //this is the format of file tree view
  const sortAlphabetically = (array) => {
    if (!Array.isArray(array)) {
      return array
    }
    return array.sort((a, b) => {
      if (a.type === 'directory' && b.type !== 'directory') {
        return -1
      } else if (a.type !== 'directory' && b.type === 'directory') {
        return 1
      } else {
        return a.name.localeCompare(b.name)
      }
    })
  }
  //takes parentfolder as input and prompts user for a new file name, creates the file,
  //updates the file system tree, and emits a Socket event for file system change
  const createFile = (parentFolder) => {
    toggleFolder(parentFolder, true)
    const newFileName = prompt('Enter file name:')
    if (newFileName) {
      (async () => {
        try {
          setLoading(true)
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/filesystem/createfile`,
            {
              name: newFileName,
              parentId: parentFolder._id,
              roomId: roomId,
            }
          )
          const newFile = {
            _id: response.data.file._id,
            name: response.data.file.name,
            type: response.data.file.type,
          }
          parentFolder.children.push(newFile)
          parentFolder.children = sortAlphabetically(parentFolder.children)
          setFolders([...folders])
          socketRef.current.emit(ACTIONS.FILESYSTEM_CHANGE, {
            roomId,
          })
        } catch (error) {
          console.log(error)
        } finally {
          setLoading(false)
        }
      })()
    }
  }
  //takes parentfolder as input and prompts user for a new folder name, creates the folder,
  //updates the file system tree, and emits a Socket event for file system change
  const createFolder = (parentFolder) => {
    toggleFolder(parentFolder, true)
    const newFolderName = prompt('Enter folder name:')
    if (newFolderName) {
      (async () => {
        try {
          setLoading(true)
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/filesystem/createdirectory`,
            {
              name: newFolderName,
              parentId: parentFolder._id,
              roomId: roomId,
            }
          )
          const newFolder = {
            _id: response.data.directory._id,
            name: response.data.directory.name,
            type: response.data.directory.type,
            children: [],
          }
          parentFolder.children.push(newFolder)
          parentFolder.children = sortAlphabetically(parentFolder.children)
          setFolders([...folders])
          socketRef.current.emit(ACTIONS.FILESYSTEM_CHANGE, {
            roomId,
          })
        } catch (error) {
          console.log(error)
        } finally {
          setLoading(false)
        }
      })()
    }
  }
  //Searches a file in the file tree by taking id of file and nodes- array of files as input
  //Iterate through each node in the tree and searches recursively for children
  const findNodeById = (id, nodes) => {
    for (const node of nodes) {
      if (node._id === id) {
        return node
      }
      if (node.children && node.children.length > 0) {
        const foundNode = findNodeById(id, node.children)
        if (foundNode) {
          return foundNode
        }
      }
    }
    return null
  }
  //takes folder object, depth of folder in heirarchy and parentfolder as input,
  //outputs jsx for rendering heirarchical folder structure
  //renders a folder with its children recursively, handling different folder and file types, and toggling visibility
  //each folder enclosed with tooltip consisting its name
  const renderFolder = (folder, depth = 0, parentFolder = null) => {
    return (
      <div
        key={folder._id}
        className='flex flex-col mb-1 h-fit'
        style={{
          marginLeft: `${depth === 0 ? 0 : 10}px`,
          maxWidth: `${depth === 0 ? `${parentWidth}px` : `${parentWidth - depth * 10}px`
            }`,
        }}
      >
        <div
          id={folder._id}
          className={`flex items-center p-px  ${selectedFileFolder && selectedFileFolder._id === folder._id
              ? 'Selected-file-folder'
              : ''
            } rounded-md`}

        >
          <div className='grow flex relative '>
            {folder.type === 'root' && (
              <Tooltip
                title={folder.name}
                arrow={false}
                placement='right'
              >
                <div
                  data-testid = 'setSelectedFileFolder-folder'
                  onClick={() => {
                    toggleFolder(folder)
                    setSelectedFileFolder(folder)
                  }}
                  style={{
                    maxWidth: `${depth === 0 ? '300px' : `${300 - depth}px`}`,
                  }}
                  className='cursor-pointer mr-2 grow flex '
                >
                  {isFolderOpen[folder._id] ? (
                    <ArrowDropDownIcon />
                  ) : (
                    <ArrowRightIcon />
                  )}
                  {isFolderOpen[folder._id] ? (
                    <FolderIcon className='mr-2' style={{ fontSize: 20 }} />
                  ) : (
                    <FolderOpenIcon className='mr-2' style={{ fontSize: 20 }} />
                  )}

                  <div className='truncate' style={{ maxWidth: '200px' }}>
                    {folder.name}
                  </div>
                </div>
              </Tooltip>
            )}
            {folder.type === 'directory' && (
              <Tooltip
                title={folder.name}
                arrow={false}
                placement='right'
              >
                <div
                  data-testid="setSelectedFileFolder-directory"
                  onClick={() => {
                    toggleFolder(folder)
                    setSelectedFileFolder(folder)
                    setSelectedFileFolderParent(parentFolder)
                  }}
                  style={{
                    maxWidth: `${depth === 0 ? '300px' : `${300 - depth}px`}`,
                  }}
                  className='cursor-pointer mr-2 grow flex '
                >
                  {isFolderOpen[folder._id] ? (
                    <ArrowDropDownIcon />
                  ) : (
                    <ArrowRightIcon />
                  )}
                  {isFolderOpen[folder._id] ? (
                    <FolderIcon className='mr-2' style={{ fontSize: 20 }} />
                  ) : (
                    <FolderOpenIcon className='mr-2' style={{ fontSize: 20 }} />
                  )}
                  <div className='truncate' style={{ maxWidth: '200px' }}>
                    {folder.name}
                  </div>
                </div>
              </Tooltip>
            )}
            {folder.type === 'file' && (
              <Tooltip
                title={folder.name}
                arrow={false}
                placement='right'
              >
                <div
                  data-testid = 'setSelectedFileFolder-directory'
                  style={{
                    maxWidth: `${depth === 0 ? '328px' : `${328 - depth}px`}`,
                  }}
                  className='grow cursor-pointer mr-2 flex'
                  onClick={() => {
                    setSelectedFileFolder(folder)
                    setSelectedFileFolderParent(parentFolder)
                    handleFileClick(folder,parentFolder,true)
                  }}
                >
                  {renderFileIcon(folder)}
                  <div className='truncate' style={{ maxWidth: '200px' }}>
                    {folder.name}
                  </div>
                </div>
              </Tooltip>
            )}
          </div>
        </div>
        {isFolderOpen[folder._id] &&
          folder.children.map((child) =>
            renderFolder(child, depth + 1, folder)
          )}
      </div>
    )
  }
  //array for different file extension icons
  const fileIconMap = {
    mp3: audioIcon,
    c: cIcon,
    cs: csharpIcon,
    cpp: cppIcon,
    css: cssIcon,
    html: htmlIcon,
    jpg: imageIcon,
    jpeg: imageIcon,
    png: imageIcon,
    svg: imageIcon,
    js: jsIcon,
    json: jsonIcon,
    pdf: pdfIcon,
    py: pythonIcon,
    txt: textIcon,
    mp4: videoIcon,
  }
  //takes extension as input and retrieves the icon URL corresponding to the file extension
  //or returns a default icon if not found
  const getFileIcon = (extension) => {
    return fileIconMap[extension.toLowerCase()] || defaultIcon
  }
  //takes file as input and outputs JSX for rendering file icon
  //renders the icon for a given file based on its extension
  const renderFileIcon = (file) => {
    const extension = (file.name.split('.').pop() || '').toLowerCase()
    const iconUrl = getFileIcon(extension)
    return (
      <div className='file-icon' style={{ width: '20px', height: '20px' }}>
        <img
          src={iconUrl}
          alt={`${extension} icon`}
          style={{ width: '20px', height: '20px' }}
        />
      </div>
    )
  }
  //Handles file upload event, reads file contents asynchronously, and sends data to the server
  const handleUpload = async (event) => {
    const items = event.target.files;
    const entries = await Promise.all(
      Array.from(items).map(async (item) => {
        const path = item.webkitRelativePath || item.name
        const isDirectory = item.isDirectory || false
        let content = null
        if (!isDirectory) {
          content = await readFileAsync(item)
        }
        return { path, isDirectory, content }
      })
    )
    sendDataToServer(entries)
  }
  //takes file as input and outputs promise resolving to file content
  //reads the content of a file asynchronously and resolves with the content
  const readFileAsync = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        resolve(event.target.result)
      }
      reader.onerror = (error) => {
        reject(error)
      }
      reader.readAsText(file)
    })
  }
  //Updates the file tree on folder upload activity by making post request to backend and emits file_system_change to room
  const sendDataToServer = async (data) => {
    try {
      setLoading(true)
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/filesystem/uploaddirectory`,
        {
          parentId: selectedFileFolder._id,
          data: data,
          roomId: roomId,
        }
      )
      const newFolder = {
        _id: response.data.directory._id,
        name: response.data.directory.name,
        type: response.data.directory.type,
        children: response.data.directory.children,
      }
      toggleFolder(selectedFileFolder, true)
      selectedFileFolder.children.push(newFolder)
      selectedFileFolder.children = sortAlphabetically(
        selectedFileFolder.children
      )
      setFolders([...folders])
      socketRef.current.emit(ACTIONS.FILESYSTEM_CHANGE, {
        roomId,
      })
    } catch (error) {
      console.log('Error sending data to server:', error)
      toast.error(error.request.statusText, { duration: 2000 })
    } finally {
      setLoading(false)
    }
  }
  //function takes roomId as input and downloads whole content in a zip file
  const downloadZipFile = async (roomId) => {
    try {
      // Make a GET request to the backend endpoint
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/filesystem/download/${roomId}`, {
        responseType: 'blob' // Specify the response type as blob
      })
      // Trigger the download by creating a blob URL and clicking on a temporary link
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/zip' }))
      const a = document.createElement('a')
      a.href = url
      a.download = `room_${roomId}_files.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.log('Error downloading zip file:', error)
    }
  }
  //listens to beforeunload event i.e. when user closes or changes tab
  //handleUnload callback function saves the current file if available , hence prevents losing file changes
  useEffect(() => {
    const handleUnload = (event) => {
      if (currentFile.current !== null) {
        handleSaveFile(currentFile.current, false)
      }
    }

    window.addEventListener('beforeunload', handleUnload)

    return () => {
      window.removeEventListener('beforeunload', handleUnload)
    }
  }, [currentFile])
  return (
    <div className='flex flex-col justify-between h-full'>
      <div className='flex justify-between mx-1 relative h-fit grow'>
        <div className='flex flex-col grow '>
          <div
            className={`text-lg font-bold flex justify-between items-center my-3 
              }`}
          >
            <p>File Explorer</p>
            {selectedFileFolder.type === 'root' && (
              <div className='flex items-center relative'>
                <button
                  className=''
                  onClick={() => createFolder(selectedFileFolder)}
                  title='Add Folder'
                  data-testid='add-folder-button'
                >
                  <CreateNewFolderIcon />
                </button>
                <div className='absolute bottom-0 hidden hover:bg-gray-100 hover:rounded hover:p-2 hover:block hover:z-10 hover:border hover:border-gray-300'>
                  Add Folder
                </div>
                <button
                  className=''
                  onClick={() => createFile(selectedFileFolder)}
                  title='Add File'
                  data-testid='add-file-button'
                >
                  <AddIcon />
                </button>
                <div className='absolute bottom-0 hidden hover:bg-gray-100 hover:rounded hover:p-2 hover:block hover:z-10 hover:border hover:border-gray-300'>
                  Add File
                </div>
                <input
                  type='file'
                  id='fileInput'
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  data-testid='file-input'
                />
                <label htmlFor='fileInput'>
                  <UploadFileIcon className='text-white cursor-pointer' data-testid='upload-file-button'/>
                </label>
                <input
                  type='file'
                  id='folderInput'
                  directory=''
                  webkitdirectory=''
                  style={{ display: 'none' }}
                  onChange={handleUpload}
                />
                <label htmlFor='folderInput'>
                  <DriveFolderUploadIcon className='text-white cursor-pointer' />
                </label>
                <div className='absolute bottom-0 hidden hover:bg-gray-100 hover:rounded hover:p-2 hover:block hover:z-10 hover:border hover:border-gray-300'>
                  Upload Folder
                </div>
                <button
                  className='renameFolderIcon update-buttons '
                  onClick={() => renameFolder(selectedFileFolder)}
                  title='Rename Folder'
                  data-testid='rename-folder-button'
                >
                  <CreateIcon />
                </button>
                <div className='absolute bottom-0 hidden hover:bg-gray-100 hover:rounded hover:p-2 hover:block hover:z-10 hover:border hover:border-gray-300 hover:top-7'>
                  Rename Folder
                </div>
              </div>
            )}
            {selectedFileFolder.type === 'directory' && (
              <div className='flex items-center relative'>
                <button
                  className='addFolderIcon update-buttons '
                  onClick={() => createFolder(selectedFileFolder)}
                  title='Add Folder'
                  data-testid='add-folder-button-directory'
                >
                  <CreateNewFolderIcon />
                </button>
                <div className='absolute bottom-0 hidden hover:bg-gray-100 hover:rounded hover:p-2 hover:block hover:z-10 hover:border hover:border-gray-300 hover:top-7'>
                  Add Folder
                </div>
                <button
                  className='addFileIcon update-buttons '
                  onClick={() => createFile(selectedFileFolder)}
                  title='Add File'
                  data-testid='add-file-button-directory'
                >
                  <AddIcon />
                </button>
                <div className='absolute bottom-0 hidden hover:bg-gray-100 hover:rounded hover:p-2 hover:block hover:z-10 hover:border hover:border-gray-300 hover:top-7'>
                  Add File
                </div>
                <input
                  type='file'
                  id='fileInput'
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <label htmlFor='fileInput'>
                  <UploadFileIcon className='text-white' data-testid='upload-file-button-directory'/>
                </label>
                <input
                  type='file'
                  id='folderInput'
                  directory=''
                  webkitdirectory=''
                  style={{ display: 'none' }}
                  onChange={handleUpload}
                />
                <label htmlFor='folderInput'>
                  <DriveFolderUploadIcon className='text-white cursor-pointer' data-testid='upload-folder-button-directory'/>
                </label>
                <div className='absolute bottom-0 hidden hover:bg-gray-100 hover:rounded hover:p-2 hover:block hover:z-10 hover:border hover:border-gray-300'>
                  Upload Folder
                </div>
                <button
                  className='renameFolderIcon update-buttons '
                  onClick={() => renameFolder(selectedFileFolder)}
                  title='Rename Folder'
                  data-testid='rename-folder-button-directory'
                >
                  <CreateIcon />
                </button>
                <div className='absolute bottom-0 hidden hover:bg-gray-100 hover:rounded hover:p-2 hover:block hover:z-10 hover:border hover:border-gray-300 hover:top-7'>
                  Rename Folder
                </div>
                <button
                  className='deleteFolderIcon update-buttons '
                  onClick={() =>
                    deleteFolder(selectedFileFolder, selectedFileFolderParent)
                  }
                  title='Delete Folder'
                  data-testid='delete-folder-button-directory'
                >
                  <DeleteIcon />
                </button>
                <div className='absolute bottom-0 hidden hover:bg-gray-100 hover:rounded hover:p-2 hover:block hover:z-10 hover:border hover:border-gray-300 hover:top-7'>
                  Delete Folder
                </div>
              </div>
            )}
            {selectedFileFolder.type === 'file' && (
              <div className='flex items-center relative'>
                <button
                  className='renameFileIcon update-buttons '
                  onClick={() => renameFile(selectedFileFolder)}
                  title='Rename File'
                  data-testid='rename-file-button-file'
                >
                  <CreateIcon />
                </button>
                <div className='absolute bottom-0 hidden hover:bg-gray-100 hover:rounded hover:p-2 hover:block hover:z-10 hover:border hover:border-gray-300 hover:top-7'>
                  Add Folder
                </div>
                <button
                  className='renameFileIcon update-buttons '
                  onClick={() => setIsDownloadTrue(true)}
                  title='Download File'
                  data-testid='download-file-button-file'
                >
                  <DownloadIcon />
                </button>
                <div className='absolute bottom-0 hidden hover:bg-gray-100 hover:rounded hover:p-2 hover:block hover:z-10 hover:border hover:border-gray-300 hover:top-7'>
                  Download File
                </div>
                <button
                  className='deleteFileIcon update-buttons '
                  onClick={() =>
                    deleteFile(selectedFileFolder, selectedFileFolderParent)
                  }
                  title='Delete File'
                  data-testid='delete-file-button-file'
                >
                  <DeleteIcon />
                </button>
                <div className='absolute bottom-0 hidden hover:bg-gray-100 hover:rounded hover:p-2 hover:block hover:z-10 hover:border hover:border-gray-300 hover:top-7'>
                  Delete Folder
                </div>
              </div>
            )}
          </div>
          {loading === true && (
            <div className='flex justify-center items-center pb-2'>
              <CircularProgress color='inherit' size={30} />
            </div>
          )}
          <div
            className='flex justify-between grow'
            style={{ maxHeight: '380px', maxWidth: '300px' }}
          >
            <div
              className='grow relative overflow-y-auto'
              style={{ maxHeight: '380px', maxWidth: '300px' }}
              ref={parentRef}
            >
              {folders.map((folder) => renderFolder(folder))}
            </div>
          </div>
        </div>
        {isDownloadTrue && (
          <div className='absolute top-10 bg-slate-700 p-4 rounded-lg shadow-md shadow-slate-400'>
            <div className='flex justify-end mb-4'>
              <CloseOutlinedIcon
                className='absolute top-2 right-2 cursor-pointer text-gray-300'
                onClick={() => {
                  setIsDownloadTrue(false)
                }}
                data-testid="set-download-false-button"
              />
            </div>
            <input
              type='text'
              value={downloadFileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder='Enter file name'
              className='mb-3 px-2 py-1 w-full bg-slate-300 rounded border-2 opacity border-gray-400 focus:outline-none focus:border-blue-500'
              style={{
                color: '#1c1e29',
                '::placeholder': { color: '#1c1e29' },
              }}
              data-testid="file-name-input"
            />
            <select
              value={downloadFileExtension}
              onChange={(e) => setFileExtension(e.target.value)}
              className='mb-3 px-2 py-1 w-full bg-slate-300 rounded border-2 border-gray-400 focus:outline-none focus:border-blue-500'
              style={{ color: '#1c1e29' }}
              data-testid="file-extension-select"
            >
              <option value=''>Select type</option>
              <option value='txt'>Text</option>
              <option value='json'>JSON</option>
              <option value='py'>Python</option>
              <option value='html'>HTML</option>
              <option value='css'>CSS</option>
              <option value='java'>Java</option>
              <option value='cpp'>C++</option>
              <option value='c'>C</option>
              <option value='js'>Javascript</option>
            </select>
            <button
              className='w-full px-2 py-1 font-semibold bg-blue-600'
              onClick={() => {
                handleDownloadFile()
                setIsDownloadTrue(false)
              }}
              data-testid="download-file-button"
            >
              Download
            </button>
          </div>
        )}
      </div>
      <button style={{ display: 'none' }} data-testid="setDirectory"
        onClick={() => {
          setSelectedFileFolder({
                _id: '0',
                name: 'Dir',
                type: 'directory',
                children: []
              });
          setFolders([
            {
              _id: '0',
              name: 'Dir',
              type: 'directory',
              children: []
            }
          ])
          return 0;
          }} >
        Hidden Button
      </button>

      <input type="hidden" data-testid="setFile" onClick={() => {
        setSelectedFileFolder({
            _id: '0',
            name: 'File',
            type: 'file',
            children: []
          });
        setFolders([
          {
            _id: '0',
            name: 'File',
            type: 'file',
            children: []
          }
        ])

        return 0;
      }} />
      <input type="hidden" data-testid="setParent" onClick={() => {
        setSelectedFileFolderParent({
            _id: '0',
            name: 'File',
            type: 'file',
            children: [selectedFileFolder]
          });
        return 0;
      }} />
    </div>
  )
}

export default FileView
