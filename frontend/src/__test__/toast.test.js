import React from "react";
import { render, fireEvent } from "@testing-library/react";
import toast from 'react-hot-toast';
import Home from "../pages/Room_Join";

// Mock the react-router-dom module
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

// Define the mockToast function
const mockToast = jest.fn();
// Mock the toast module
jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: mockToast,
}));

describe("Home component", () => {
  test("displays error toast when ROOM ID and username are empty", () => {
    const { getByText } = render(<Home />);

    // Click the 'Join' button without providing ROOM ID and username
    fireEvent.click(getByText("Join"));

    // Expect toast.error to have been called with the correct message
    expect(mockToast).toHaveBeenCalledWith(
      "ROOM ID & username is required"
    );

    // Expect useNavigate not to have been called
    expect(require("react-router-dom").useNavigate).not.toHaveBeenCalled();
  });
});
