/* eslint-disable no-undef */
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { IconButton, sliderClasses } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import AddIcon from "@mui/icons-material/Add";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import TextFileIcon from "@mui/icons-material/Description";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { FolderCopy } from "@mui/icons-material";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import axios from "axios";
// import ImageIcon from '@mui/icons-material/Image' // Image File
// import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf' // PDF File
// import AudiotrackIcon from '@mui/icons-material/Audiotrack' // Audio File
// import MovieIcon from '@mui/icons-material/Movie' // Video File
import audioIcon from "../icons/audio.png";
import cIcon from "../icons/c.png";
import cppIcon from "../icons/cpp.png";
import csharpIcon from "../icons/cs.png";
import cssIcon from "../icons/css.png";
import defaultIcon from "../icons/default.png";
import htmlIcon from "../icons/html.png";
import imageIcon from "../icons/image.png";
import jsIcon from "../icons/js.png";
import jsonIcon from "../icons/json.png";
import pdfIcon from "../icons/pdf.png";
import pythonIcon from "../icons/python.png";
import textIcon from "../icons/text.png";
import videoIcon from "../icons/video.png";
import { toast } from "react-hot-toast";

const FileView = ({
  fileContent,
  setFileContent,
  editorRef,
  contentChanged,
  setContentChanged,
}) => {
  const { roomId } = useParams();
  const [isDownloadTrue, setIsDownloadTrue] = useState(false);
  const [downloadFileExtension, setFileExtension] = useState("");
  const [downloadFileName, setFileName] = useState("");
  const parentRef = useRef(null);
  const [parentWidth, setParentWidth] = useState(0);
  const [folders, setFolders] = useState([
    {
      _id: "0",
      name: "Root",
      type: "root",
      children: [],
    },
  ]);
  const [selectedFileFolder, setSelectedFileFolder] = useState({
    _id: "0",
    name: "Root",
    type: "root",
    children: [],
  });
  const [selectedFileFolderParent, setSelectedFileFolderParent] = useState({});
  const [isFolderOpen, setIsFolderOpen] = useState({ 0: false });
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    const handleCtrlS = (event) => {
      if (event.ctrlKey && event.key === "s") {
        handleSaveFile(selectedFileFolder._id);
        event.preventDefault();
      }
    };
    document.addEventListener("keydown", handleCtrlS);
    return () => {
      document.removeEventListener("keydown", handleCtrlS);
    };
  }, [selectedFileFolder._id]);
  const handleSaveFile = (fileId) => {
    toast.success(`File saved! file id:-  ${fileId}`);
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/filesystem/generatetree`,
          {
            roomId: roomId,
          }
        );
        const root = response.data.tree;
        setSelectedFileFolder(root);
        setFolders([root]);
        return root._id;
      } catch (error) {
        console.log(error);
      }
    })();

    function handleResize() {
      setIsSmallScreen(window.innerWidth < 1290); // Adjust the threshold as needed
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    if (parentRef.current) {
      const width = parentRef.current.getBoundingClientRect().width;
      setParentWidth(width);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleFileChange = (event, parentFolder = selectedFileFolder) => {
    console.log("reached");
    console.log(event);
    const file = event.target.files[0];
    const reader = new FileReader();
    setContentChanged(!contentChanged);
    console.log(contentChanged);

    window.localStorage.setItem("contentChanged", contentChanged);
    reader.onload = (e) => {
      const content = e.target.result;

      (async () => {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/filesystem/uploadfile`,
            {
              name: file.name,
              parentId: parentFolder._id,
              roomId: roomId,
              content: content,
            }
          );
          const newFile = {
            _id: response.data.file._id,
            name: response.data.file.name,
            type: response.data.file.type,
          };
          parentFolder.children.push(newFile);
          console.log("pushed");
          setFolders([...folders]);
        } catch (error) {
          console.log(error);
        }
      })();
    };
    if (file) {
      reader.readAsText(file);
    }
    event.target.value = null;
  };

  const handleFileClick = async (fileId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/filesystem/fetchfile`,
        {
          nodeId: fileId,
        }
      );
      setFileContent(response.data.file.content);
    } catch (error) {
      console.error(error);
    }
  };
  const handleDownloadFile = () => {
    const myContent = editorRef.current.getValue();
    const element = document.createElement("a");
    const file = new Blob([myContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${downloadFileName}.${downloadFileExtension}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const renameFolder = (folder) => {
    const newName = prompt("Enter new folder name:", folder.name);
    if (newName) {
      (async () => {
        try {
          const response = await axios.put(
            `${process.env.REACT_APP_API_URL}/filesystem/renamedirectory`,
            {
              name: newName,
              nodeId: folder._id,
            }
          );
          console.log("renamed directory");
          folder.name = newName;
          setFolders([...folders]);
          setSelectedFileFolder(folder);
        } catch (error) {
          console.log("error in renaming directory", error);
        }
      })();
    }
  };

  const renameFile = (file) => {
    const newName = prompt("Enter new file name:", file.name);
    if (newName) {
      (async () => {
        try {
          const response = await axios.put(
            `${process.env.REACT_APP_API_URL}/filesystem/renamefile`,
            {
              name: newName,
              nodeId: file._id,
            }
          );
          console.log("renamed file");
          file.name = newName;
          setFolders([...folders]);
          setSelectedFileFolder(file);
        } catch (error) {
          console.log("error in renaming file", error);
        }
      })();
    }
  };

  return (
    <div
      ref={parentRef}
      style={{
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          backgroundColor: "#f5f6fa",
          display: "flex",
          alignItems: "center",
          padding: "10px",
          borderBottom: "1px solid #dfe4ea",
          position: "relative",
          zIndex: "100",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flex: "0 0 auto",
            marginRight: "5px",
          }}
        >
          <FolderOpenIcon
            style={{ color: "#57606f", fontSize: "20px", marginRight: "5px" }}
          />
          <ArrowRightIcon style={{ color: "#57606f", fontSize: "20px" }} />
        </div>
        <div style={{ flex: "0 0 auto", width: "100%" }}>
          <div
            style={{
              fontSize: "15px",
              fontWeight: "500",
              color: "#57606f",
              marginRight: "5px",
            }}
          >
            {selectedFileFolder.name}
          </div>
        </div>
        <div style={{ flex: "0 0 auto" }}>
          <IconButton
            onClick={() => {
              setIsDownloadTrue(true);
              setFileExtension("txt");
              setFileName("test");
              handleDownloadFile();
            }}
            style={{ padding: "5px" }}
          >
            <DownloadIcon style={{ fontSize: "20px", color: "#57606f" }} />
          </IconButton>
          <IconButton
            onClick={() => {
              const folderName = prompt("Enter the folder name:", "New Folder");
              if (folderName) {
                (async () => {
                  try {
                    const response = await axios.post(
                      `${process.env.REACT_APP_API_URL}/filesystem/createfolder`,
                      {
                        name: folderName,
                        parentId: selectedFileFolder._id,
                        roomId: roomId,
                      }
                    );
                    console.log(response.data);
                    const newFolder = response.data.directory;
                    selectedFileFolder.children.push(newFolder);
                    setFolders([...folders]);
                    setSelectedFileFolder(selectedFileFolder);
                  } catch (error) {
                    console.log(error);
                  }
                })();
              }
            }}
            style={{ padding: "5px" }}
          >
            <CreateNewFolderIcon
              style={{ fontSize: "20px", color: "#57606f" }}
            />
          </IconButton>
          <IconButton
            onClick={() => {
              if (selectedFileFolderParent.name !== "Root") {
                const folderName = prompt(
                  "Enter the folder name:",
                  "New Folder"
                );
                if (folderName) {
                  (async () => {
                    try {
                      const response = await axios.post(
                        `${process.env.REACT_APP_API_URL}/filesystem/createfolder`,
                        {
                          name: folderName,
                          parentId: selectedFileFolderParent._id,
                          roomId: roomId,
                        }
                      );
                      console.log(response.data);
                      const newFolder = response.data.directory;
                      selectedFileFolderParent.children.push(newFolder);
                      setFolders([...folders]);
                      setSelectedFileFolder(selectedFileFolderParent);
                    } catch (error) {
                      console.log(error);
                    }
                  })();
                }
              }
            }}
            style={{ padding: "5px" }}
          >
            <CreateNewFolderIcon
              style={{ fontSize: "20px", color: "#57606f" }}
            />
          </IconButton>
        </div>
        <div
          style={{
            position: "absolute",
            top: "0",
            right: "0",
            height: "100%",
            backgroundColor: "#f5f6fa",
            display: "flex",
            alignItems: "center",
            padding: "10px",
            borderBottom: "1px solid #dfe4ea",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flex: "0 0 auto",
              marginRight: "5px",
            }}
          >
            <FolderOpenIcon
              style={{
                color: "#57606f",
                fontSize: "20px",
                marginRight: "5px",
              }}
            />
            <ArrowRightIcon style={{ color: "#57606f", fontSize: "20px" }} />
          </div>
          <div
            style={{
              fontSize: "15px",
              fontWeight: "500",
              color: "#57606f",
              marginRight: "5px",
            }}
          >
            {selectedFileFolderParent.name}
          </div>
        </div>
      </div>
      <div style={{ flex: "1", overflow: "auto" }}>
        <ul
          style={{
            margin: "0",
            padding: "0",
            listStyle: "none",
            paddingLeft: "20px",
          }}
        >
          {selectedFileFolder.children.map((child) => (
            <li
              key={child._id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
              }}
            >
              {child.type === "directory" ? (
                <FolderIcon
                  onClick={() => {
                    setIsFolderOpen({
                      ...isFolderOpen,
                      [child._id]: !isFolderOpen[child._id],
                    });
                    setSelectedFileFolderParent(selectedFileFolder);
                    setSelectedFileFolder(child);
                  }}
                  style={{ color: "#57606f", fontSize: "20px" }}
                />
              ) : (
                <TextFileIcon
                  onClick={() => handleFileClick(child._id)}
                  style={{ color: "#57606f", fontSize: "20px" }}
                />
              )}
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: "500",
                  color: "#57606f",
                  marginLeft: "5px",
                  cursor: "pointer",
                  width: "100%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {child.name}
              </div>
              {child.type === "directory" ? null : (
                <IconButton
                  onClick={() => {
                    if (
                      window.confirm(
                        `Are you sure you want to delete ${child.name}?`
                      )
                    ) {
                      (async () => {
                        try {
                          const response = await axios.delete(
                            `${process.env.REACT_APP_API_URL}/filesystem/deletefile`,
                            {
                              data: {
                                nodeId: child._id,
                              },
                            }
                          );
                          console.log(response.data);
                          const index =
                            selectedFileFolder.children.indexOf(child);
                          selectedFileFolder.children.splice(index, 1);
                          setFolders([...folders]);
                        } catch (error) {
                          console.log(error);
                        }
                      })();
                    }
                  }}
                  style={{ padding: "5px" }}
                >
                  <DeleteIcon style={{ fontSize: "20px", color: "#57606f" }} />
                </IconButton>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FolderView;
