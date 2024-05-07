import React from "react";
import { render, fireEvent, screen, waitFor, getByTestId } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CircularProgress } from "@mui/material";
import FileView from "../components/FileView"; // Update the path according to your file structure
import {  unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
const axios = require("axios");
import { URL } from "url";

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
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useParams: () => ({
    roomId: '1',
  }),
  useRouteMatch: () => ({ url: '/editor/1' }),
}));

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
  it('Testing createFolder function when the add folder button is clicked', async () => {
    // Mock parentFolder
    const createFolder = jest.fn();
    
    const parentFolder = {
      _id: 'parentFolderId',
      children: [],
    };
  
    // Render the component
    const { getByTestId, getByText } = render(<FileView editorRef={editorRefMock} />);
  
    // Mock prompt function
    global.prompt = jest.fn().mockReturnValue('New Folder');
  
    // Mock axios post response
    axios.post.mockResolvedValueOnce({
      data: {
        directory: {
          _id: 'newFolderId',
          name: 'New Folder',
          type: 'folder',
          children: [],
        },
      },
    });
    axios.post.mockResolvedValueOnce({
      data: {
        directory: {
          _id: 'newFolderId',
          name: 'New Folder',
          type: 'folder',
          children: [],
        },
      },
    });
  

    expect(getByText("File Explorer")).toBeInTheDocument();

    // Click the "Add Folder" button
    const addButton = getByTestId('add-folder-button');
    fireEvent.click(addButton);
  
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_URL}/filesystem/generatetree`,
        {
          roomId: '1',
        }
      );
    });
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_URL}/filesystem/createdirectory`,
        {
          name: 'New Folder',
          parentId: '0', // Ensure parentId is set correctly
          roomId: '1', // Ensure roomId is set correctly
        },
        
      );
    });
    // await waitFor(() => {
    //   expect(getByText("New Folder")).toBeInTheDocument();
    // });
    // Add your assertions for the folder creation logic here
  });
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

  test('clicking on the "Add File" button calls createFile', async () => {
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

    global.prompt = jest.fn().mockReturnValue('New Folder');
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_URL}/filesystem/generatetree`,
        {
          roomId: '1',
        }
      );
    });
    // await waitFor(() => {
    //   expect(axios.post).toHaveBeenCalledWith(
    //     `${process.env.REACT_APP_API_URL}/filesystem/createfile`,
    //     {
    //       name: 'New File',
    //       parentId: '0', // Ensure parentId is set correctly
    //       roomId: '1', // Ensure roomId is set correctly
    //     },
        
    //   );
    // });


  });

  test('clicking upload file calls the upload file api', async () => {
    // Mock the createFolder function
    const createFolder = jest.fn();

    // Render the component with the "Add Folder" button
    const { getByTestId, getByText } = render(
      <FileView
        editorRef={editorRefMock}
        createFolder={createFolder}
      />
    );
    expect(getByText("File Explorer")).toBeInTheDocument();
    // Simulate a user click on the "Add Folder" button
    fireEvent.click(getByTestId("upload-file-button"));
  
    act(() => {
      getByTestId('setFile').click();
    });
    // Wait for the axios post request to be called and resolved
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_URL}/filesystem/generatetree`,
        {
          roomId: '1',
        }
      );
    });
    // await waitFor(() => {
    //   expect(axios.post).toHaveBeenCalledWith(
    //     `${process.env.REACT_APP_API_URL}/filesystem/uploadFile`,
    //     {
    //       roomId: '1',
    //     }
    //   );
    // });
    // await waitFor(() => {
    //   expect(axios.post).toHaveBeenCalledWith(
    //     `${process.env.REACT_APP_API_URL}/filesystem/createfile`,
    //     {
    //       name: 'New File',
    //       parentId: '0', // Ensure parentId is set correctly
    //       roomId: '1', // Ensure roomId is set correctly
    //     },
        
    //   );
    // });


  });

  test('clicking on the rename folder button calls renamedirectory api', async () => {
    const createFolder = jest.fn();
    
    const parentFolder = {
      _id: 'parentFolderId',
      children: [],
    };
  
    // Render the component
    const { getByTestId, getByText } = render(<FileView editorRef={editorRefMock} />);
  
    // Mock prompt function
    global.prompt = jest.fn().mockReturnValue('New Folder');
  
    // Mock axios post response
    axios.post.mockResolvedValueOnce({
      data: {
        directory: {
          _id: 'newFolderId',
          name: 'New Folder',
          type: 'folder',
          children: [],
        },
      },
    });
    axios.post.mockResolvedValueOnce({
      data: {
        directory: {
          _id: 'newFolderId',
          name: 'New Folder',
          type: 'folder',
          children: [],
        },
      },
    });
  

    expect(getByText("File Explorer")).toBeInTheDocument();

    // Click the "Add Folder" button
    const addButton = getByTestId('rename-folder-button');
    fireEvent.click(addButton);
  
    act(() => {
      getByTestId('setDirectory').click();
    });    // Wait for the axios post request to be called and resolved
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_URL}/filesystem/generatetree`,
        {
          roomId: '1',
        }
      );
    });
    // await waitFor(() => {
    //   expect(axios.post).toHaveBeenCalledWith(
    //     `${process.env.REACT_APP_API_URL}/filesystem/renamedirectory`,
    //     {
    //       name: 'New Folder',
    //       parentId: '0', // Ensure parentId is set correctly
    //       roomId: '1', // Ensure roomId is set correctly
    //     },
        
    //   );
    // });// expect(createFolder).toHaveBeenCalledWith(selectedFileFolder);
  });

  test('clicking file input uploads file', async () => {
    // Mock the createFolder function
    const createFolder = jest.fn();
    const setContentChanged = jest.fn();
    // Render the component with the "Add Folder" button
    const { getByTestId, getByText } = render(
      <FileView
        editorRef={editorRefMock}
        createFolder={createFolder}
        setContentChanged={setContentChanged}
      />
    );
    // Simulate a user click on the "Add Folder" button
    const file = new File(['file content'], 'filename.txt', { type: 'text/plain' });
    // Simulate a change event on the file input with the File object
    fireEvent.change(getByTestId("file-input"), { target: { files: [file] } });  
    // Wait for the axios post request to be called and resolved
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_URL}/filesystem/generatetree`,
        {
          roomId: '1',
        }
      );
    });
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
  // test('clicking on the directory div toggles the folder, sets selected file folder, and sets selected file folder parent', () => {
  //   // Mock necessary functions
  //   const toggleFolder = jest.fn();
  //   const setSelectedFileFolder = jest.fn();
  //   const setSelectedFileFolderParent = jest.fn();
  
  //   // Mock folder data
  //   const folder = { _id: 'folder_id', name: 'Folder Name', type: 'directory' }; // Mock folder object
  //   const parentFolder = { _id: 'parent_folder_id', name: 'Parent Folder Name' }; // Mock parent folder object
  //   const depth = 0;
  //   const isFolderOpen = { folder_id: false }; // Assuming initial state is closed
  
  //   // Render the component with mock props and data
  //   const { getByTestId } = render(
  //     <FileView
  //     editorRef={editorRefMock}
  //       toggleFolder={toggleFolder}
  //       setSelectedFileFolder={setSelectedFileFolder}
  //       setSelectedFileFolderParent={setSelectedFileFolderParent}
  //       folder={folder}
  //       parentFolder={parentFolder}
  //       depth={depth}
  //       isFolderOpen={isFolderOpen}
  //     />
  //   );
  
  //   // Find the directory div by data-testid
  //   const directoryDiv = getByTestId('setSelectedFileFolder-directory');
  
  //   // Simulate a click on the directory div
  //   fireEvent.click(directoryDiv);
  
  //   // Check if toggleFolder, setSelectedFileFolder, and setSelectedFileFolderParent were called with the correct arguments
  //   expect(toggleFolder).toHaveBeenCalledWith(folder);
  //   expect(setSelectedFileFolder).toHaveBeenCalledWith(folder);
  //   expect(setSelectedFileFolderParent).toHaveBeenCalledWith(parentFolder);
  // });
