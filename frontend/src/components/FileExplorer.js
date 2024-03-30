import React, { useState } from 'react';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AddIcon from '@mui/icons-material/Add';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import TextFileIcon from '@mui/icons-material/Description';
import { styled } from '@mui/system';

const initialFolder = {
  name: 'Root',
  type: 'folder',
  children: [],
  isOpen: true
};

const FileExplorer = () => {
  const [folders, setFolders] = useState([initialFolder]);

  const createFolder = (parentFolder) => {
    const newFolderName = prompt('Enter folder name:');
    if (newFolderName) {
      const newFolder = { name: newFolderName, type: 'folder', children: [], isOpen: true };
      parentFolder.children.push(newFolder);
      setFolders([...folders]);
    }
  };

  const createFile = (parentFolder) => {
    const newFileName = prompt('Enter file name:');
    if (newFileName) {
      const newFile = { name: newFileName, type: 'file' };
      parentFolder.children.push(newFile);
      setFolders([...folders]);
    }
  };

  const renameFolder = (folder) => {
    const newName = prompt('Enter new folder name:', folder.name);
    if (newName) {
      folder.name = newName;
      setFolders([...folders]);
    }
  };

  const renameFile = (file) => {
    const newName = prompt('Enter new file name:', file.name);
    if (newName) {
      file.name = newName;
      setFolders([...folders]);
    }
  };

  const toggleFolder = (folder) => {
    folder.isOpen = !folder.isOpen;
    setFolders([...folders]);
  };

  const deleteFolder = (folder, parentFolder) => {
    if (folder !== initialFolder) { // Check if folder is not the root folder
      const index = parentFolder.children.indexOf(folder);
      if (index !== -1) {
        parentFolder.children.splice(index, 1);
        setFolders([...folders]);
      }
    } else {
      alert("Cannot delete root folder.");
    }
  };

  const deleteFile = (file, parentFolder) => {
    const index = parentFolder.children.indexOf(file);
    if (index !== -1) {
      parentFolder.children.splice(index, 1);
      setFolders([...folders]);
    }
  };

  const renderFolder = (folder, depth = 0, parentFolder = null) => {
    const FolderIconComponent = folder.isOpen ? FolderOpenIcon : FolderIcon;

    return (
      <div key={folder.name} style={{ marginLeft: `${depth * 20}px`, display: 'flex', flexDirection: 'column', marginBottom: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {folder.type === 'folder' && (
            <div onClick={() => toggleFolder(folder)} style={{ cursor: 'pointer', marginRight: '8px' }}>
              <FolderIconComponent style={{ marginRight: '8px' }} />
            </div>
          )}
          <div style={{ flexGrow: 1 }}>
            {folder.type === 'folder' && (
              <span onClick={() => toggleFolder(folder)} style={{ cursor: 'pointer', marginRight: '8px' }}>
                {folder.isOpen ? '▼' : '▶'} {folder.name}
              </span>
            )}
            {folder.type === 'file' && (
              <span>
                <TextFileIcon style={{ marginRight: '8px' }} />
                {folder.name}
              </span>
            )}
          </div>
          {folder.type === 'folder' && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button onClick={() => createFolder(folder)} title="Add Folder"><CreateNewFolderIcon /></button>
              <button onClick={() => createFile(folder)} title="Add File"><AddIcon /></button>
              <button onClick={() => renameFolder(folder)} title="Rename Folder"><CreateIcon /></button>
              <button onClick={() => deleteFolder(folder, parentFolder)} title="Delete Folder"><DeleteIcon /></button>
            </div>
          )}
          {folder.type === 'file' && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button onClick={() => renameFile(folder)} title="Rename File"><CreateIcon /></button>
              <button onClick={() => deleteFile(folder, parentFolder)} title="Delete File"><DeleteIcon /></button>
            </div>
          )}
        </div>
        {folder.isOpen && folder.children.map(child => renderFolder(child, depth + 1, folder))}
      </div>
    );
  };

  return (
    <div style={{ height: '800px', overflowY: 'auto' }}>
      <h3>File Explorer</h3>
      {folders.map(folder => renderFolder(folder))}
    </div>
  );
};

export default FileExplorer;
