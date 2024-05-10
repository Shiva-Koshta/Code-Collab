import { render, screen } from '@testing-library/react';
import axios from 'axios';
import App from '../App';

jest.mock('axios');

describe('App', () => {
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  beforeEach(() => {
    // Mocking the response of axios.get for successful user authentication
    axios.get.mockResolvedValue({
      data: {
        user: {
          _json: {
            // Mock user data
            name: 'Test User',
            email: 'test@example.com'
          }
        }
      }
    });
  });
  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });
  test('renders RoomCreation when user is logged in', async () => {
    // Render the App component
    render(<App />);

    // Wait for the asynchronous useEffect hook to complete
    await screen.findByText(/Create New Room/i);

    // Assert that RoomCreation is rendered when user is logged in
    expect(screen.getByText(/Create New Room/i)).toBeInTheDocument();
  });

  test('renders Login when user is not logged in', async () => {
    // Mock axios.get to simulate user not being logged in
    axios.get.mockRejectedValueOnce({ response: { status: 401 } });

    // Render the App component
    render(<App />);

    // Wait for the asynchronous useEffect hook to complete
    await screen.findByText(/login/i);

    // Assert that Login is rendered when user is not logged in
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });
});
