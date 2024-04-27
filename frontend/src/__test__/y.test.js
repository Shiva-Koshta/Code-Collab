import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FileView, { renderFolder } from "../components/FileView";
// import   downloadZipFile  from "../components/FileView";
import userEvent from "@testing-library/user-event";
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import axios from "axios";
// Mock axios module
jest.mock("axios");
// Mock the useNavigate hook
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));
jest.spyOn(console, "log").mockImplementation(() => {});
// Mock editorRef
const editorRefMock = {
  current: {
    setOption: jest.fn(), // Mock the setOption function
    getValue: jest.fn(), // Mock the getValue function if needed
  },
};


describe('YourComponent', () => {
    it('should render Add Folder button for Directory and trigger createFolder function when clicked', () => {
      // Mock the createFolder function
      const mockCreateFolder = jest.fn();
      // Mock selectedFileFolder to be of type 'directory'
      const selectedFileFolder = {
        _id: '1',
        name: 'Directory',
        type: 'directory',
        children: []
      };
  
      // Render the component with mock functions and props
      const { getByTestId } = render(
        <FileView 
          selectedFileFolder={selectedFileFolder} 
          createFolder={mockCreateFolder} 
        />
      );
  
      // Find the Add Folder button
      const addFolderButton = getByTestId('add-folder-button-directory');
  
      // Simulate a click on the Add Folder button
      fireEvent.click(addFolderButton);
  
      // Expect the createFolder function to be called
      expect(mockCreateFolder).toHaveBeenCalled();
    });
  });

// test('clicking on the "Add Folder" button calls createFolder', () => {
//   // Mock the createFolder function
//   const createFolder = jest.fn();
//   const setSelectedFileFolder = jest.fn();
//   const selectedFileFolder = { name: "test", _id:"asdf", children: [], type: "directory" }; // Mock the selectedFileFolder object
//   // Render the component with the "Add Folder" button
//   const { getByTestId, getByText } = render(
//     <FileView
//       editorRef={editorRefMock}
//       createFolder={createFolder}
//     />
//   );
//   FileView.setSelectedFileFolder(selectedFileFolder);
  
//   expect(selectedFileFolder.type).toBe('directory');

//   expect(getByText("File Explorer")).toBeInTheDocument();
//   // Simulate a user click on the "Add Folder" button
//   fireEvent.click(getByTestId("add-folder-button-directory"));

//   // Check if createFolder was called with the correct argument

//   // expect(createFolder).toHaveBeenCalledWith(selectedFileFolder);
// });
// describe('handleFileClick', () => {
//     test('it handles file click and updates current file', async () => {
//         // Mock necessary functions
//         const handleSaveFileMock = jest.fn();
//         const axiosPostMock = jest.fn();

//         // Mock current file and editorRef
//         const currentFile = null;
//         const editorRefMock = { current: { setValue: jest.fn() } };

//         // Mock axios
//         jest.mock('axios', () => ({
//           post: axiosPostMock,
//         }));

//         // Mock axios post response
//         const fileId = 'file_id';
//         const fileContent = 'Mock file content';
//         axiosPostMock.mockResolvedValueOnce({ data: { file: { content: fileContent } } });

//         // Render the component
//         const { container } = render(
//           <FileView
//             currentFile={currentFile}
//             editorRef={editorRefMock}
//             handleSaveFile={handleSaveFileMock}
//           />
//         );

//         // Find the file element and simulate a click
//         const fileElement = container.querySelector('your-selector-for-file-element');
//         fireEvent.click(fileElement);

//         // Check if axios post request was made with correct parameters
//         expect(axiosPostMock).toHaveBeenCalledWith(`${process.env.REACT_APP_API_URL}/filesystem/fetchfile`, {
//           nodeId: fileId
//         });

//         // Check if currentFile is updated
//         expect(FileView.getCurrentFile()).toBe(fileId);

//         // Check if handleSaveFile was not called (because currentFile is null)
//         expect(handleSaveFileMock).not.toHaveBeenCalled();

//         // Check if editorRef's setValue function was called with correct content
//         expect(editorRefMock.current.setValue).toHaveBeenCalledWith(fileContent);
//       });

//     test('it handles file click when currentFile is not null', async () => {
//       // Mock current file and editorRef
//       const currentFile = 'previous_file_id';
//       const editorRefMock = { current: { setValue: jest.fn() } };

//       // Mock axios post response
//       const fileId = 'file_id';
//       const fileContent = 'Mock file content';
//       const mockAxiosPost = jest.spyOn(axios, 'post').mockResolvedValueOnce({ data: { file: { content: fileContent } } });

//       // Mock handleSaveFile function
//       const handleSaveFileMock = jest.fn();

//       // Render the component
//       await act(async () => {
//         FileView.handleFileClick(fileId, currentFile, editorRefMock, handleSaveFileMock);
//       });