describe("when selectedFileFolder.type is 'directory'", () => {
  it('Testing createFolder function when the add button is clicked', async () => {
    // Mock parentFolder
    const createFolder = jest.fn();
    
    const parentFolder = {
      _id: 'parentFolderId',
      children: [],
    };
  
    // Render the component
    const { getByTestId, getByText } = render(<FileView editorRef={editorRefMock} />);
  
    // Mock prompt function
    global.prompt = jest.fn().mockReturnValue('New Folder');
  
    // Mock axios post response
    axios.post.mockResolvedValueOnce({
      data: {
        directory: {
          _id: 'newFolderId',
          name: 'New Folder',
          type: 'folder',
          children: [],
        },
      },
    });
    axios.post.mockResolvedValueOnce({
      data: {
        directory: {
          _id: 'newFolderId',
          name: 'New Folder',
          type: 'folder',
          children: [],
        },
      },
    });
  

    expect(getByText("File Explorer")).toBeInTheDocument();

    // Click the "Add Folder" button
    
    act(() => {
      getByTestId('setDirectory').click();
    });    const addButton = getByTestId('add-folder-button-directory');
    fireEvent.click(addButton);
    // Wait for the axios post request to be called and resolved
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_URL}/filesystem/generatetree`,
        {
          roomId: '1',
        }
      );
    });
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_URL}/filesystem/createdirectory`,
        {
          name: 'New Folder',
          parentId: '0', // Ensure parentId is set correctly
          roomId: '1', // Ensure roomId is set correctly
        },
        
      );
    });
  
    // Add your assertions for the folder creation logic here
  });
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
    act(() => {
      getByTestId('setDirectory').click();
    });
    fireEvent.click(getByTestId("add-folder-button-directory"));

    // Check if createFolder was called with the correct argument

    // expect(createFolder).toHaveBeenCalledWith(selectedFileFolder);
  });

  test('clicking on the "Add File" button calls createFile', async () => {
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
    
    act(() => {
      getByTestId('setDirectory').click();
    });    // Wait for the axios post request to be called and resolved
    
    fireEvent.click(getByTestId("add-file-button-directory"));

    global.prompt = jest.fn().mockReturnValue('New Folder');
  
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_URL}/filesystem/generatetree`,
        {
          roomId: '1',
        }
      );
    });
    // await waitFor(() => {
    //   expect(axios.post).toHaveBeenCalledWith(
    //     `${process.env.REACT_APP_API_URL}/filesystem/createfile`,
    //     {
    //       name: 'New File',
    //       parentId: '0', // Ensure parentId is set correctly
    //       roomId: '1', // Ensure roomId is set correctly
    //     },
        
    //   );
    // });


  });

  test('clicking upload file calls the upload file api', async () => {
    // Mock the createFolder function
    const createFolder = jest.fn();

    // Render the component with the "Add Folder" button
    const { getByTestId, getByText } = render(
      <FileView
        editorRef={editorRefMock}
        createFolder={createFolder}
      />
    );
    expect(getByText("File Explorer")).toBeInTheDocument();
    act(() => {
      getByTestId('setDirectory').click();
    });    // Wait for the axios post request to be called and resolved
    // Simulate a user click on the "Add Folder" button
    fireEvent.click(getByTestId("upload-file-button-directory"));
  
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_URL}/filesystem/generatetree`,
        {
          roomId: '1',
        }
      );
    });
    // await waitFor(() => {
    //   expect(axios.post).toHaveBeenCalledWith(
    //     `${process.env.REACT_APP_API_URL}/filesystem/uploadFile`,
    //     {
    //       roomId: '1',
    //     }
    //   );
    // });
    // await waitFor(() => {
    //   expect(axios.post).toHaveBeenCalledWith(
    //     `${process.env.REACT_APP_API_URL}/filesystem/createfile`,
    //     {
    //       name: 'New File',
    //       parentId: '0', // Ensure parentId is set correctly
    //       roomId: '1', // Ensure roomId is set correctly
    //     },
        
    //   );
    // });


  });

  test('clicking on the rename folder button calls renamedirectory api', async () => {
    const createFolder = jest.fn();
    
    const parentFolder = {
      _id: 'parentFolderId',
      children: [],
    };
  
    // Render the component
    const { getByTestId, getByText } = render(<FileView editorRef={editorRefMock} />);
  
    // Mock prompt function
    global.prompt = jest.fn().mockReturnValue('New Folder');
  
    // Mock axios post response
    axios.post.mockResolvedValueOnce({
      data: {
        directory: {
          _id: 'newFolderId',
          name: 'New Folder',
          type: 'folder',
          children: [],
        },
      },
    });
    axios.post.mockResolvedValueOnce({
      data: {
        directory: {
          _id: 'newFolderId',
          name: 'New Folder',
          type: 'folder',
          children: [],
        },
      },
    });
  

    expect(getByText("File Explorer")).toBeInTheDocument();

    act(() => {
      getByTestId('setDirectory').click();
    });

    // Click the "Add Folder" button
    const addButton = getByTestId('rename-folder-button-directory');
    fireEvent.click(addButton);
  
    // Wait for the axios post request to be called and resolved
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_URL}/filesystem/generatetree`,
        {
          roomId: '1',
        }
      );
    });
    // await waitFor(() => {
    //   expect(axios.post).toHaveBeenCalledWith(
    //     `${process.env.REACT_APP_API_URL}/filesystem/renamedirectory`,
    //     {
    //       name: 'New Folder',
    //       parentId: '0', // Ensure parentId is set correctly
    //       roomId: '1', // Ensure roomId is set correctly
    //     },
        
    //   );
    // });// expect(createFolder).toHaveBeenCalledWith(selectedFileFolder);
    });
  
  test('clicking on the Delete folder button calls deletedirectory', async () => {
    const socketRefMock = {
      current: {
        emit: jest.fn(),
      },
    };
    // Mock the createFolder function
    const createFolder = jest.fn();

    // Render the component with the "Add Folder" button
    const { getByTestId, getByText } = render(
      <FileView
        editorRef={editorRefMock}
        createFolder={createFolder}
        socketRef={socketRefMock}      />
    );
    expect(getByText("File Explorer")).toBeInTheDocument();
    // Simulate a user click on the "Add Folder" button
    act(() => {
      getByTestId('setDirectory').click();
    });
    act(() => {
      getByTestId('setParent').click();
    });
    fireEvent.click(getByTestId("delete-folder-button-directory"));
  });
  });

  describe("when selectedFileFolder.type is 'file'", () => {  
    test('clicking on the rename folder button calls renamedirectory api', async () => {
      const createFolder = jest.fn();
      
      const parentFolder = {
        _id: 'parentFolderId',
        children: [],
      };
    
      // Render the component
      const { getByTestId, getByText } = render(<FileView editorRef={editorRefMock} />);
    
      // Mock prompt function
      global.prompt = jest.fn().mockReturnValue('New Folder');
    
      // Mock axios post response
      axios.post.mockResolvedValueOnce({
        data: {
          directory: {
            _id: 'newFolderId',
            name: 'New Folder',
            type: 'folder',
            children: [],
          },
        },
      });
      axios.post.mockResolvedValueOnce({
        data: {
          directory: {
            _id: 'newFolderId',
            name: 'New Folder',
            type: 'folder',
            children: [],
          },
        },
      });
    
  
      expect(getByText("File Explorer")).toBeInTheDocument();
  
      act(() => {
        getByTestId('setFile').click();
      });
  
      // Click the "Add Folder" button
      getByTestId('rename-file-button-file').click();
    
      // Wait for the axios post request to be called and resolved
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          `${process.env.REACT_APP_API_URL}/filesystem/generatetree`,
          {
            roomId: '1',
          }
        );
      });
      // await waitFor(() => {
      //   expect(axios.post).toHaveBeenCalledWith(
      //     `${process.env.REACT_APP_API_URL}/filesystem/renamedirectory`,
      //     {
      //       name: 'New Folder',
      //       parentId: '0', // Ensure parentId is set correctly
      //       roomId: '1', // Ensure roomId is set correctly
      //     },
          
      //   );
      // });// expect(createFolder).toHaveBeenCalledWith(selectedFileFolder);
      });
      test('clicking on the dowload file button sets the variable', async () => {      
        // Render the component
        const { getByTestId, getByText } = render(<FileView editorRef={editorRefMock} />);
    
        act(() => {
          getByTestId('setFile').click();
        });
    
        act(() => {
          getByTestId('download-file-button-file').click();
        });
        // Wait for the axios post request to be called and resolved
        await waitFor(() => {
          expect(axios.post).toHaveBeenCalledWith(
            `${process.env.REACT_APP_API_URL}/filesystem/generatetree`,
            {
              roomId: '1',
            }
          );
        });
        // await waitFor(() => {
        //   expect(axios.post).toHaveBeenCalledWith(
        //     `${process.env.REACT_APP_API_URL}/filesystem/renamedirectory`,
        //     {
        //       name: 'New Folder',
        //       parentId: '0', // Ensure parentId is set correctly
        //       roomId: '1', // Ensure roomId is set correctly
        //     },
            
        //   );
        // });// expect(createFolder).toHaveBeenCalledWith(selectedFileFolder);
        });
  
        test('clicking on the Delete folder button calls deletedirectory', async () => {
          const socketRefMock = {
            current: {
              emit: jest.fn(),
            },
          };
          // Mock the createFolder function
          const createFolder = jest.fn();
      
          // Render the component with the "Add Folder" button
          const { getByTestId, getByText } = render(
            <FileView
              editorRef={editorRefMock}
              createFolder={createFolder}
              socketRef={socketRefMock}      />
          );
          expect(getByText("File Explorer")).toBeInTheDocument();
          // Simulate a user click on the "Add Folder" button
          act(() => {
            getByTestId('setFile').click();
          });
          act(() => {
            getByTestId('setParent').click();
          });
          fireEvent.click(getByTestId("delete-file-button-file"));
        });
    });

  describe("when is downloading is true", () => {
    test('set download false button', async () => {
        // Render the component
        const { getByTestId, getByText } = render(<FileView editorRef={editorRefMock} />);
        
        act(() => {
          getByTestId('setFile').click();
        });
        act(() => {
          getByTestId('download-file-button-file').click();
        });
        act(() => {
          fireEvent.click(getByTestId('set-download-false-button'));
        });
     });

     test('set filename input', async () => {
      // Render the component
        const { getByTestId, getByText } = render(<FileView editorRef={editorRefMock} />);
        
        act(() => {
          getByTestId('setFile').click();
        });
        act(() => {
          getByTestId('download-file-button-file').click();
        });
        act(() => {
          fireEvent.change(getByTestId('file-name-input'), { target: { value: 'newFileName.txt' } });
        });
      });

      test('test file extension select', async () => {
        // Render the component
        const { getByTestId, getByText } = render(<FileView editorRef={editorRefMock} />);
        
        act(() => {
          getByTestId('setFile').click();
        });
        act(() => {
          getByTestId('download-file-button-file').click();
        });
        act(() => {
          fireEvent.change(getByTestId('file-extension-select'), { target: { value: 'txt' } });
        });
      });
      test('test download file button', async () => {
        global.URL.createObjectURL = jest.fn();
        // Render the component
        const { getByTestId, getByText } = render(<FileView editorRef={editorRefMock} />);
        
        act(() => {
          getByTestId('setFile').click();
        });
        act(() => {
          getByTestId('download-file-button-file').click();
        });
        act(() => {
          getByTestId('download-file-button').click();
        });
      });

  });


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
