import React, { useState } from 'react';
const FileTreeNode = ({ file }) => (
    <li>
        {file.isDirectory ? (
            <FolderNode folder={file} />
        ) : (
            <FileNode file={file} />
        )}
    </li>
);

const FolderNode = ({ folder }) => (
    <details>
        <summary>{folder.name}</summary>
        <ul>
            {folder.files.map((file, index) => (
                <FileTreeNode key={index} file={file} />
            ))}
        </ul>
    </details>
);

const FileNode = ({ file }) => <li>{file.path}</li>;

const FolderUploader = () => {
    const [files, setFiles] = useState([]);
    const handleUpload = (event) => {
        const items = event.target.files;
        const entries = Array.from(items).map((item) => ({
            name: item.webkitRelativePath || item.name,
            isDirectory: item.isDirectory || false,
            path: item.webkitRelativePath || item.name
        }));
        setFiles(entries);
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
                {files.map((file, index) => (
                    <FileTreeNode key={index} file={file} />
                ))}
            </ul>
        </div>
    );
};
export default FolderUploader;