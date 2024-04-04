import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route, useNavigate } from "react-router-dom";
import HelpPage from "../pages/HelpPage"; // Assuming this is your HelpPage component
import LoginDemo from "../images/LoginDemo.png";
import SignUp from "../images/SignUp.png";
import Password from "../images/Password.png";
import Room from "../images/Room.png";
import RoomCreation from "../images/RoomCreation.png";
import ChatBox from "../images/ChatBox.png";

// Mock matchMedia before importing React or any other modules
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated, but still used by some libraries
    removeListener: jest.fn(), // Deprecated, but still used by some libraries
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe("Routing", () => {
  it("renders HelpPage component when /help URL is called", () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={["/help"]}>
        <Routes>
          <Route path="/help" element={<HelpPage />} />
        </Routes>
      </MemoryRouter>
    );

    const helpPageElement = getByText("USER MANUAL", { exact: false });

    expect(helpPageElement).toBeInTheDocument();
  });
});

describe("Image rendering", () => {
  it("renders LoginDemo image", () => {
    const { getByAltText } = render(<img src={LoginDemo} alt="Login Demo" />);
    expect(getByAltText("Login Demo")).toBeInTheDocument();
  });

  it("renders Password image", () => {
    const { getByAltText } = render(<img src={Password} alt="Sign Up" />);
    expect(getByAltText("Sign Up")).toBeInTheDocument();
  });

  it("renders Room image", () => {
    const { getByAltText } = render(<img src={Room} alt="Sign Up" />);
    expect(getByAltText("Sign Up")).toBeInTheDocument();
  });

  it("renders RoomCreation image", () => {
    const { getByAltText } = render(<img src={RoomCreation} alt="Sign Up" />);
    expect(getByAltText("Sign Up")).toBeInTheDocument();
  });

  it("renders Chatbox image", () => {
    const { getByAltText } = render(<img src={ChatBox} alt="Sign Up" />);
    expect(getByAltText("Sign Up")).toBeInTheDocument();
  });

  it("renders SignUp image", () => {
    const { getByAltText } = render(<img src={SignUp} alt="Sign Up" />);
    expect(getByAltText("Sign Up")).toBeInTheDocument();
  });
});

// Mock the entire react-router-dom module
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");

  return {
    ...originalModule,
    useNavigate: jest.fn(),
  };
});

describe("Button functionality", () => {
  it("navigates to login page on button click", () => {
    const { useNavigate } = require("react-router-dom");
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate); // Mock useNavigate

    const { getByText } = render(
      <MemoryRouter>
        <HelpPage />
      </MemoryRouter>
    );

    const button = getByText("Back to Login");
    fireEvent.click(button);

    expect(navigate).toHaveBeenCalledWith("/login");
  });

  it("renders Submit button when not submitting", () => {
    const { useNavigate } = require("react-router-dom");
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate); // Mock useNavigate

    const { getByText } = render(
      <MemoryRouter>
        <HelpPage />
      </MemoryRouter>
    );
    const submitButton = getByText("Submit");
    expect(submitButton).toBeInTheDocument();
  });
});

describe("Form functionality", () => {
  it("submits the form successfully", async () => {
    // Mock fetch to return a successful response
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
    });

    // Render the component with the form
    const { getByText } = render(
      <MemoryRouter>
        {" "}
        {/* Wrap your component with MemoryRouter */}
        <HelpPage />
      </MemoryRouter>
    );

    // Click the submit button
    fireEvent.click(getByText("Submit"));

    // Wait for a certain period of time for the toast message to appear
    await waitFor(() => {
      // Assert that the form submission message appears
      expect(getByText("Form submitted successfully")).toBeInTheDocument();

      // Assert that fetch was called with the correct URL and payload
      expect(global.fetch).toHaveBeenCalledWith("http://localhost:8080/help", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "",
          email: "",
          message: "",
        }),
      });
    });
  });

    it('handles form submission failure', async () => {
      // Mock fetch to return a failed response
      jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
      });

      // Render the component with the form
      const { getByLabelText, getByText } = render(
        <HelpPage />
      );

      // Fill out the form fields
      fireEvent.change(getByLabelText('Name'), { target: { value: 'John' } });
      fireEvent.change(getByLabelText('Email'), { target: { value: 'john@example.com' } });
      fireEvent.change(getByLabelText('Message'), { target: { value: 'Hello, World!' } });

      // Submit the form
      userEvent.click(getByText('Submit'));

      // Assert that the form submission failure message appears
      await waitFor(() => expect(getByText('Form submission failed')).toBeInTheDocument());
    });

    it('handles form submission error', async () => {
      // Mock fetch to throw an error
      jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network Error'));

      // Render the component with the form
      const { getByLabelText, getByText } = render(
        <HelpPage />
      );

      // Fill out the form fields
      fireEvent.change(getByLabelText('Name'), { target: { value: 'John' } });
      fireEvent.change(getByLabelText('Email'), { target: { value: 'john@example.com' } });
      fireEvent.change(getByLabelText('Message'), { target: { value: 'Hello, World!' } });

      // Submit the form
      userEvent.click(getByText('Submit'));

      // Assert that the form submission error message appears
      await waitFor(() => expect(getByText('An error occurred while submitting the form')).toBeInTheDocument());
    });
});
