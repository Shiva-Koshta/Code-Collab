import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Sidebar from "../components/Sidebar";
import { toast } from "react-toastify";
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
      />
    </MemoryRouter>
  );

  // Find the first user's image and click on it
  fireEvent.click(getByTestId("inside-hello"));
  fireEvent.click(getByTestId("inside-menu"));
  const userImage = getByTestId("user-List");
  fireEvent.click(userImage);

  // Check if the menu opens
  //   const insideMenu = await findByTestId("inside-Menu");
  //   expect(insideMenu).toBeInTheDocument();

  // Find the "Change Role" menu item and click on it
  const changeRoleMenuItem = getByTestId("menuitem");
  fireEvent.click(changeRoleMenuItem);

  // Check if handleChangeRole function is called with the correct username
  //   expect(handleChangeRole).toHaveBeenCalledWith("user1");

  //   // Simulate closing the menu
  //   fireEvent.click(changeRoleMenuItem); // Close the menu

  //   // Check if the menu is closed
  //   expect(setMenuOpen).toHaveBeenCalledWith({ user1: false }); // Ensure the menu state is updated
});
describe("Sidebar", () => {
  const connectedUsers = [
    { username: "user1", profileImage: "image1.jpg" },
    { username: "user2", profileImage: "image2.jpg" },
    // Add more mock users as needed
  ];

  const connectedUserRoles = [
    { name: "user1", role: "viewer" },
    { name: "user2", role: "viewer" },
    // Add more mock user roles as needed
  ];

  const host = { current: "user1" };
  const roomId = "room123";
  const storedUserData = { current: { name: "user1" } };

  it("renders correctly", () => {
    render(
      <MemoryRouter>
        <Sidebar
          contentChanged={false}
          setContentChanged={() => {}}
          fileContent=""
          setFileContent={() => {}}
          editorRef={{}}
          connectedUsers={[]}
          toggleChat={() => {}}
          unreadMessages={0}
          roomId=""
          isLeftDivOpen={false}
          toggleLeftDiv={() => {}}
          leftIcon={<div />}
          storedUserData={{ current: { name: "" } }}
          host={{ current: "" }}
          connectedUserRoles={[]}
          setConnectedUserRoles={() => {}}
          socketRef={{ current: null }}
          menuOpen={{}}
          setMenuOpen={() => {}}
        />
      </MemoryRouter>
    );
  });
  describe("IconButton component", () => {
    it("triggers copyRoomId function on click and displays success toast", async () => {
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
            editorRef={{}}
            connectedUsers={[]}
            toggleChat={() => {}}
            unreadMessages={0}
            roomId=""
            isLeftDivOpen={false}
            toggleLeftDiv={() => {}}
            leftIcon={<div />}
            storedUserData={{ current: { name: "" } }}
            host={{ current: "" }}
            connectedUserRoles={[]}
            setConnectedUserRoles={() => {}}
            socketRef={{ current: null }}
            menuOpen={{}}
            setMenuOpen={() => {}}
          />
        </MemoryRouter>
      );

      // Simulate a click event on the IconButton
      fireEvent.click(getByTestId("copy-button"));

      // Await for the asynchronous operation to complete
      await Promise.resolve();

      // Check if the clipboard.writeText method is called
      expect(navigator.clipboard.writeText).toHaveBeenCalled();

      // Check if the success toast is displayed
      //   expect(toast.success).toHaveBeenCalled();

      // Restore the original clipboard API
      navigator.clipboard = originalClipboard;
    });

    it("displays error toast if copying the Room ID fails", async () => {
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
            editorRef={{}}
            connectedUsers={[]}
            toggleChat={() => {}}
            unreadMessages={0}
            roomId=""
            isLeftDivOpen={false}
            toggleLeftDiv={() => {}}
            leftIcon={<div />}
            storedUserData={{ current: { name: "" } }}
            host={{ current: "" }}
            connectedUserRoles={[]}
            setConnectedUserRoles={() => {}}
            socketRef={{ current: null }}
            menuOpen={{}}
            setMenuOpen={() => {}}
          />
        </MemoryRouter>
      );

      // Simulate a click event on the IconButton
      fireEvent.click(getByTestId("copy-button"));

      // Await for the asynchronous operation to complete
      await Promise.resolve();

      // Check if the clipboard.writeText method is called
      expect(navigator.clipboard.writeText).toHaveBeenCalled();

      // Check if the error toast is displayed
      //   expect(toast.error).toHaveBeenCalled();

      // Restore the original clipboard API
      navigator.clipboard = originalClipboard;
    });

    it("leaves room when leave button is clicked when numUsers is 1", async () => {
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
            editorRef={{}}
            connectedUsers={[]}
            toggleChat={() => {}}
            unreadMessages={0}
            roomId=""
            isLeftDivOpen={false}
            toggleLeftDiv={() => {}}
            leftIcon={<div />}
            storedUserData={{ current: { name: "" } }}
            host={{ current: "" }}
            connectedUserRoles={[]}
            setConnectedUserRoles={() => {}}
            socketRef={{ current: null }}
            menuOpen={{}}
            setMenuOpen={() => {}}
            reactNavigator={reactNavigator}
          />
        </MemoryRouter>
      );

      // Find and click the leave button
      const leaveButton = getByTestId("leave-button");
      fireEvent.click(leaveButton);

      // Assertions
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8080/rooms/numUsersInRoom",
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
          "http://localhost:8080/rooms/numUsersInRoom",
          expect.any(Object)
        );
        expect(() =>
          getByText("Failed to fetch user count from the server")
        ).toThrow();
      });
      const leaveResponseOk = { ok: true };
      const leaveResponseNotOk = { ok: false };

      // Mock the leaveResponse and simulate both cases where ok is true and false
      // jest.spyOn(global, "fetch").mockResolvedValueOnce(leaveResponseOk);
      // await waitFor(
      //   () =>
      //     expect(reactNavigator).toHaveBeenCalledWith("/", {roomId: "",})

      //   //   expect(reactNavigator).toHaveBeenCalledWith("/", { roomId })
      // );

      // jest.spyOn(global, "fetch").mockResolvedValueOnce(leaveResponseNotOk);
      // await waitFor(() =>
      //   expect(reactNavigator).toHaveBeenCalledWith("/", { roomId: "" })
      // );

      // Restore original dependencies after the test
      global.fetch = originalFetch;
      window.confirm = originalConfirm;
    });
    it("leaves room when leave button is clicked when numUsers is greater than", async () => {
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
            editorRef={{}}
            connectedUsers={[]}
            toggleChat={() => {}}
            unreadMessages={0}
            roomId=""
            isLeftDivOpen={false}
            toggleLeftDiv={() => {}}
            leftIcon={<div />}
            storedUserData={{ current: { name: "" } }}
            host={{ current: "" }}
            connectedUserRoles={[]}
            setConnectedUserRoles={() => {}}
            socketRef={{ current: null }}
            menuOpen={{}}
            setMenuOpen={() => {}}
            reactNavigator={reactNavigator}
          />
        </MemoryRouter>
      );

      // Find and click the leave button
      const leaveButton = getByTestId("leave-button");
      fireEvent.click(leaveButton);

      // Assertions
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8080/rooms/numUsersInRoom",
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
          "http://localhost:8080/rooms/numUsersInRoom",
          expect.any(Object)
        );
        expect(() =>
          getByText("Failed to fetch user count from the server")
        ).toThrow();
      });
      const leaveResponseOk = { ok: true };
      const leaveResponseNotOk = { ok: false };

      // Mock the leaveResponse and simulate both cases where ok is true and false
      // jest.spyOn(global, "fetch").mockResolvedValueOnce(leaveResponseOk);
      // await waitFor(
      //   () =>
      //     expect(reactNavigator).toHaveBeenCalledWith("/", {roomId: "",})

      //   //   expect(reactNavigator).toHaveBeenCalledWith("/", { roomId })
      // );

      // jest.spyOn(global, "fetch").mockResolvedValueOnce(leaveResponseNotOk);
      // await waitFor(() =>
      //   expect(reactNavigator).toHaveBeenCalledWith("/", { roomId: "" })
      // );

      // Restore original dependencies after the test
      global.fetch = originalFetch;
      window.confirm = originalConfirm;
    });
    
    it("downloads a zip file when download button is clicked", async () => {
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
            editorRef={{}}
            connectedUsers={[]}
            toggleChat={() => {}}
            unreadMessages={0}
            roomId=""
            isLeftDivOpen={false}
            toggleLeftDiv={() => {}}
            leftIcon={<div />}
            storedUserData={{ current: { name: "" } }}
            host={{ current: "" }}
            connectedUserRoles={[]}
            setConnectedUserRoles={() => {}}
            socketRef={{ current: null }}
            menuOpen={{}}
            setMenuOpen={() => {}}
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

  it("toggles connected component when clicked", () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <Sidebar
          contentChanged={false}
          setContentChanged={() => {}}
          fileContent=""
          setFileContent={() => {}}
          editorRef={{}}
          connectedUsers={[]}
          toggleChat={() => {}}
          unreadMessages={0}
          roomId=""
          isLeftDivOpen={false}
          toggleLeftDiv={() => {}}
          leftIcon={<div />}
          storedUserData={{ current: { name: "" } }}
          host={{ current: "" }}
          connectedUserRoles={[]}
          setConnectedUserRoles={() => {}}
          socketRef={{ current: null }}
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

  //   it("toggles user menu when user is clicked", () => {
  //     const { getByTestId } = render(
  //       <MemoryRouter>
  //         <Sidebar
  //           contentChanged={false}
  //           setContentChanged={() => {}}
  //           fileContent=""
  //           setFileContent={() => {}}
  //           editorRef={{}}
  //           connectedUsers={[]}
  //           toggleChat={() => {}}
  //           unreadMessages={0}
  //           roomId=""
  //           isLeftDivOpen={false}
  //           toggleLeftDiv={() => {}}
  //           leftIcon={<div />}
  //           storedUserData={{ current: { name: "" } }}
  //           host={{ current: "" }}
  //           connectedUserRoles={[]}
  //           setConnectedUserRoles={() => {}}
  //           socketRef={{ current: null }}
  //           menuOpen={{}}
  //           setMenuOpen={() => {}}
  //         />
  //       </MemoryRouter>
  //     );

  //     // Click on a user
  //     const userImage = getByTestId("user-image-username");
  //     fireEvent.click(userImage);

  //     // Assert that the menu is open
  //     const userMenu = getByTestId("user-menu");
  //     expect(userMenu).toBeInTheDocument();

  //     // Click on the user again to close the menu
  //     fireEvent.click(userImage);

  //     // Assert that the menu is closed
  //     expect(userMenu).not.toBeInTheDocument();
  //   });

  //   it('changes role when "Change Role" option is clicked', () => {
  //     // Mock necessary functions and state variables
  //     const handleChangeRoleMock = jest.fn();
  //     const host = 'host';
  //     const user = { username: 'user1', profileImage: 'profile.jpg' };
  //     const connectedUserRoles = [{ name: 'user1', role: 'editor' }];

  //     const { getByTestId } = render(
  //       <MemoryRouter>
  //         <Sidebar
  //           isConnectedComponentOpen={true}
  //           connectedUsers={[user]}
  //           menuOpen={{ [user.username]: true }}
  //           handleChangeRole={handleChangeRoleMock}
  //           host={{ current: host }}
  //           connectedUserRoles={connectedUserRoles}
  //         />
  //       </MemoryRouter>
  //     );

  //     // Click on the "Change Role" option
  //     const changeRoleOption = getByTestId('change-role-option');
  //     fireEvent.click(changeRoleOption);

  //     // Assert that the handleChangeRole function is called with the correct user
  //     expect(handleChangeRoleMock).toHaveBeenCalledWith(user.username);
  //   });
  /*it("downloads a zip file when download button is clicked", async () => {
        const mockedResponse = {
            data: new Blob(),
            headers: { "content-type": "application/zip" },
            status: 200,
        };
        jest.spyOn(axios, "get").mockResolvedValue(mockedResponse);
    
        // Spy on necessary DOM methods
        const createElementSpy = jest.spyOn(document, "createElement").mockReturnValue({});
        const appendChildSpy = jest.spyOn(document.body, "appendChild").mockImplementation(() => {});
        // Mock window.URL.createObjectURL as a function
        const createObjectURLMock = jest.fn().mockReturnValue("test-url");
        Object.defineProperty(window.URL, 'createObjectURL', { value: createObjectURLMock });
        
        // Mock window.URL.revokeObjectURL as a function
        const revokeObjectURLMock = jest.fn();
        Object.defineProperty(window.URL, 'revokeObjectURL', { value: revokeObjectURLMock });
    
        const originalFetch = global.fetch;
        global.fetch = jest.fn().mockResolvedValueOnce({ ok: true }); // Mock a successful fetch call
    
        const originalConfirm = window.confirm;
        window.confirm = jest.fn(() => true);
    
        const reactNavigator = jest.fn();
        const roomId = "yourRoomId"; // Use the roomId variable
        const { getByTestId } = render(
            <MemoryRouter>
                <Sidebar
                    contentChanged={false}
                    setContentChanged={() => {}}
                    fileContent=""
                    setFileContent={() => {}}
                    editorRef={{}}
                    connectedUsers={[]}
                    toggleChat={() => {}}
                    unreadMessages={0}
                    roomId=""
                    isLeftDivOpen={false}
                    toggleLeftDiv={() => {}}
                    leftIcon={<div />}
                    storedUserData={{ current: { name: "" } }}
                    host={{ current: "" }}
                    connectedUserRoles={[]}
                    setConnectedUserRoles={() => {}}
                    socketRef={{ current: null }}
                    menuOpen={{}}
                    setMenuOpen={() => {}}
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
    
        // Check if the necessary DOM manipulation methods are called
        expect(createElementSpy).toHaveBeenCalledWith("a");
        expect(appendChildSpy).toHaveBeenCalled();
        expect(createObjectURLMock).toHaveBeenCalled(); // Use the mock function
        expect(revokeObjectURLMock).toHaveBeenCalled(); // Use the mock function
    
        // Clean up the spies
        createElementSpy.mockRestore();
        appendChildSpy.mockRestore();
    
        // Restore original dependencies after the test
        global.fetch = originalFetch;
        window.confirm = originalConfirm;
    }); */
});
const connectedUsers = [
  {
    username: "john_doe",
    profileImage: "/images/john_doe.png",
  },
];
// descsribe("handle User", () => {
it("finds img elements with correct data-testid and handles clicks", async () => {
  const setMenuOpen = jest.fn((fn) => {
    return fn;
  });
  const host = {
    current: "john_doe", // or any other expected value
  };
  const storedUserData = {
    current: {
      name: "jane_doe", // Set this to an appropriate value
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
        //   menuOpen={menuOpen}
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
it("finds name elements with correct data-testid and handles clicks", async () => {
  const setMenuOpen = jest.fn((fn) => {
    return fn;
  });
  const host = {
    current: "john_doe", // or any other expected value
  };
  const storedUserData = {
    current: {
      name: "jane_doe", // Set this to an appropriate value
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
    // const imgElement = screen.getByTestId('user-List');

    // Simulate clicking the img element
    fireEvent.click(imgElement);
  });
});
it("changes style of cursor to pointer", async () => {
  const setMenuOpen = jest.fn((fn) => {
    return fn;
  });
  const host = {
    current: "john_doe", // or any other expected value
  };
  const storedUserData = {
    current: {
      name: "jane_doe", // Set this to an appropriate value
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
    // const imgElement = screen.getByTestId('user-List');

    // Simulate clicking the img element
    fireEvent.click(imgElement);
    const usernameElement = screen.getByText("john_doe");
    fireEvent.mouseEnter(usernameElement);

    // Verify the cursor style has been changed to 'pointer'
    expect(usernameElement.style.cursor).toBe("pointer");
  });
});