//       // Check if handleSaveFile was called with correct parameters
//       expect(handleSaveFileMock).toHaveBeenCalledWith(currentFile, false);

//       // Check if axios post request was made with correct parameters
//       expect(mockAxiosPost).toHaveBeenCalledWith(`${process.env.REACT_APP_API_URL}/filesystem/fetchfile`, {
//         nodeId: fileId
//       });

//       // Check if currentFile is updated
//       expect(FileView.getCurrentFile()).toBe(fileId);

//       // Check if editorRef's setValue function was called with correct content
//       expect(editorRefMock.current.setValue).toHaveBeenCalledWith(fileContent);
//     });

//     test('it handles error during file click', async () => {
//       // Mock current file and editorRef
//       const currentFile = null;
//       const editorRefMock = { current: { setValue: jest.fn() } };

//       // Mock axios post error
//       const mockAxiosPost = jest.spyOn(axios, 'post').mockRejectedValueOnce(new Error('Mock API error'));

//       // Mock console.error
//       const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

//       // Render the component
//       await act(async () => {
//         FileView.handleFileClick('file_id', currentFile, editorRefMock);
//       });

//       // Check if axios post request was made with correct parameters
//       expect(mockAxiosPost).toHaveBeenCalledWith(`${process.env.REACT_APP_API_URL}/filesystem/fetchfile`, {
//         nodeId: 'file_id'
//       });

//       // Check if console.error was called with the error
//       expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));

//       // Ensure that currentFile and editorRef are not updated
//       expect(FileView.getCurrentFile()).toBe(currentFile);
//       expect(editorRefMock.current.setValue).not.toHaveBeenCalled();

//       // Restore console.error
//       consoleErrorSpy.mockRestore();
//     });
//   });

// describe('FileView component', () => {
//     test('it triggers file download upon successful API response', async () => {
//       const roomId = '123';
//       const mockResponseData = new Blob(['mock zip file content'], { type: 'application/zip' });
//       const mockAxiosGet = jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: mockResponseData });

//       await act(async () => {
//         render(<FileView editorRef={editorRefMock} />);
//       });

//       // Simulate download
//       await act(async () => {
//         await FileView.downloadZipFile(roomId);
//       });

//       // Check if axios GET request is made with the correct URL and options
//       expect(mockAxiosGet).toHaveBeenCalledWith(`${process.env.REACT_APP_API_URL}/filesystem/download/${roomId}`, {
//         responseType: 'blob'
//       });

//       // Check if temporary link is created with correct attributes
//       const a = document.querySelector('a');
//       expect(a).not.toBeNull();
//       expect(a.href).toContain(`room_${roomId}_files.zip`);
//       expect(a.download).toBe(`room_${roomId}_files.zip`);

//       // Clean up
//       a.remove();
//       mockAxiosGet.mockRestore();
//     });

//     test('it logs an error upon failed API response', async () => {
//       const roomId = '123';
//       const mockAxiosGet = jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error('Mock API error'));
//       const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

//       await act(async () => {
//         render(<FileView />);
//       });

//       // Simulate download
//       await act(async () => {
//         await FileView.downloadZipFile(roomId);
//       });

//       // Check if axios GET request is made with the correct URL and options
//       expect(mockAxiosGet).toHaveBeenCalledWith(`${process.env.REACT_APP_API_URL}/filesystem/download/${roomId}`, {
//         responseType: 'blob'
//       });

//       // Check if error is logged
//       expect(consoleErrorSpy).toHaveBeenCalledWith('Error downloading zip file:', expect.any(Error));

//       // Clean up
//       mockAxiosGet.mockRestore();
//       consoleErrorSpy.mockRestore();
//     });
//   });

let container = null;
let addEventListenerSpy;
let removeEventListenerSpy;

beforeEach(() => {
  // Setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);

  // Spy on window.addEventListener and window.removeEventListener
  addEventListenerSpy = jest.spyOn(window, "addEventListener");
  removeEventListenerSpy = jest.spyOn(window, "removeEventListener");
});

afterEach(() => {
  // Cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;

  // Restore the original implementations
  addEventListenerSpy.mockRestore();
  removeEventListenerSpy.mockRestore();
});

// Mock functions if needed
// const mockHandleDownloadFile = jest.fn();
// Import your component that co/ponent';
// Mock window event listeners
// let addEventListenerSpy;
// let removeEventListenerSpy;

// beforeEach(() => {
//   addEventListenerSpy = jest
//     .spyOn(window, "addEventListener")
//     .mockImplementation(() => {});
//   removeEventListenerSpy = jest
//     .spyOn(window, "removeEventListener")
//     .mockImplementation(() => {});
// });

// afterEach(() => {
//   addEventListenerSpy.mockRestore();
//   removeEventListenerSpy.mockRestore();
// });

// describe("useEffect hook", () => {
//   it("calls handleSaveFile when currentFile changes", () => {
//     // Mock the handleSaveFile function
//     const handleSaveFile = jest.fn();

