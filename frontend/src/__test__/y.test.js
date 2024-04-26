import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FileView, { renderFolder } from "../components/FileView";
import userEvent from '@testing-library/user-event'; 
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
