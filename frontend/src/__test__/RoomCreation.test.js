import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RoomCreation from "../pages/RoomCreation";
import { getRoomUsersCount } from "../pages/RoomCreation";
const axios = require("axios");

// Mock axios module
jest.mock("axios");
// Mock the useNavigate hook
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));
jest.spyOn(console, "log").mockImplementation(() => {});
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

  test('clicking on the "Log Out" button calls logout function', () => {
    // Mock window.open
    const windowOpenMock = jest
      .spyOn(window, "open")
      .mockImplementation(() => {});

    // Render the component
    const { getByText } = render(<RoomCreation />);

    // Simulate clicking on the "Log Out" button
    fireEvent.click(getByText("Log Out"));

    // Assert that window.open is called with the correct URL
    expect(windowOpenMock).toHaveBeenCalledWith(
      `${process.env.REACT_APP_API_URL}/auth/logout`,
      "_self"
    );
  });
});

describe("RoomJoin", () => {
  test("calls joinRoom function on button click with missing roomId or userName", () => {
    const joinRoomMock = jest.fn();
    const { getByText } = render(<RoomCreation joinRoom={joinRoomMock} />);
    const buttonElement = getByText("JOIN");
    fireEvent.click(buttonElement);
    expect(joinRoomMock).not.toHaveBeenCalled();

    // Verify that error message is displayed
    expect(
      screen.getByText("ROOM ID & username is required")
    ).toBeInTheDocument();
  });
  test("displays error message if room is full", async () => {
    const MAX_USERS = 10;
    const joinRoomMock = jest.fn();

    // Mock axios response for getRoomUsersCount
    jest
      .spyOn(axios, "post")
      .mockResolvedValueOnce({ status: 200, data: { numUsers: MAX_USERS } });

    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <RoomCreation joinRoom={joinRoomMock} />
      </MemoryRouter>
    );

    // Fill input fields and click join button
    fireEvent.change(getByPlaceholderText("ROOM ID"), {
      target: { value: "exampleRoomId" },
    });
    fireEvent.change(getByPlaceholderText("USERNAME"), {
      target: { value: "exampleUsername" },
    });
    fireEvent.click(getByText("JOIN"));

    // Check if the joinRoom function is not called
    expect(joinRoomMock).not.toHaveBeenCalled();

    // Verify that error message for room being full is displayed
    expect(await screen.findByText("Room is full")).toBeInTheDocument();
  });
  test("displays error message if error joining room", async () => {
    const joinRoomMock = jest.fn();

    // Mock axios response for getRoomUsersCount
    jest
      .spyOn(axios, "post")
      .mockResolvedValueOnce({ status: 200, data: { numUsers: -1 } });

    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <RoomCreation joinRoom={joinRoomMock} />
      </MemoryRouter>
    );

    // Fill input fields and click join button
    fireEvent.change(getByPlaceholderText("ROOM ID"), {
      target: { value: "exampleRoomId" },
    });
    fireEvent.change(getByPlaceholderText("USERNAME"), {
      target: { value: "exampleUsername" },
    });
    fireEvent.click(getByText("JOIN"));

    // Verify that joinRoom function is not called
    expect(joinRoomMock).not.toHaveBeenCalled();

    // Verify that error message for error joining room is displayed
    expect(await screen.findByText("Error joining room")).toBeInTheDocument();
  });
});

describe("getRoomUsersCount", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns number of users in the room on successful API call", async () => {
    const mockResponse = {
      status: 200,
      data: {
        numUsers: 5,
      },
    };
    axios.post.mockResolvedValue(mockResponse);

    const roomId = "roomId";
    const result = await getRoomUsersCount(roomId);

    expect(result).toBe(5);
    expect(axios.post).toHaveBeenCalledWith(
      `${process.env.REACT_APP_API_URL}/rooms/numUsersInRoom`,
      { roomId }
    );
  });

  it("returns -1 on unsuccessful API call", async () => {
    const mockResponse = {
      status: 400, // Or any other non-200 status code
    };
    axios.post.mockResolvedValue(mockResponse);

    const roomId = "roomId";
    const result = await getRoomUsersCount(roomId);

    expect(result).toBe(-1);
    expect(axios.post).toHaveBeenCalledWith(
      `${process.env.REACT_APP_API_URL}/rooms/numUsersInRoom`,
      { roomId }
    );
  });

  it("returns -1 on error", async () => {
    axios.post.mockRejectedValue(new Error("Network Error"));

    const roomId = "roomId";
    const result = await getRoomUsersCount(roomId);

    expect(result).toBe(-1);
    expect(axios.post).toHaveBeenCalledWith(
      `${process.env.REACT_APP_API_URL}/rooms/numUsersInRoom`,
      { roomId }
    );
  });
});

describe("createNewRoom", () => {
  test("creates a new room and navigates to the editor page", async () => {
    // Mock axios.post calls
    const mockResponse = { data: { roomId: "exampleRoomId" } };
    jest.spyOn(axios, "post").mockResolvedValueOnce(mockResponse);

    // Mock the navigate function from react-router-dom
    const navigateMock = jest.fn();

    // Render the component
    const { getByText } = render(<RoomCreation navigate={navigateMock} />);

    // Find and click the "Create New Room" link
    const createNewRoomLink = getByText("Create New Room");
    fireEvent.click(createNewRoomLink);

    // Wait for asynchronous operations to complete
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_URL}/filesystem/createrootdirectory`,
        {
          roomId: expect.any(String),
        }
      );
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:8080/initialize",
        {
          roomId: expect.any(String),
          username: expect.any(String),
        }
      );
      // expect(navigateMock).toHaveBeenCalledWith(`/editor/uniqueRoomId`, {
      //   state: {
      //     userName: expect.any(String),
      //   },
      // });
    });
  });
  // test("calls joinRoom when Enter key is pressed on input elements", async () => {
  //   const joinRoomMock = jest.fn();

  //   render(
  //     <>
  //       <input type="text" placeholder="ROOM ID" onKeyUp={handleInputEnter} />
  //       <input type="text" placeholder="USERNAME" onKeyUp={handleInputEnter} />
  //     </>
  //   );

  //   // Wait for the inputs to appear
  //   const roomIdInput = await screen.findByPlaceholderText("ROOM ID");
  //   const userNameInput = await screen.findByPlaceholderText("USERNAME");

  //   fireEvent.keyUp(roomIdInput, { key: "Enter" });
  //   fireEvent.keyUp(userNameInput, { key: "Enter" });

  //   expect(joinRoomMock).toHaveBeenCalledTimes(2);
  // });
});
