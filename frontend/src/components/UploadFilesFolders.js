import React, { useState } from 'react';
const FileTree = ({ files }) => (
    <ul>
        {files.map((file, index) => (
            <li key={index}>
                {file.isDirectory ? (
                    <>
                        <strong>{file.name}</strong>
                        <FileTree files={file.files} />
                    </>
                ) : (
                    file.name
                )}
            </li>
        ))}
    </ul>
);
const FolderUploader = () => {
    const [files, setFiles] = useState([]);
    const handleFolderChange = (event) => {
        const items = event.target.files;
        traverseFiles(items);
    };
    const traverseFiles = (items) => {
        const entries = [];

        const readEntries = (index) => {
            if (index >= items.length) {
                setFiles(entries);
                return;
            }
            const item = items[index];
            if (item.isDirectory) {
                traverseDirectory(item, (subEntries) => {
                    entries.push({ name: item.name, isDirectory: true, files: subEntries });
                    readEntries(index + 1);
                });
            } else {
                entries.push({ name: item.name, isDirectory: false });
                readEntries(index + 1);
            }
        };
        readEntries(0);
    };
    const traverseDirectory = (directory, callback) => {
        const reader = directory.createReader();
        const entries = [];
        const readNextBatch = () => {
            reader.readEntries((batch) => {
                if (batch.length === 0) {
                    callback(entries);
                } else {
                    traverseFiles(batch);
                    entries.push(...batch);
                    readNextBatch();
                }
            });
        };
        readNextBatch();
    };
    return (
        <div>
            <input type="file" directory="" webkitdirectory="" onChange={handleFolderChange} />
            <FileTree files={files} />
        </div>
    );
};
export default FolderUploader;