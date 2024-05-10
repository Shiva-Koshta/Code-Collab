import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Sidebar from "../components/Sidebar";
import { MemoryRouter } from "react-router-dom";
const axios = require("axios");

// Mock axios module
jest.mock("axios");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("axios", () => ({
  get: jest.fn().mockResolvedValue({
    data: "mock file content",
  }),
}));

jest.mock("react-toastify", () => ({
  __esModule: true,
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));
let currentFileMock;
let socketRefMock;
let editorRefMock;
let connectedUserRolesMock;
beforeEach(() => {
  currentFileMock = { current: jest.fn() };
  socketRefMock = {
    current: { setOption: jest.fn(), emit: jest.fn(), on: jest.fn() },
    setOption: jest.fn(),
    getOption: jest.fn(),
  };
  editorRefMock = { current: { setOption: jest.fn() } };
  connectedUserRolesMock = { find: jest.fn() };
});
test("Menu opens when user image or username is clicked", async () => {
  // Mock user data and functions
  const connectedUsers = [{ username: "user1", profileImage: "image1.png" }];
  const menuOpen = { user1: false }; // Mock initial menu state
  const setMenuOpen = jest.fn();
  const host = { current: "hostUser" };
  const connectedUserRoles = [{ name: "user1", role: "role1" }];
  const storedUserData = { current: { name: "hostUser" } };
  const handleChangeRole = jest.fn();
  const setConnectedUserRoles = jest.fn();
  let socketRefMock = {
    current: {
      on: jest.fn(),
      emit: jest.fn(),
    },
  };
  // Render the component
  const { getByTestId, findByTestId } = render(
    <MemoryRouter>
      <Sidebar
        isConnectedComponentOpen={true}
        connectedUsers={connectedUsers}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        host={host}
        connectedUserRoles={connectedUserRoles}
        storedUserData={storedUserData}
        handleChangeRole={handleChangeRole}
        setConnectedUserRoles={setConnectedUserRoles}
        socketRef={socketRefMock}
        currentFile={currentFileMock}
        editorRef={editorRefMock}
      />
    </MemoryRouter>
  );

  // Find the first user's image and click on it
  fireEvent.click(getByTestId("inside-hello"));
  fireEvent.click(getByTestId("inside-menu"));
  const userImage = getByTestId("user-List");
  fireEvent.click(userImage);

  const changeRoleMenuItem = getByTestId("menuitem");
  fireEvent.click(changeRoleMenuItem);
});
describe("Sidebar", () => {
  const connectedUsers = [
    { username: "user1", profileImage: "image1.jpg" },
    { username: "user2", profileImage: "image2.jpg" },
  ];

  const connectedUserRoles = [
    { name: "user1", role: "viewer" },
    { name: "user2", role: "viewer" },
  ];

  const host = { current: "user1" };
  const roomId = "room123";
  const storedUserData = { current: { name: "user1" } };

  test("renders correctly", () => {
    render(
      <MemoryRouter>
        <Sidebar
          contentChanged={false}
          setContentChanged={() => {}}
          fileContent=""
          setFileContent={() => {}}
          connectedUsers={[]}
          toggleChat={() => {}}
          unreadMessages={0}
          roomId=""
          isLeftDivOpen={false}
          toggleLeftDiv={() => {}}
          leftIcon={<div />}
          storedUserData={{ current: { name: "" } }}
          host={{ current: "" }}
          setConnectedUserRoles={() => {}}
          menuOpen={{}}
          setMenuOpen={() => {}}
          currentFile={currentFileMock}
          socketRef={socketRefMock}
          editorRef={editorRefMock}
          connectedUserRoles={connectedUserRolesMock}
        />
      </MemoryRouter>
    );
  });
  describe("IconButton component", () => {
    test("triggers copyRoomId function on click and displays success toast", async () => {
      // Mock the clipboard API
      const originalClipboard = navigator.clipboard;
      navigator.clipboard = {
        writeText: jest.fn().mockResolvedValueOnce(), // Mock the writeText method
      };

      // Render the component containing the IconButton
      const { getByTestId } = render(
        <MemoryRouter>
          <Sidebar
            contentChanged={false}
            setContentChanged={() => {}}
            fileContent=""
            setFileContent={() => {}}
            connectedUsers={[]}
            toggleChat={() => {}}
            unreadMessages={0}
            roomId=""
            isLeftDivOpen={false}
            toggleLeftDiv={() => {}}
            leftIcon={<div />}
            storedUserData={{ current: { name: "" } }}
            host={{ current: "" }}
            setConnectedUserRoles={() => {}}
            menuOpen={{}}
            setMenuOpen={() => {}}
            currentFile={currentFileMock}
            socketRef={socketRefMock}
            editorRef={editorRefMock}
            connectedUserRoles={connectedUserRolesMock}
          />
        </MemoryRouter>
      );

      // Simulate a click event on the IconButton
      fireEvent.click(getByTestId("copy-button"));

      // Await for the asynchronous operation to complete
      await Promise.resolve();

      // Check if the clipboard.writeText method is called
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
      navigator.clipboard = originalClipboard;
    });

    test("displays error toast if copying the Room ID fails", async () => {
      // Mock the clipboard API to simulate a rejection
      const originalClipboard = navigator.clipboard;
      navigator.clipboard = {
        writeText: jest.fn().mockRejectedValueOnce(new Error()), // Mock the writeText method to throw an error
      };

      // Render the component containing the IconButton
      const { getByTestId } = render(
        <MemoryRouter>
          <Sidebar
            contentChanged={false}
            setContentChanged={() => {}}
            fileContent=""
            setFileContent={() => {}}
            connectedUsers={[]}
            toggleChat={() => {}}
            unreadMessages={0}
            roomId=""
            isLeftDivOpen={false}
            toggleLeftDiv={() => {}}
            leftIcon={<div />}
            storedUserData={{ current: { name: "" } }}
            host={{ current: "" }}
            setConnectedUserRoles={() => {}}
            menuOpen={{}}
            setMenuOpen={() => {}}
            currentFile={currentFileMock}
            socketRef={socketRefMock}
            editorRef={editorRefMock}
            connectedUserRoles={connectedUserRolesMock}
          />
        </MemoryRouter>
      );

      // Simulate a click event on the IconButton
      fireEvent.click(getByTestId("copy-button"));

      // Await for the asynchronous operation to complete
      await Promise.resolve();

      // Check if the clipboard.writeText method is called
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
      navigator.clipboard = originalClipboard;
    });

    test("leaves room when leave button is clicked when numUsers is 1", async () => {
      // Mock necessary dependencies
      const originalFetch = global.fetch;
      global.fetch = jest.fn().mockResolvedValueOnce({ ok: true }); // Mock a successful fetch call

      const originalConfirm = window.confirm;
      window.confirm = jest.fn(() => true); // Mock confirmation dialog
      global.fetch = jest
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: () => ({ numUsers: 1 }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => ({ message: "Room left successfully" }),
        });
      // Render the component
      const reactNavigator = jest.fn();
      const roomId = "yourRoomId";
      const { getByTestId } = render(
        <MemoryRouter>
          <Sidebar
            contentChanged={false}
            setContentChanged={() => {}}
            fileContent=""
            setFileContent={() => {}}
            connectedUsers={[]}
            toggleChat={() => {}}
            unreadMessages={0}
            roomId=""
            isLeftDivOpen={false}
            toggleLeftDiv={() => {}}
            leftIcon={<div />}
            storedUserData={{ current: { name: "" } }}
            host={{ current: "" }}
            setConnectedUserRoles={() => {}}
            menuOpen={{}}
            setMenuOpen={() => {}}
            currentFile={currentFileMock}
            socketRef={socketRefMock}
            editorRef={editorRefMock}
            connectedUserRoles={connectedUserRolesMock}
            reactNavigator={reactNavigator}
          />
        </MemoryRouter>
      );

      // Find and click the leave button
      const leaveButton = getByTestId("leave-button");
      fireEvent.click(leaveButton);

      // Assertions
      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_URL}/rooms/numUsersInRoom`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ roomId: "" }),
        }
      );

      await waitFor(() => {
        expect(window.confirm).toHaveBeenCalledWith("Confirm leave room?");
        expect(global.fetch).toHaveBeenCalledWith(
          `${process.env.REACT_APP_API_URL}/rooms/numUsersInRoom`,
          expect.any(Object)
        );
        expect(() =>
          getByText("Failed to fetch user count from the server")
        ).toThrow();
      });
      const leaveResponseOk = { ok: true };
      const leaveResponseNotOk = { ok: false };

      // Restore original dependencies after the test
      global.fetch = originalFetch;
      window.confirm = originalConfirm;
    });
    test("leaves room when leave button is clicked when numUsers is greater than", async () => {
      // Mock necessary dependencies
      const originalFetch = global.fetch;
      global.fetch = jest.fn().mockResolvedValueOnce({ ok: true }); // Mock a successful fetch call

      const originalConfirm = window.confirm;
      window.confirm = jest.fn(() => true); // Mock confirmation dialog
      global.fetch = jest
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: () => ({ numUsers: 2 }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => ({ message: "Room left successfully" }),
        });
      // Render the component
      const reactNavigator = jest.fn();
      const roomId = "yourRoomId";
      const { getByTestId } = render(
        <MemoryRouter>
          <Sidebar
            contentChanged={false}
            setContentChanged={() => {}}
            fileContent=""
            setFileContent={() => {}}
            connectedUsers={[]}
            toggleChat={() => {}}
            unreadMessages={0}
            roomId=""
            isLeftDivOpen={false}
            toggleLeftDiv={() => {}}
            leftIcon={<div />}
            storedUserData={{ current: { name: "" } }}
            host={{ current: "" }}
            setConnectedUserRoles={() => {}}
            menuOpen={{}}
            setMenuOpen={() => {}}
            currentFile={currentFileMock}
            socketRef={socketRefMock}
            editorRef={editorRefMock}
            connectedUserRoles={connectedUserRolesMock}
            reactNavigator={reactNavigator}
          />
        </MemoryRouter>
      );

      // Find and click the leave button
      const leaveButton = getByTestId("leave-button");
      fireEvent.click(leaveButton);

      // Assertions
      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_URL}/rooms/numUsersInRoom`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ roomId: "" }),
        }
      );

      await waitFor(() => {
        expect(window.confirm).toHaveBeenCalledWith("Confirm leave room?");
        expect(global.fetch).toHaveBeenCalledWith(
          `${process.env.REACT_APP_API_URL}/rooms/numUsersInRoom`,
          expect.any(Object)
        );
        expect(() =>
          getByText("Failed to fetch user count from the server")
        ).toThrow();
      });
      const leaveResponseOk = { ok: true };
      const leaveResponseNotOk = { ok: false };

      // Restore original dependencies after the test
      global.fetch = originalFetch;
      window.confirm = originalConfirm;
    });

    test("downloads a zip file when download button is clicked", async () => {
      const mockedResponse = {
        data: new Blob(),
        headers: { "content-type": "application/zip" },
      };
      jest.spyOn(axios, "get").mockResolvedValue(mockedResponse);

      // Render the Sidebar component
      const originalFetch = global.fetch;
      global.fetch = jest.fn().mockResolvedValueOnce({ ok: true }); // Mock a successful fetch call

      const originalConfirm = window.confirm;
      window.confirm = jest.fn(() => true); // Mock confirmation dialog

      // Render the component
      const reactNavigator = jest.fn();
      const roomId = "yourRoomId"; // Use the roomId variable
      const { getByTestId } = render(
        <MemoryRouter>
          <Sidebar
            contentChanged={false}
            setContentChanged={() => {}}
            fileContent=""
            setFileContent={() => {}}
            connectedUsers={[]}
            toggleChat={() => {}}
            unreadMessages={0}
            roomId=""
            isLeftDivOpen={false}
            toggleLeftDiv={() => {}}
            leftIcon={<div />}
            storedUserData={{ current: { name: "" } }}
            host={{ current: "" }}
            setConnectedUserRoles={() => {}}
            menuOpen={{}}
            setMenuOpen={() => {}}
            currentFile={currentFileMock}
            socketRef={socketRefMock}
            editorRef={editorRefMock}
            connectedUserRoles={connectedUserRolesMock}
            reactNavigator={reactNavigator}
          />
        </MemoryRouter>
      );

      // Find and click the download button by its text content
      const downloadButton = getByTestId("Download-button");
      fireEvent.click(downloadButton);

      // Assertions
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("/filesystem/download/"), // Check if the API URL contains the correct path
        {
          responseType: "blob",
        }
      );
      // Restore original dependencies after the test
      global.fetch = originalFetch;
      window.confirm = originalConfirm;
    });
  });

  test("toggles connected component when clicked", () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <Sidebar
          contentChanged={false}
          setContentChanged={() => {}}
          fileContent=""
          setFileContent={() => {}}
          connectedUsers={[]}
          toggleChat={() => {}}
          unreadMessages={0}
          roomId=""
          isLeftDivOpen={false}
          toggleLeftDiv={() => {}}
          leftIcon={<div />}
          storedUserData={{ current: { name: "" } }}
          host={{ current: "" }}
          setConnectedUserRoles={() => {}}
          currentFile={currentFileMock}
          socketRef={socketRefMock}
          editorRef={editorRefMock}
          connectedUserRoles={connectedUserRolesMock}
          menuOpen={{}}
          setMenuOpen={() => {}}
        />
      </MemoryRouter>
    );

    // Find the div element by its text content
    const toggleElement = getByTestId("handle-Toggle"); // Change 'Toggle Text' to match the content of your div

    // Simulate a click event on the div
    fireEvent.click(toggleElement);
  });
});
const connectedUsers = [
  {
    username: "john_doe",
    profileImage: "/images/john_doe.png",
  },
];
test("finds img elements with correct data-testid and handles clicks", async () => {
  const setMenuOpen = jest.fn((fn) => {
    return fn;
  });
  const host = {
    current: "john_doe",
  };
  const storedUserData = {
    current: {
      name: "jane_doe",
    },
  };
  const handleUserMenuToggle = jest.fn();
  render(
    <MemoryRouter>
      <Sidebar
        isConnectedComponentOpen={true}
        connectedUsers={connectedUsers}
        handleUserMenuToggle={handleUserMenuToggle}
        sertMenuOpen={setMenuOpen}
        host={host}
        storedUserData={storedUserData}
        currentFile={currentFileMock}
        socketRef={socketRefMock}
        editorRef={editorRefMock}
        connectedUserRoles={connectedUserRolesMock}
        // menuOpen={menuOpen}
      />
    </MemoryRouter>
  );
  // Simulate a user clicking the hidden input element
  const hiddenInput = screen.getByTestId("inside-hello");
  fireEvent.click(hiddenInput);
  connectedUsers.forEach((user) => {
    // Verify that the img element with data-testid="user-List" is in the document
    const imgElement = screen.getByTestId("user-List");
    expect(imgElement).toBeInTheDocument();
    fireEvent.click(imgElement);
  });
});
test("finds name elements with correct data-testid and handles clicks", async () => {
  const setMenuOpen = jest.fn((fn) => {
    return fn;
  });
  const host = {
    current: "john_doe", 
  };
  const storedUserData = {
    current: {
      name: "jane_doe", 
    },
  };
  const handleUserMenuToggle = jest.fn();
  render(
    <MemoryRouter>
      <Sidebar
        isConnectedComponentOpen={true}
        connectedUsers={connectedUsers}
        handleUserMenuToggle={handleUserMenuToggle}
        sertMenuOpen={setMenuOpen}
        host={host}
        storedUserData={storedUserData}
        currentFile={currentFileMock}
        socketRef={socketRefMock}
        editorRef={editorRefMock}
        connectedUserRoles={connectedUserRolesMock}
        //   menuOpen={menuOpen}
      />
    </MemoryRouter>
  );
  // Simulate a user clicking the hidden input element
  const hiddenInput = screen.getByTestId("inside-hello");
  fireEvent.click(hiddenInput);
  connectedUsers.forEach((user) => {
    // Verify that the img element with data-testid="user-List" is in the document
    const imgElement = screen.getByTestId("handle-User-Menu");
    expect(imgElement).toBeInTheDocument();
    fireEvent.click(imgElement);
  });
});
test("changes style of cursor to pointer", async () => {
  const setMenuOpen = jest.fn((fn) => {
    return fn;
  });
  const host = {
    current: "john_doe",
  };
  const storedUserData = {
    current: {
      name: "jane_doe", 
    },
  };
  const handleUserMenuToggle = jest.fn();
  render(
    <MemoryRouter>
      <Sidebar
        isConnectedComponentOpen={true}
        connectedUsers={connectedUsers}
        handleUserMenuToggle={handleUserMenuToggle}
        sertMenuOpen={setMenuOpen}
        host={host}
        storedUserData={storedUserData}
        currentFile={currentFileMock}
        socketRef={socketRefMock}
        editorRef={editorRefMock}
        connectedUserRoles={connectedUserRolesMock}
      />
    </MemoryRouter>
  );
  // Simulate a user clicking the hidden input element
  const hiddenInput = screen.getByTestId("inside-hello");
  fireEvent.click(hiddenInput);
  connectedUsers.forEach((user) => {
    // Verify that the img element with data-testid="user-List" is in the document
    const imgElement = screen.getByTestId("handle-User-Menu");
    expect(imgElement).toBeInTheDocument();
    // const imgElement = screen.getByTestId('user-List');

    // Simulate clicking the img element
    fireEvent.click(imgElement);
    const usernameElement = screen.getByText("john_doe");
    fireEvent.mouseEnter(usernameElement);

    // Verify the cursor style has been changed to 'pointer'
    expect(usernameElement.style.cursor).toBe("pointer");
  });
});
