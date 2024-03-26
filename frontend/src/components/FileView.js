import React, { useState } from 'react'

const FileView = () => {
  const [fileTree, setFileTree] = useState([
    {
      name: 'home',
      type: 'directory',
      children: [
        {
          name: 'user',
          type: 'directory',
          children: [
            { name: 'file1.txt', type: 'file' },
            { name: 'file2.txt', type: 'file' },
          ],
        },
        { name: 'file3.txt', type: 'file' },
        { name: 'file4.txt', type: 'file' },
      ],
    },
  ])

  const toggleDirectory = (directory) => {
    setFileTree(
      fileTree.map((file) =>
        file.name === directory.name
          ? { ...file, expanded: !file.expanded }
          : file
      )
    )
  }

  return (
    <div>
      <h3>FILE TREE VIEW HERE...</h3>
      <ul>
        {fileTree.map((file) =>
          file.type === 'directory' ? (
            <li key={file.name}>
              <button onClick={() => toggleDirectory(file)}>
                {file.expanded ? '-' : '+'} {file.name}
              </button>
              {file.expanded && (
                <ul>
                  {file.children.map((child) => (
                    <li key={child.name}>{child.name}</li>
                  ))}
                </ul>
              )}
            </li>
          ) : (
            <li key={file.name}>{file.name}</li>
          )
        )}
      </ul>
    </div>
  )
}

export default FileView
