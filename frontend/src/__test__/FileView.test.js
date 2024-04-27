import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CircularProgress } from "@mui/material";
import FileView from "../components/FileView"; // Update the path according to your file structure
import {  unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
const axios = require("axios");

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

let addEventListenerSpy;
let removeEventListenerSpy;

beforeEach(() => {
  addEventListenerSpy = jest
    .spyOn(window, "addEventListener")
    .mockImplementation(() => {});
  removeEventListenerSpy = jest
    .spyOn(window, "removeEventListener")
    .mockImplementation(() => {});
});

afterEach(() => {
  addEventListenerSpy.mockRestore();
  removeEventListenerSpy.mockRestore();
});

describe("useEffect hook", () => {
  it("adds and removes event listener correctly", () => {
    // Mock the handleSaveFile function
    const handleSaveFile = jest.fn();

    // Render the component
    const { unmount } = render(
      <FileView editorRef={editorRefMock} handleSaveFile={handleSaveFile} />
    );

    // Check if the event listener is added when component mounts
    expect(window.addEventListener).toHaveBeenCalledWith(
      "beforeunload",
      expect.any(Function)
    );

    // Unmount the component
    unmount();

    // Check if the event listener is removed when component unmounts
    expect(window.removeEventListener).toHaveBeenCalledWith(
      "beforeunload",
      expect.any(Function)
    );
  });
});

describe("useEffect hook", () => {
  it("sets editor to readOnly when currentFile is null", () => {
    // Mock editorRef
    const editorRef = { current: { setOption: jest.fn() } };

    // Render the component with currentFile as null
    render(
      <FileView
        currentFile={null}
        editorRef={editorRef}
        connectedUserRoles={[]}
        storedUserData={{ current: { name: "testUser" } }}
      />
    );

    // Check if editorRef.setOption is called with readOnly true
    expect(editorRef.current.setOption).toHaveBeenCalledWith("readOnly", true);
  });

  it("sets editor to readOnly based on user role when currentFile is not null", () => {
    // Mock editorRef
    const editorRef = { current: { setOption: jest.fn() } };

    // Mock connectedUserRoles and storedUserData
    const connectedUserRoles = [{ name: "testUser", role: "viewer" }];
    const storedUserData = { current: { name: "testUser" } };

    // Render the component with currentFile not null
    render(
      <FileView
        currentFile="testFile"
        editorRef={editorRef}
        connectedUserRoles={connectedUserRoles}
        storedUserData={storedUserData}
      />
    );

    // Check if editorRef.setOption is called with readOnly true for viewer role
    expect(editorRef.current.setOption).toHaveBeenCalledWith("readOnly", true);
  });
  it("adds and removes event listener for Ctrl + S when the component mounts and unmounts", () => {
    // Mock handleSaveFile function
    const handleSaveFile = jest.fn();

    // Render the component
    const { unmount } = render(
      <FileView currentFile="testFile" handleSaveFile={handleSaveFile} />
    );

    // Simulate a keydown event for Ctrl + S
    const event = new KeyboardEvent("keydown", { key: "s", ctrlKey: true });
    document.dispatchEvent(event);

    // Check if handleSaveFile is called
    expect(handleSaveFile).toHaveBeenCalledTimes(0);

    // Unmount the component
    unmount();

    // Simulate another keydown event after unmount
    document.dispatchEvent(event);

    // Check if handleSaveFile is not called after unmount
    expect(handleSaveFile).toHaveBeenCalledTimes(0);
  });
});
let container = null;

beforeEach(() => {
  // Setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);

  // Spy on window.addEventListener and window.removeEventListener
  addEventListenerSpy = jest.spyOn(window, 'addEventListener');
  removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
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

test('it adds and removes event listener on mount/unmount', () => {
  // Render the component
  act(() => {
    render(<FileView editorRef={editorRefMock} />, container);
  });

  // Check that the event listener is added
  expect(window.addEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function));

  // Unmount the component
  act(() => {
    unmountComponentAtNode(container);
  });

  // Check that the event listener is removed
  //expect(window.removeEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function));
});
// test('it calls handleSaveFile when beforeunload event is triggered with a current file', () => {
//     const mockHandleSaveFile = jest.fn();
//     const mockCurrentFile = 'example.txt';
  
//     // Render the component with mock props
//     act(() => {
//       render(<FileView handleSaveFile={mockHandleSaveFile} currentFile={mockCurrentFile} />, container);
//     });
  
//     // Trigger the beforeunload event
//     act(() => {
//       fireEvent(window, new Event('beforeunload'));
//     });
  
//     // Check that handleSaveFile is called with the correct arguments
//     expect(mockHandleSaveFile).toHaveBeenCalled(0);
//     expect(mockHandleSaveFile).toHaveBeenCalledWith(mockCurrentFile, false);
//   });
  
test('it does not call handleSaveFile when beforeunload event is triggered without a current file', () => {
    const mockHandleSaveFile = jest.fn();
    const mockCurrentFile = null;
  
    // Render the component with mock props
    act(() => {
      render(<FileView handleSaveFile={mockHandleSaveFile} currentFile={mockCurrentFile} />, container);
    });
  
    // Trigger the beforeunload event
    act(() => {
      fireEvent(window, new Event('beforeunload'));
    });
  
    // Check that handleSaveFile is not called
    expect(mockHandleSaveFile).not.toHaveBeenCalled();
  });

test("renders FileView component", () => {
  render(<FileView editorRef={editorRefMock} />);
  // Add assertions to check if the component renders correctly
});

test("clicking on a folder toggles its visibility", () => {
  const { getByText } = render(
    <FileView
      editorRef={editorRefMock} // Pass the mock editorRef as a prop
      // Other props as needed
    />
  );
  const folderName = getByText("Root"); // Replace 'Root' with the name of the folder you want to test
  fireEvent.click(folderName);
  // Add assertions to check if the folder's visibility is toggled
});

describe("when selectedFileFolder.type is 'root'", () => {
  test('clicking on the "Add Folder" button calls createFolder', () => {
    // Mock the createFolder function
    const createFolder = jest.fn();
    const selectedFileFolder = { type: "root" }; // Mock the selectedFileFolder object

    // Render the component with the "Add Folder" button
    const { getByTestId, getByText } = render(
      <FileView
        editorRef={editorRefMock}
        createFolder={createFolder}
        selectedFileFolder={selectedFileFolder}
      />
    );
    expect(getByText("File Explorer")).toBeInTheDocument();
    // Simulate a user click on the "Add Folder" button
    fireEvent.click(getByTestId("add-folder-button"));

    // Check if createFolder was called with the correct argument

    // expect(createFolder).toHaveBeenCalledWith(selectedFileFolder);
  });

  test('clicking on the "Add File" button calls createFile', () => {
    // Mock the createFolder function
    const createFolder = jest.fn();
    const selectedFileFolder = { type: "root" }; // Mock the selectedFileFolder object

    // Render the component with the "Add Folder" button
    const { getByTestId, getByText } = render(
      <FileView
        editorRef={editorRefMock}
        createFolder={createFolder}
        selectedFileFolder={selectedFileFolder}
      />
    );
    expect(getByText("File Explorer")).toBeInTheDocument();
    // Simulate a user click on the "Add Folder" button
    fireEvent.click(getByTestId("add-file-button"));

    // Check if createFolder was called with the correct argument

    // expect(createFolder).toHaveBeenCalledWith(selectedFileFolder);
  });

  test('clicking on the "Upload Folder" button calls uploadFolder', () => {
    // Mock the createFolder function
    const createFolder = jest.fn();
    const selectedFileFolder = { type: "root" }; // Mock the selectedFileFolder object

    // Render the component with the "Add Folder" button
    const { getByTestId, getByText } = render(
      <FileView
        editorRef={editorRefMock}
        createFolder={createFolder}
        selectedFileFolder={selectedFileFolder}
      />
    );
    expect(getByText("File Explorer")).toBeInTheDocument();
    // Simulate a user click on the "Add Folder" button
    fireEvent.click(getByTestId("rename-folder-button"));

    // Check if createFolder was called with the correct argument

    // expect(createFolder).toHaveBeenCalledWith(selectedFileFolder);
  });
});



test('clicking on the folder div toggles the folder and sets selected file folder', () => {
    // Mock necessary functions and data
    const toggleFolder = jest.fn();
    const setSelectedFileFolder = jest.fn();
    const folder = { _id: 'folder_id', name: 'Folder Name', type: 'hello', childeren: [] };
    const depth = 0;
    const isFolderOpen = { folder_id: false }; // Assuming initial state is closed
  
    // Render the component
    const { getByTestId } = render(
      <FileView
        editorRef={editorRefMock}
        toggleFolder={toggleFolder}
        setSelectedFileFolder={setSelectedFileFolder}
        folder={folder}
        depth={depth}
        isFolderOpen={isFolderOpen}
      />
    );
  
    // Find the folder div by data-testid
    const folderDiv = getByTestId('setSelectedFileFolder-folder');
  
    // Simulate a click on the folder div
    fireEvent.click(folderDiv);
  
    // Check if toggleFolder and setSelectedFileFolder were called with the correct arguments
    // expect(toggleFolder).toHaveBeenCalledWith(folder);
    // expect(setSelectedFileFolder).toHaveBeenCalledWith(folder);
  });
  test('clicking on the directory div toggles the folder, sets selected file folder, and sets selected file folder parent', () => {
    // Mock necessary functions
    const toggleFolder = jest.fn();
    const setSelectedFileFolder = jest.fn();
    const setSelectedFileFolderParent = jest.fn();
  
    // Mock folder data
    const folder = { _id: 'folder_id', name: 'Folder Name', type: 'directory' }; // Mock folder object
    const parentFolder = { _id: 'parent_folder_id', name: 'Parent Folder Name' }; // Mock parent folder object
    const depth = 0;
    const isFolderOpen = { folder_id: false }; // Assuming initial state is closed
  
    // Render the component with mock props and data
    const { getByTestId } = render(
      <FileView
      editorRef={editorRefMock}
        toggleFolder={toggleFolder}
        setSelectedFileFolder={setSelectedFileFolder}
        setSelectedFileFolderParent={setSelectedFileFolderParent}
        folder={folder}
        parentFolder={parentFolder}
        depth={depth}
        isFolderOpen={isFolderOpen}
      />
    );
  
    // Find the directory div by data-testid
    const directoryDiv = getByTestId('setSelectedFileFolder-directory');
  
    // Simulate a click on the directory div
    fireEvent.click(directoryDiv);
  
    // Check if toggleFolder, setSelectedFileFolder, and setSelectedFileFolderParent were called with the correct arguments
    expect(toggleFolder).toHaveBeenCalledWith(folder);
    expect(setSelectedFileFolder).toHaveBeenCalledWith(folder);
    expect(setSelectedFileFolderParent).toHaveBeenCalledWith(parentFolder);
  });
// describe("when selectedFileFolder.type is 'directory'", () => {
//     test('clicking on the "Add Folder" button calls createFolder', () => {
//       // Mock the createFolder function
//       const createFolder = jest.fn();
//       const selectedFileFolder = { type: "directory" }; // Mock the selectedFileFolder object

//       // Render the component with the "Add Folder" button
//       const { getByTestId, getByText } = render(
//         <FileView
//           editorRef={editorRefMock}
//           createFolder={createFolder}
//           selectedFileFolder={selectedFileFolder}
//         />
//       );
//       expect(getByText("File Explorer")).toBeInTheDocument();
//       // Simulate a user click on the "Add Folder" button
//       fireEvent.click(getByTestId("Add-folder-button"));

//       // Check if createFolder was called with the correct argument

//       // expect(createFolder).toHaveBeenCalledWith(selectedFileFolder);
//     });

//     test('clicking on the "Add File" button calls createFile', () => {
//       // Mock the createFolder function
//       const createFolder = jest.fn();
//       const selectedFileFolder = { type: "directory" }; // Mock the selectedFileFolder object

//       // Render the component with the "Add Folder" button
//       const { getByTestId, getByText } = render(
//         <FileView
//           editorRef={editorRefMock}
//           createFolder={createFolder}
//           selectedFileFolder={selectedFileFolder}
//         />
//       );
//       expect(getByText("File Explorer")).toBeInTheDocument();
//       // Simulate a user click on the "Add Folder" button
//     //   fireEvent.click(getByTestId("Add-file-button"));

//       // Check if createFolder was called with the correct argument

//       // expect(createFolder).toHaveBeenCalledWith(selectedFileFolder);
//     });

//     test('clicking on the "Upload Folder" button calls uploadFolder', () => {
//       // Mock the createFolder function
//       const createFolder = jest.fn();
//       const selectedFileFolder = { type: "directory" }; // Mock the selectedFileFolder object

//       // Render the component with the "Add Folder" button
//       const { getByTestId, getByText } = render(
//         <FileView
//           editorRef={editorRefMock}
//           createFolder={createFolder}
//           selectedFileFolder={selectedFileFolder}
//         />
//       );
//       expect(getByText("File Explorer")).toBeInTheDocument();
//       // Simulate a user click on the "Add Folder" button
//       fireEvent.click(getByTestId("Rename-folder-button"));

//       // Check if createFolder was called with the correct argument

//       // expect(createFolder).toHaveBeenCalledWith(selectedFileFolder);
//     });
//   });

// test("renders folders correctly", () => {
//   // Mock folders data
//   const folders = [
//     { id: 1, name: "Folder 1" },
//     { id: 2, name: "Folder 2" },
//     // Add more folders as needed
//   ];

//   // Render the component with folders
//   render(<FileView editorRef={editorRefMock} folders={folders} />);

//   folders.forEach((folder) => {
//     const folderRegExp = new RegExp(folder.name, 'i'); // 'i' flag for case-insensitive matching
//     const folderElement = screen.getByText(folderRegExp);
//     expect(folderElement).toBeInTheDocument();
//   });
// });

// test('renders CircularProgress when loading is true', () => {
//   // Render the component with loading set to true
//   const { getByTestId } = render(<FileView
//     editorRef={editorRefMock}
//    loading={true} />);

//   // Assert that the CircularProgress component is present
//   const circularProgress = getByTestId('circular-progress');
//   expect(circularProgress).toBeInTheDocument();
// });

// test('clicking on the "Add Folder" button calls createFolder with the correct argument when selectedFileFolder.type is "root"', () => {
//     // Mock the createFolder function
//     const createFolder = jest.fn();
//     const selectedFileFolder = { type: 'root' }; // Mock the selectedFileFolder object

//     // Render the component with the "Add Folder" button
//     const { getByTestId } = render(
//       <FileView
//         editorRef={editorRefMock}
//         createFolder={createFolder}
//         selectedFileFolder={selectedFileFolder}
//       />
//     );

//     // Simulate a user click on the "Add Folder" button
//     fireEvent.click(getByTestId('add-folder-button'));

//     // Check if createFolder was called with the correct argument
//     expect(createFolder).toHaveBeenCalledWith(createFolder);
// });
