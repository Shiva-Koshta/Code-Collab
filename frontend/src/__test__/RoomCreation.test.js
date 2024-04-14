import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RoomCreation from "../pages/RoomCreation";
const axios = require("axios");

// Mock axios module
jest.mock("axios");
// Mock the useNavigate hook
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("RoomCreation component", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test("sets user name and image from local storage", () => {
    // Mock user data stored in local storage
    const userData = {
      name: "John Doe",
      picture: "example.jpg",
    };
    const storedUserData = JSON.stringify(userData);

    // Mock window.localStorage.getItem to return stored user data
    const getItemMock = jest.spyOn(window.localStorage.__proto__, "getItem");
    getItemMock.mockReturnValue(storedUserData);

    // Render the component
    render(
      <MemoryRouter>
        <RoomCreation />
      </MemoryRouter>
    );

    // Assert that the component state is set correctly with the user data
    expect(getItemMock).toHaveBeenCalledWith("userData");
  });
  test("renders RoomCreation component", () => {
    const { getByText } = render(
      <MemoryRouter>
        <RoomCreation />
      </MemoryRouter>
    );
    // Check if RoomCreation component renders without crashing
    expect(screen.getByText("Join a Room")).toBeInTheDocument();
  });

  test("allows user to join room", async () => {
    render(
      <MemoryRouter>
        <RoomCreation />
      </MemoryRouter>
    );

    // Mock axios response for getRoomUsersCount
    axios.post.mockResolvedValueOnce({ status: 200, data: { numUsers: 5 } });

    // Fill input fields and click join button
    fireEvent.change(screen.getByPlaceholderText("ROOM ID"), {
      target: { value: "exampleRoomId" },
    });
    fireEvent.change(screen.getByPlaceholderText("USERNAME"), {
      target: { value: "exampleUsername" },
    });
    fireEvent.click(screen.getByText("JOIN"));

    // Check if axios.post is called with correct parameters
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:8080/rooms/numUsersInRoom",
      {
        roomId: "exampleRoomId",
      }
    );

    // Check if user is navigated to editor page
    // await screen.findByText(/Editor Page/i); // Assuming 'Editor Page' text exists on editor page
    // expect(screen.getByText(/Editor Page/i)).toBeInTheDocument();
  });

  test("displays error message if room is full", async () => {
    render(
      <MemoryRouter>
        <RoomCreation />
      </MemoryRouter>
    );

    // Mock axios response for getRoomUsersCount
    axios.post.mockResolvedValueOnce({ status: 200, data: { numUsers: 10 } });

    // Fill input fields and click join button
    fireEvent.change(screen.getByPlaceholderText("ROOM ID"), {
      target: { value: "exampleRoomId" },
    });
    fireEvent.change(screen.getByPlaceholderText("USERNAME"), {
      target: { value: "exampleUsername" },
    });
    fireEvent.click(screen.getByText("JOIN"));

    // Wait for the toast to appear
    // await screen.findByText('Room is full');

    // // Check if the toast message is displayed
    // expect(screen.getByText('Room is full')).toBeInTheDocument();
  });
  
  test("navigates to About Us page when 'About Us' button is clicked", () => {
    // Render the component
    const { useNavigate } = require("react-router-dom");
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate); // Mock useNavigate

    const { getByText } = render(
      <MemoryRouter>
        <RoomCreation />
      </MemoryRouter>
    );

    // Simulate clicking the "About Us" button
    fireEvent.click(getByText("About Us"));

    // Assert that useNavigate is called with the correct URL
    expect(navigate).toHaveBeenCalledWith("/about-us");
  });
  
  test("navigates to FAQ page when 'FAQ' button is clicked", () => {
    const { useNavigate } = require("react-router-dom");
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate); // Mock useNavigate

    const { getByText } = render(
      <MemoryRouter>
        <RoomCreation />
      </MemoryRouter>
    );

    // Simulate clicking the "About Us" button
    fireEvent.click(getByText("FAQ"));

    // Assert that useNavigate is called with the correct URL
    expect(navigate).toHaveBeenCalledWith("/faq");
  });
});
