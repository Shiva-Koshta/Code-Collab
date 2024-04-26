import { initSocket } from '../socket'; // Assuming this file is in the same directory

// Mocking the socket.io-client module
jest.mock('socket.io-client', () => {
    const onMock = jest.fn();
    return {
      io: jest.fn((url, options) => ({
        on: onMock,
      })),
      __onMock: onMock, // Expose the mock for assertion purposes
    };
  });
  
  describe('initSocket', () => {
    it('should initialize socket connection with correct options', async () => {
      process.env.REACT_APP_BACKEND_URL = 'http://example.com';
  
      const socket = await initSocket();
  
      // Assert that the io function was called with the correct URL and options
      expect(require('socket.io-client').io).toHaveBeenCalledWith(
        'http://example.com',
        {
          'force new connection': true,
          reconnectionAttempt: 'Infinity',
          timeout: 2000,
          transports: ['websocket'],
        }
      );
  
      // Additional assertion on whether the 'on' method is called correctly
      expect(socket.on).toHaveBeenCalledWith('connect', expect.any(Function));
    });
  });
  