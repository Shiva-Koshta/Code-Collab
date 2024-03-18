import React, { useState } from 'react'
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { IconButton } from '@mui/material';

const FileView = ({fileContent,setFileContent, editorRef}) => {

  const [contentChanged, setContentChanged] = useState(false);

  const [isDownloadTrue, setIsDownloadTrue] = useState(false);
  const [downloadFileExtension, setFileExtension] = useState("");
  const [downloadFileName, setFileName] = useState("");
  
  
  const handleFileChange = (event) => {
    console.log("reached");
    // console.log(event)
    const file = event.target.files[0];
    const reader = new FileReader();
    setContentChanged(!contentChanged);
    // console.log(contentChanged);
    
      localStorage.setItem("contentChanged", contentChanged)
      reader.onload = (e) => {
        const content = e.target.result;
        setFileContent(content);
        localStorage.setItem("fileContent", JSON.stringify(fileContent))
      // console.log(content);
      // fileRef.current = content;
    };
    if (file) { reader.readAsText(file); }
    // console.log("fileref here:",fileContent);
    event.target.value = null;
  };

  const handleDownloadFile = () => {
    const myContent = editorRef.current.getValue();
    const element = document.createElement("a");
    const file = new Blob([myContent], { type: `text/plain` });
    element.href = URL.createObjectURL(file);
    element.download = `${downloadFileName}.${downloadFileExtension}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div>
      <div className='flex justify-between mx-3 relative'>
        <div className='flex flex-col justify-center'>
          <p className='text-lg font-bold'>Project</p>
        </div>
        <div className='flex '>
          <div className='flex flex-col justify-center'>
            <input
              type="file"
              id="fileInput"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <label htmlFor="fileInput">
              <IconButton component="span">
                <UploadFileIcon 
                  className='text-white'
                />
              </IconButton>
            </label>
          </div>

          <div className='flex flex-col justify-center'>
            <FileDownloadOutlinedIcon 
              className='cursor-pointer'
              onClick={() => {
                if(!isDownloadTrue) setIsDownloadTrue(true)
                else {
                  handleDownloadFile()
                  setIsDownloadTrue(false)
                }
              }}
            />
          </div>
        </div>
        {isDownloadTrue && (
          <div className="absolute top-10">
            <input type="text" value={downloadFileName} onChange={(e) => setFileName(e.target.value)} placeholder="Enter file name" className="mb-3" style={{ color: "#1c1e29" }} />
            <select value={downloadFileExtension} onChange={(e) => setFileExtension(e.target.value)} className="mb-3" style={{ color: "#1c1e29" }}>
              <option value="txt">Select type</option>
              <option value="txt">Text</option>
              <option value="json">JSON</option>
              <option value="py">Python</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
              {/* <option value="png">PNG</option>
              <option value="jpeg">JPEG</option>
              <option value="pdf">PDF</option>
              <option value="zip">zip</option> */}
              <option value="js">Javascript</option>
            </select>
          </div>
        )}
      </div>
    </div>
  )
}

export default FileView