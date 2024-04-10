import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import About from '../pages/About';

// Mock the entire react-router-dom module
jest.mock("react-router-dom", () => {
    const originalModule = jest.requireActual("react-router-dom");
  
    return {
      ...originalModule,
      useNavigate: jest.fn(),
    };
  });

describe('About component', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter> {/* Wrap About component with MemoryRouter */}
        <About />
      </MemoryRouter>
    );
  });

  it('displays correct contact information', () => {
    const { getByText } = render(
      <MemoryRouter> {/* Wrap About component with MemoryRouter */}
        <About />
      </MemoryRouter>
    );
    expect(getByText('xyz@gmail.com')).toBeInTheDocument();
    expect(getByText('1234567890')).toBeInTheDocument();
  });
});


describe("Button functionality", () => {
    it('ArrowBackIcon navigates to "/" when clicked', () => {
        const { useNavigate } = require("react-router-dom");
        const navigate = jest.fn();
        useNavigate.mockReturnValue(navigate); // Mock useNavigate
    
        const { getByTestId } = render(
          <MemoryRouter>
            <About />
          </MemoryRouter>
        );
    
        fireEvent.click(getByTestId("ArrowBackIcon"));
        expect(navigate).toHaveBeenCalledWith("/");
      });
    
      it('HomeOutlinedIcon navigates to "/" when clicked', () => {
        const { useNavigate } = require("react-router-dom");
        const navigate = jest.fn();
        useNavigate.mockReturnValue(navigate); // Mock useNavigate
    
        const { getByTestId } = render(
          <MemoryRouter>
            <About />
          </MemoryRouter>
        );
        const icon = getByTestId("HomeOutlinedIcon");
        fireEvent.click(icon);
        expect(navigate).toHaveBeenCalledWith("/");
      });
})