import React, { useState } from 'react'
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { IconButton } from '@mui/material';

const FileView = ({fileContent,setFileContent, setIsDownloadTrue}) => {

  const [contentChanged, setContentChanged] = useState(false);
  
  
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

  return (
    <div>
       <div className='flex justify-between mx-3'>
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
              onClick={() => setIsDownloadTrue(True)}
            />
          </div>
        </div>
       </div>
    </div>
  )
}

export default FileView