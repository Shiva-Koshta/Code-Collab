import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter
import Faq from "../pages/Faq"; 
import faqData from "../pages/faqdata.json";

// Mock the entire react-router-dom module
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");

  return {
    ...originalModule,
    useNavigate: jest.fn(),
  };
});

describe("Faq component", () => {
  test("renders without crashing", () => {
    render(
      <MemoryRouter>
        <Faq />
      </MemoryRouter>
    );
  });

  test('HomeOutlinedIcon navigates to "/" when clicked', () => {
    const { useNavigate } = require("react-router-dom");
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate); // Mock useNavigate

    const { getByTestId } = render(
      <MemoryRouter>
        <Faq />
      </MemoryRouter>
    );
    const icon = getByTestId("HomeOutlinedIcon");
    fireEvent.click(icon);
    expect(navigate).toHaveBeenCalledWith("/");
  });

  test("renders categories, questions, and toggles answers", () => {
    const { getByText, queryByText } = render(<Faq />);

    // Check if categories are rendered
    faqData.forEach((category) => {
      expect(getByText(category.category)).toBeInTheDocument(); // Check if category title is rendered
    });

    // Click on a category div to toggle questions
    fireEvent.click(getByText(faqData[0].category)); // Click on the first category

    // Check if questions are rendered
    faqData[0].questions.forEach((question) => {
      expect(getByText(question.question)).toBeInTheDocument(); // Check if question is rendered
      expect(getByText(question.answer)).toBeInTheDocument(); // Check if answer is rendered
    });

    // Click on the same category div again to collapse questions
    fireEvent.click(getByText(faqData[0].category)); // Click on the first category again

    // Check if questions are hidden
    faqData[0].questions.forEach((question) => {
      expect(queryByText(question.question)).not.toBeInTheDocument(); // Check if question is not rendered
      expect(queryByText(question.answer)).not.toBeInTheDocument(); // Check if answer is not rendered
    });
  });
});
