import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Faq from '../pages/Faq';
// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// describe('Faq component', () => {
//   it('renders without crashing', () => {
//     render(
//       <MemoryRouter>
//         <Faq />
//       </MemoryRouter>
//     );
//   });

//   it('navigates to home when ArrowBackIcon is clicked', () => {
//     const { getByTestId } = render(
//       <MemoryRouter>
//         <Faq />
//       </MemoryRouter>
//     );

//     fireEvent.click(getByTestId('ArrowBackIcon'));
//     expect(require('react-router-dom').useNavigate).toHaveBeenCalledWith('/');
//   });

//   it('navigates to home when HomeOutlinedIcon is clicked', () => {
//     const { getByTestId } = render(
//       <MemoryRouter>
//         <Faq />
//       </MemoryRouter>
//     );

//     fireEvent.click(getByTestId('HomeOutlinedIcon'));
//     expect(require('react-router-dom').useNavigate).toHaveBeenCalledWith('/');
//   });
// });
