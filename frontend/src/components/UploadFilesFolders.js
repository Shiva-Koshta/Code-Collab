import React, { useState } from 'react';

const FileTreeNode = ({ node }) => (
  <li>
    {node.isDirectory ? (
      <FolderNode folder={node} />
    ) : (
      <FileNode file={node} />
    )}
  </li>
);

const FolderNode = ({ folder }) => (
  <details>
    <summary>{folder.name}</summary>
    <ul>
      {folder.children.map((child, index) => (
        <FileTreeNode key={index} node={child} />
      ))}
    </ul>
  </details>
);

const FileNode = ({ file }) => <li>{file.name}</li>;

const UploadFilesFolders = () => {
  const [fileTree, setFileTree] = useState({ name: 'Root', isDirectory: true, children: [] });

  const organizeFilesByPath = (files) => {
    const root = { name: 'Root', isDirectory: true, children: [] };

    files.forEach(file => {
      const parts = file.path.split('/');
      let currentFolder = root;

      parts.forEach((part, index) => {
        if (!currentFolder.children) {
          currentFolder.children = [];
        }

        const isFile = index === parts.length - 1;
        let node = currentFolder.children.find(child => child.name === part);

        if (!node) {
          node = { name: part, isDirectory: !isFile, children: [] };
          currentFolder.children.push(node);
        }

        if (isFile) {
          node.isFile = true;
        }

        currentFolder = node;
      });
    });

    return root;
  };

  const handleUpload = (event) => {
    const items = event.target.files;
    const entries = Array.from(items).map((item) => ({
      name: item.webkitRelativePath || item.name,
      isDirectory: item.isDirectory || false,
      path: item.webkitRelativePath || item.name
    }));
    const newFileTree = organizeFilesByPath(entries);
    setFileTree(newFileTree);
  };

  return (
    <div>
      <input
        type="file"
        directory=""
        webkitdirectory=""
        onChange={handleUpload}
      />
      <ul>
        <FileTreeNode node={fileTree} />
      </ul>
    </div>
  );
};

export default UploadFilesFolders;
