import { initSocket } from '../socket';

const io = require('socket.io-client');
jest.mock('socket.io-client');

describe('initSocket', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock function call history after each test
  });

  test('initializes socket connection with provided options', async () => {
    const mockSocket = {
      on: jest.fn(),
    };

    // Mock the 'io' function to return a mock socket instance
    io.mockReturnValue(mockSocket);

    const fakeUrl = `${process.env.REACT_APP_API_URL}`;
    const fakeOptions = {
      'force new connection': true,
      reconnectionAttempt: 'Infinity',
      timeout: 2000,
      transports: ['websocket'],
    };

    // Create a mock implementation for the 'on' method of mockSocket
    mockSocket.on.mockImplementation((eventName, callback) => {
      if (eventName === 'connect') {
        // Simulate the socket connection being established
        callback();
      }
    });

    await initSocket();

    // Ensure that the 'io' function is called with the correct URL and options
    expect(io).toHaveBeenCalledWith(fakeUrl, fakeOptions);

    // Ensure that the 'connect' event handler is added
    expect(mockSocket.on).toHaveBeenCalledWith('connect', expect.any(Function));
    // Ensure that the 'connect_error' event handler is added
    expect(mockSocket.on).toHaveBeenCalledWith('connect_error', expect.any(Function));
  });

  test('handles connection errors', async () => {
    const mockSocket = {
      on: jest.fn(),
    };

    io.mockReturnValue(mockSocket);

    // Mock a connection error
    const error = new Error('Connection error');
    mockSocket.on.mockImplementation((event, callback) => {
      if (event === 'connect_error') {
        callback(error);
      }
    });

    await expect(initSocket()).rejects.toThrow('Connection error');
  });
});
