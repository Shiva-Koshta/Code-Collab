import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import HelpPage from '../pages/HelpPage'; // Assuming this is your HelpPage component

describe('Routing', () => {
  it('renders HelpPage component when /help URL is called', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/help']}>
        <Routes>
          <Route path="/help" element={<HelpPage />} />
        </Routes>
      </MemoryRouter>
    );
    
    const helpPageElement = getByText('USER MANUAL', { exact: false });
    
    expect(helpPageElement).toBeInTheDocument();
  });
});
