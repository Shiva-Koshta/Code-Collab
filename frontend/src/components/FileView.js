/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import { IconButton, sliderClasses } from '@mui/material'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import FolderIcon from '@mui/icons-material/Folder'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import AddIcon from '@mui/icons-material/Add'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import CreateIcon from '@mui/icons-material/Create'
import DeleteIcon from '@mui/icons-material/Delete'
import TextFileIcon from '@mui/icons-material/Description'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import { FolderCopy } from '@mui/icons-material'
import '../App.css'
import axios from 'axios'

const FileView = ({ fileContent, setFileContent, editorRef, contentChanged, setContentChanged }) => {
  const { roomId } = useParams()
  const [isDownloadTrue, setIsDownloadTrue] = useState(false)
  const [downloadFileExtension, setFileExtension] = useState('')
  const [downloadFileName, setFileName] = useState('')
  const [folders, setFolders] = useState([{
    _id: '0',
    name: 'Root',
    type: 'root',
    children: [],
  }])
  const [selectedFileFolder, setSelectedFileFolder] = useState({
    _id: '0',
    name: 'Root',
    type: 'root',
    children: [],
  });
  const [selectedFileFolderParent, setSelectedFileFolderParent] = useState({});
  const [latestId, setLatestId] = useState(0);
  const [isFolderOpen, setIsFolderOpen] = useState({'0' : false})
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {    
    (async () => {
      try{
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/filesystem/generatetree`, {
          roomId: roomId
        });
        const root = response.data.tree;
        setSelectedFileFolder(root);
        setFolders([root]);
        return root._id;
      } catch (error) {
        console.log(error)
      }
    })();
  }, [])

  const handleFileChange = (event) => {
    console.log('reached')
    // console.log(event)
    const file = event.target.files[0]
    const reader = new FileReader()
    setContentChanged(!contentChanged)
    // console.log(contentChanged)

    window.localStorage.setItem('contentChanged', contentChanged)
    reader.onload = (e) => {
      const content = e.target.result
      setFileContent(content)
      window.localStorage.setItem('fileContent', JSON.stringify(fileContent))
      // console.log(content)
      // fileRef.current = content
    }
    if (file) {
      reader.readAsText(file)
    }
    // console.log('fileref here:',fileContent)
    event.target.value = null
  }

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

  const renameFolder = (folder) => {
    const newName = prompt('Enter new folder name:', folder.name)
    if (newName) {
      (async () => {
        try {
          const response = await axios.put(`${process.env.REACT_APP_API_URL}/filesystem/renamedirectory`, {
            name: newName,
            nodeId: folder._id
          });
          console.log("renamed directory")
          folder.name = newName
          setFolders([...folders])
          setSelectedFileFolder(folder)
        } catch(error) {
          console.log("error in renaming directory",error)
        }
      })();
    }
  }

  const renameFile = (file) => {
    const newName = prompt('Enter new file name:', file.name)
    if (newName) {
      (async () => {
        try {
          const response = await axios.put(`${process.env.REACT_APP_API_URL}/filesystem/renamefile`, {
            name: newName,
            nodeId: file._id
          });
          console.log("renamed file")
          file.name = newName
          setFolders([...folders])
        } catch(error) {
          console.log("error in renaming file",error)
        }
      })();
    }
  }

  const toggleFolder = (folder, flag = false) => {
    if(flag && folder.type !== 'file') {
      let folderOpen = isFolderOpen
      folderOpen[folder._id] = true
      setIsFolderOpen(folderOpen)
      setFolders([...folders])
    } else if(!flag && folder.type !== 'file') {
      let folderOpen = isFolderOpen
      folderOpen[folder._id] = !isFolderOpen[folder._id]
      setIsFolderOpen(folderOpen)
      setFolders([...folders])
    }
  }

  async function deleteFolder(folderId, parentFolder) {
    try {
        const index = parentFolder.children.indexOf(folderId)
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/filesystem/deletedirectory`, {
          data: {
            nodeId: folderId,
            fileType: 'folder'
          }
        });
        if (index !== -1) {
          parentFolder.children.splice(index, 1)
          setFolders([...folders])
        }
    } catch (error) {
      console.error('Error deleting folder:', error.message);
      throw new Error('Failed to delete folder.');
    }
  }

  async function deleteFile(fileId, parentFolder) {
    try {
        const index = parentFolder.children.indexOf(fileId)
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/filesystem/deletefile`, {
            data: {
              nodeId: fileId,
              fileType: 'file'
            }
        });
        if (index !== -1) {
          parentFolder.children.splice(index, 1)
          setFolders([...folders])
        }
    } catch (error) {
        console.error('Error deleting file:', error.message);
        throw new Error('Failed to delete file.');
    }
  }

  const createFile = (parentFolder) => {
    toggleFolder(parentFolder, true)
    const newFileName = prompt('Enter file name:')
    if (newFileName) {
      (async () => {
        try {
          const response = await axios.post(`${process.env.REACT_APP_API_URL}/filesystem/createfile`, {
            name: newFileName,
            parentId: parentFolder._id,
            roomId: roomId,
          });
          const newFile = { _id:response.data.file._id, name: response.data.file.name, type: response.data.file.type }
          parentFolder.children.push(newFile)
          console.log("pushed")
          setFolders([...folders])
          
        } catch (error) {
          console.log(error);
        }
      })();

    }
  }

  const generateId = () => {
    const currId = latestId
    setLatestId(latestId + 1)
    return currId + 1
  };

  const createFolder = (parentFolder) => {
    toggleFolder(parentFolder, true)
    const newFolderName = prompt('Enter folder name:')
    if (newFolderName) {
      (async () => {
        try {
          const response = await axios.post(`${process.env.REACT_APP_API_URL}/filesystem/createdirectory`, {
            name: newFolderName,
            parentId: parentFolder._id,
            roomId: roomId,
          });
          const newFolder = { _id: response.data.directory._id, name: response.data.directory.name, type: response.data.directory.type, children: []}
          parentFolder.children.push(newFolder);
          setFolders([...folders]);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }

  const findNodeById = (id, nodes) => {
    // Iterate through each node in the tree
    for (const node of nodes) {
      // Check if the current node's ID matches the target ID
      if (node._id === id) {
        // Return the node if found
        return node;
      }
      // If the current node has children, recursively search them
      if (node.children && node.children.length > 0) {
        const foundNode = findNodeById(id, node.children);
        // If the node is found in the children, return it
        if (foundNode) {
          return foundNode;
        }
      }
    }
    // Return null if the node with the specified ID is not found
    return null;
  };

  const renderFolder = (folder, depth = 0, parentFolder = null) => {
    return (
      <div 
        key={folder._id} 
        className='flex flex-col mb-1 h-fit'
        style={{ marginLeft: `${depth === 0 ? 0 : 20}px` }}>
        <div className={`flex items-center p-px ${(selectedFileFolder && selectedFileFolder._id === folder._id) ? 'Selected-file-folder' : ''} rounded-md`}>
          <div className='grow flex relative'>
            {folder.type === 'root' && (
              <span onClick={() => {
                toggleFolder(folder)
                setSelectedFileFolder(folder)
              }} className="cursor-pointer mr-2 grow">
                {isFolderOpen[folder._id] ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
                {isFolderOpen[folder._id] ? <FolderIcon className='mr-2' style={{ fontSize: 20 }}/> : <FolderOpenIcon className='mr-2' style={{ fontSize: 20 }}/>}
                
                {folder.name}
              </span>
            )}
            {folder.type === 'directory' && (
              <span onClick={() => {
                toggleFolder(folder)
                setSelectedFileFolder(folder)
                setSelectedFileFolderParent(parentFolder)
              }} className="cursor-pointer mr-2 grow">
                {isFolderOpen[folder._id] ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
                {isFolderOpen[folder._id] ? <FolderIcon className='mr-2' style={{ fontSize: 20 }}/> : <FolderOpenIcon className='mr-2' style={{ fontSize: 20 }}/>}
                {folder.name}
              </span>
            )}
            {folder.type === 'file' && (
              <span 
                className='grow cursor-pointer mr-2'
                onClick={() => {
                  setSelectedFileFolder(folder)
                  setSelectedFileFolderParent(parentFolder)
                }}>
                <TextFileIcon className='mr-2 pb-0.5' style={{ fontSize: 20 }}/>
                {folder.name}
              </span>
            )}
          </div>
        </div>
        {isFolderOpen[folder._id] && folder.children.map(child => renderFolder(child, depth + 1, folder))}
      </div>
    )
  }

  return (
    <div className='flex flex-col justify-between h-full'>
      <div className='flex justify-between mx-1 relative h-fit grow'>
        <div className='flex flex-col grow'>
          <div className='text-lg font-bold flex justify-between my-3'>
            <p>File Explorer</p>
            {selectedFileFolder.type === 'root' && (
              <div className='flex items-center'>
                <button onClick={() => createFolder(selectedFileFolder)} title="Add Folder"><CreateNewFolderIcon /></button>
                <button onClick={() => createFile(selectedFileFolder)} title="Add File"><AddIcon /></button>
                <button onClick={() => renameFolder(selectedFileFolder)} title="Rename Folder"><CreateIcon /></button>
              </div>
            )}
            {selectedFileFolder.type === 'directory' && (
              <div className='flex items-center'>
                <button onClick={() => createFolder(selectedFileFolder)} title="Add Folder"><CreateNewFolderIcon /></button>
                <button onClick={() => createFile(selectedFileFolder)} title="Add File"><AddIcon /></button>
                <button onClick={() => renameFolder(selectedFileFolder)} title="Rename Folder"><CreateIcon /></button>
                <button onClick={() => deleteFolder(selectedFileFolder, selectedFileFolderParent)} title="Delete Folder"><DeleteIcon /></button>
              </div>
            )}
            {selectedFileFolder.type === 'file' && (
              <div className='flex items-center'>
                <button onClick={() => renameFile(selectedFileFolder)} title="Rename File"><CreateIcon /></button>
                <button onClick={() => deleteFile(selectedFileFolder, selectedFileFolderParent)} title="Delete File"><DeleteIcon /></button>
              </div>
            )}
          </div>
          <div className='flex justify-between grow'>
            <div className='grow relative'>
              {folders.map(folder => renderFolder(folder))}
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
                '::placeholder': { color: '#1c1e29' }
              }}
            />
            <select
              value={downloadFileExtension}
              onChange={(e) => setFileExtension(e.target.value)}
              className='mb-3 px-2 py-1 w-full bg-slate-300 rounded border-2 border-gray-400 focus:outline-none focus:border-blue-500'
              style={{ color: '#1c1e29' }}
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
            >
              Download
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FileView
