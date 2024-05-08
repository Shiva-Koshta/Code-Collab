import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // Adjust the import path as necessary
const axios = require("axios");
jest.mock("axios");
// Mock data and functions
const connectedUsers = [
  {
    username: "john_doe",
    profileImage: "/images/john_doe.png",
  },
];

const handleUserMenuToggle = jest.fn();

describe("Sidebar component", () => {
  it("finds img elements with correct data-testid and handles clicks", async () => {
    const setMenuOpen = jest.fn((fn)=>{
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
      // const imgElement = screen.getByTestId('user-List');

      // Simulate clicking the img element
      fireEvent.click(imgElement);
      console.log(
        "handleUserMenuToggle calls:",
        handleUserMenuToggle.mock.calls
      );
      console.log("setMenuOpen calls:", setMenuOpen.mock.calls);

      // Verify that handleUserMenuToggle is called
    //   expect(handleUserMenuToggle).toHaveBeenCalledWith(user.username);

      // Verify that setMenuOpen is called with the correct argument
      //   expect(setMenuOpen).toHaveBeenCalledWith(expect.any(Function));
      //   expect(setMenuOpen.mock.calls[0][0](user)).toHaveBeenCalledWith(user.username);
      // expect(screen.getByTestId('sohell')).toBeInTheDocument();
    });
    console.log("handleUserMenuToggle calls:", handleUserMenuToggle.mock.calls);
    console.log("setMenuOpen calls:", setMenuOpen.mock.calls);
  });
  it("finds name elements with correct data-testid and handles clicks", async () => {
    const setMenuOpen = jest.fn((fn)=>{
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
      console.log(
        "handleUserMenuToggle calls:",
        handleUserMenuToggle.mock.calls
      );
      console.log("setMenuOpen calls:", setMenuOpen.mock.calls);

      // Verify that handleUserMenuToggle is called
    //   expect(handleUserMenuToggle).toHaveBeenCalledWith(user.username);

      // Verify that setMenuOpen is called with the correct argument
      //   expect(setMenuOpen).toHaveBeenCalledWith(expect.any(Function));
      //   expect(setMenuOpen.mock.calls[0][0](user)).toHaveBeenCalledWith(user.username);
      // expect(screen.getByTestId('sohell')).toBeInTheDocument();
    });
    console.log("handleUserMenuToggle calls:", handleUserMenuToggle.mock.calls);
    console.log("setMenuOpen calls:", setMenuOpen.mock.calls);
  });
  it("changes style of cursor to pointer", async () => {
    const setMenuOpen = jest.fn((fn)=>{
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
      const usernameElement = screen.getByText('john_doe');
        
      // Debug log to check the element
      console.log('usernameElement:', usernameElement);
      expect(usernameElement.style.cursor).toBe('');
    
        // Simulate the mouse enter event
        fireEvent.mouseEnter(usernameElement);

        // Verify the cursor style has been changed to 'pointer'
        expect(usernameElement.style.cursor).toBe('pointer');
      console.log(
        "handleUserMenuToggle calls:",
        handleUserMenuToggle.mock.calls
      );
      console.log("setMenuOpen calls:", setMenuOpen.mock.calls);

      // Verify that handleUserMenuToggle is called
    //   expect(handleUserMenuToggle).toHaveBeenCalledWith(user.username);

      // Verify that setMenuOpen is called with the correct argument
      //   expect(setMenuOpen).toHaveBeenCalledWith(expect.any(Function));
      //   expect(setMenuOpen.mock.calls[0][0](user)).toHaveBeenCalledWith(user.username);
      // expect(screen.getByTestId('sohell')).toBeInTheDocument();
    });
    console.log("handleUserMenuToggle calls:", handleUserMenuToggle.mock.calls);
    console.log("setMenuOpen calls:", setMenuOpen.mock.calls);
  });
  it('renders Menu and handles clicks correctly', async () => {
    // Set up the mock props and functions
    const setMenuOpen = jest.fn();
    const host = { current: "john_doe" };
    const storedUserData = { current: { name: "jane_doe" } };
    const connectedUsers = [{ username: "user1" }, { username: "user2" }]; // Define connected users
    const handleChangeRole = jest.fn();

    // Render the Sidebar component with necessary props
    render(
        <MemoryRouter>
            <Sidebar
                isConnectedComponentOpen={true}
                connectedUsers={connectedUsers}
                host={host}
                storedUserData={storedUserData}
                setMenuOpen={setMenuOpen}
                handleChangeRole={handleChangeRole}
                menuOpen={{ user1: true }} // Make sure one user's menu is open
            />
        </MemoryRouter>
    );

    // Check that the Menu component is rendered and has the expected `data-testid`
    const hiddenInput = screen.getByTestId("inside-hello");
    fireEvent.click(hiddenInput);
    const menu = screen.getByTestId('inside-Menu');
    expect(menu).toBeInTheDocument();

    // Check if the user's username is correctly displayed
    const userRoleDiv = screen.getByTestId('sohell');
    expect(userRoleDiv.textContent).toBe('host'); // Adjust based on the expected user role

    // Check for the 'Change Role' button and simulate a click
    if (host.current === storedUserData.current.name) {
        const changeRoleButton = screen.getByTestId('menuitem');
        expect(changeRoleButton).toBeInTheDocument();

        // Simulate a click on the 'Change Role' button
        fireEvent.click(changeRoleButton);

        // Verify that handleChangeRole function was called with the correct argument
        expect(handleChangeRole).toHaveBeenCalledWith('user1'); // Adjust the argument as needed
    }
});
});