//     // Render the component
//     const { rerender } = render(
//       <FileView
//         editorRef={editorRefMock}
//         handleSaveFile={handleSaveFile}
//         currentFile={null}
//       />
//     );

//     // New currentFile
//     const newFile = "newFile";

//     // Update props to trigger useEffect
//     rerender(
//       <FileView
//         editorRef={editorRefMock}
//         handleSaveFile={handleSaveFile}
//         currentFile={newFile}
//       />
//     );
//     console.log(handleSaveFile.mock.calls);
//     // Check if handleSaveFile is called with the new file
//     expect(handleSaveFile).toHaveBeenCalledWith(newFile, false);
//   });
// });

// describe('DownloadDialog component', () => {
// //   it('renders correctly when isDownloadTrue is true', () => {
// //     // Mock data
// //     const mockFileName = 'testFile';
// //     const mockFileExtension = 'txt';

// //     // Render the component
// //     const { getByPlaceholderText, getByTestId,getByText } = render(
// //       <FileView
// //            editorRef={editorRefMock}
// //         isDownloadTrue={true}
// //         downloadFileName={mockFileName}
// //         downloadFileExtension={mockFileExtension}
// //         handleDownloadFile={mockHandleDownloadFile}
// //       />
// //     );

// //     // Check if the input field and download button are rendered
// //     // expect(getByPlaceholderText('Enter file name')).toBeInTheDocument();
// //     expect(getByText('File Explorer')).toBeInTheDocument();
// //     // expect(getByTestId('download-button')).toBeInTheDocument();
// //   });

//   test('clicking on the "Add Folder" button calls createFolder with the correct argument when selectedFileFolder.type is "root"', () => {
//         // Mock the createFolder function
//         const createFolder = jest.fn();
//         const selectedFileFolder = { type: 'root' }; // Mock the selectedFileFolder object

//         // Render the component with the "Add Folder" button
//         const { getByTestId, getByText } = render(
//           <FileView
//             editorRef={editorRefMock}
//             createFolder={createFolder}
//             selectedFileFolder={selectedFileFolder}
//           />
//         );
//         expect(getByText('File Explorer')).toBeInTheDocument();
//         // Simulate a user click on the "Add Folder" button
//         fireEvent.click(getByTestId('Add-folder-button'));

//         // Check if createFolder was called with the correct argument

//         // expect(createFolder).toHaveBeenCalledWith(selectedFileFolder);
//     });

// //   it('calls handleDownloadFile when download button is clicked', () => {
// //     // Mock data
// //     const mockFileName = 'testFile';
// //     const mockFileExtension = 'txt';

// //     // Render the component
// //     const { getByTestId } = render(
// //       <FileView
// //       editorRef={editorRefMock}
// //         isDownloadTrue={true}
// //         downloadFileName={mockFileName}
// //         downloadFileExtension={mockFileExtension}
// //         handleDownloadFile={mockHandleDownloadFile}
// //       />
// //     );

// //     // Simulate click on download button
// //     fireEvent.click(getByTestId('download-button'));

// //     // Check if handleDownloadFile is called
// //     expect(mockHandleDownloadFile).toHaveBeenCalled();
// //   });

//   // Add more test cases as needed
// });

// test("button click triggers handleDownloadFile and setIsDownloadTrue", () => {
//   // Mock the handleDownloadFile and setIsDownloadTrue functions
//   const handleDownloadFile = jest.fn();
//   const setIsDownloadTrue = jest.fn();

//   // Render the component with the mocked functions
//   const { getByTestId  } = render(
//     <FileView
//       editorRef={editorRefMock}
//       handleDownloadFile={handleDownloadFile}
//       setIsDownloadTrue={setIsDownloadTrue}
//     />
//   );

//   // Find the download button by its text content
//   const downloadButton = getByTestId ('download-button');

//   // Simulate a click on the download button
//   fireEvent.click(downloadButton);

//   // Check if handleDownloadFile was called
//   expect(handleDownloadFile).toHaveBeenCalled();

//   // Check if setIsDownloadTrue was called with the correct argument
//   expect(setIsDownloadTrue).toHaveBeenCalledWith(false);
// });

// test('renderFolder renders folder correctly within FileView', () => {
//   // Mock folder data
//   const folder = {
//     _id: 'folderId',
//     name: 'Folder 1',
//     type: 'root', // or 'directory' or 'file' based on your component logic
//     children: [], // Mock children if needed
//   };

//   // Render the FileView component with the folder
//   render(<FileView  editorRef={editorRefMock} selectedFileFolder={folder} />);
//   const textMatcher = (content, element) => {
//     // Check if the element's textContent matches the folder name
//     return element.textContent === folder.name;
//   };

//   // Find the rendered folder name within the FileView component using the custom matcher
//   const folderNameElement = screen.getByText(textMatcher);

//   // Assert that the folder name element is in the document
//   expect(folderNameElement).toBeInTheDocument();

// });
