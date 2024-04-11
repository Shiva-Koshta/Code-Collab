import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "../pages/Room_Join";
import toast from "react-hot-toast";
// Mock the react-hot-toast module
jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock the react-router-dom module
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(), // Mock useNavigate
}));

const mockToast = {
  error: jest.fn(),
  success: jest.fn(),
};

describe("Home component", () => {
  test('navigates to About Us page when "About Us" button is clicked', () => {
    const { useNavigate } = require("react-router-dom");
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate); // Mock useNavigate
    const { getByText } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const icon = getByText("About Us");
    fireEvent.click(icon);
    expect(navigate).toHaveBeenCalledWith("/aboutus");
  });

  test('navigates to FAQ page when "FAQ" button is clicked', () => {
    const { useNavigate } = require("react-router-dom");
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate); // Mock useNavigate

    // Render the component with mocked navigate function
    const { getByText } = render(
      <MemoryRouter>
        <Home navigate={navigate} />
      </MemoryRouter>
    );
    const icon = getByText("FAQ");
    fireEvent.click(icon);
    expect(navigate).toHaveBeenCalledWith("/faq");
  });

  test("joins a room with valid room ID and username", async () => {
    const { useNavigate } = require("react-router-dom");
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate); // Mock useNavigate
    const { getByPlaceholderText, getByText } = render(
      <MemoryRouter>
        <Home />
        {/* //<Route path="/editor/:roomId">Editor Page</Route> */}
      </MemoryRouter>
    );

    const roomIdInput = getByPlaceholderText("ROOM ID");
    const usernameInput = getByPlaceholderText("USERNAME");

    fireEvent.change(roomIdInput, { target: { value: "123456" } });
    fireEvent.change(usernameInput, { target: { value: "JohnDoe" } });

    fireEvent.click(getByText("Join"));

    await waitFor(() => {
      expect(window.location.pathname).toBe("/");
    });
  });

  test('displays success message when "Create New Room" is clicked', async () => {
    // Mock useNavigate from react-router-dom
    const { useNavigate } = require("react-router-dom");
    useNavigate.mockReturnValue(jest.fn());
    const { getByText } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    fireEvent.click(getByText("Create New Room"));
    expect(toast.success).toHaveBeenCalledWith("Created a new room");
  });
});

describe("Input fields", () => {
  test("updates room ID input field correctly", () => {
    const { getByPlaceholderText } = render(<Home />);

    // Find the input field by its placeholder text
    const roomIdInput = getByPlaceholderText("ROOM ID");

    // Simulate user input by changing the value of the input field
    fireEvent.change(roomIdInput, { target: { value: "123" } });

    // Assert that the value of the input field has been updated correctly
    expect(roomIdInput.value).toBe("123");
  });

  test("updates username input field correctly", () => {
    const { getByPlaceholderText } = render(<Home />);

    // Find the input field by its placeholder text
    const usernameInput = getByPlaceholderText("USERNAME");

    // Simulate user input by changing the value of the input field
    fireEvent.change(usernameInput, { target: { value: "JohnDoe" } });

    // Assert that the value of the input field has been updated correctly
    expect(usernameInput.value).toBe("JohnDoe");
  });
});
describe("joinRoom function", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mock function calls before each test
  });

  test("displays error toast when ROOM ID and username are empty", () => {
    // Render the component
    const { useNavigate } = require("react-router-dom");
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate); // Mock useNavigate
    const { getByText } = render(<Home />);

    // Click the 'Join' button without providing ROOM ID and username
    fireEvent.click(getByText("Join"));

    // Expect toast.error to have been called with the correct message
    expect(mockToast.error).toHaveBeenCalledWith(
      "ROOM ID & username is required"
    );

    // Expect navigate not to have been called
    expect(navigate).not.toHaveBeenCalled();
  });

  test("redirects to the editor page with the provided ROOM ID and username", () => {
    // Render the component
    const { useNavigate } = require("react-router-dom");
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate); // Mock useNavigate
    const { getByText, getByPlaceholderText } = render(<Home />);

    // Fill in ROOM ID and username
    fireEvent.change(getByPlaceholderText("ROOM ID"), {
      target: { value: "123" },
    });
    fireEvent.change(getByPlaceholderText("USERNAME"), {
      target: { value: "John" },
    });

    // Click the 'Join' button
    fireEvent.click(getByText("Join"));

    // Expect navigate to have been called with the correct URL and state
    expect(navigate).toHaveBeenCalledWith("/editor/123", {
      state: { username: "John" },
    });

    // Expect toast.error not to have been called
    expect(mockToast.error).not.toHaveBeenCalled();
  });
});
// describe('Error toast when fields are empty', () => {
//     test('displays error toast when ROOM ID and USERNAME are empty', () => {
//       // Mock the react-hot-toast module
//       jest.mock('react-hot-toast', () => ({
//         __esModule: true,
//         default: mockToast,
//       }));

//       // Render the component
//       const { getByText } = render(<Home />);

//       // Debugging: Check if the 'Join' button is found
//       console.log('Join button:', getByText('Join'));

//       // Trigger the action that should result in the error toast
//       fireEvent.click(getByText('Join'));

//       // Debugging: Check if the error toast function was called
//       console.log('Error toast calls:', mockToast.error.mock.calls);

//       // Assert that the error toast function was called with the correct message
//       expect(mockToast.error).toHaveBeenCalledWith('ROOM ID & username is require');
//     });
//   });
//   describe('handleInputEnter function', () => {
//     test('calls joinRoom function when Enter key is pressed', () => {
//     const joinRoomMock = jest.fn();
//     const mockEvent = { code: 'Enter' };

//     render(<Home joinRoom={joinRoomMock} />);

//     // Log the input elements to ensure they have the correct event handler
//     const roomIdInput = document.querySelector('.inputBox[placeholder="ROOM ID"]');
//     const usernameInput = document.querySelector('.inputBox[placeholder="USERNAME"]');
//     console.log(roomIdInput);
//     console.log(usernameInput);

//     // Simulate keyUp event with Enter key on the document
//     fireEvent.keyUp(document, mockEvent);

//     // Log the function mock to see if it was called
//     console.log(joinRoomMock.mock);

//     // Assert that joinRoomMock is called
//     expect(joinRoomMock).toHaveBeenCalled();
//   });

//     test('does not call joinRoom function when a key other than Enter is pressed', () => {
//       const joinRoomMock = jest.fn();
//       const mockEvent = { code: 'Space' }; // Example of a key other than Enter

//       render(<Home joinRoom={joinRoomMock} handleInputEnter={Home.handleInputEnter} />);

//       fireEvent.keyUp(document, mockEvent);

//       expect(joinRoomMock).not.toHaveBeenCalled();
//     });
//   });
