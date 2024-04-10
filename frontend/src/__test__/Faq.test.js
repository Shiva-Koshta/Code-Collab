import React from "react";
import { render, fireEvent } from "@testing-library/react";

import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter
import Faq from "../pages/Faq"; // Adjust the path as per your project structure

// Mock the entire react-router-dom module
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");

  return {
    ...originalModule,
    useNavigate: jest.fn(),
  };
});

describe("Faq component", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <Faq />
      </MemoryRouter>
    );
  });
});
