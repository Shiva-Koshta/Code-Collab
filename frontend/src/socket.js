import { io } from 'socket.io-client';

// Function to get socket instance
export const initSocket = async () => {
  // Options for the socket connection
  const options = {
    'force new connection': true,
    reconnectionAttempt: 'Infinity',
    timeout: 2000,
    transports: ['websocket']
  };

  // Create a new socket connection with the provided options
  const socket = io(process.env.REACT_APP_BACKEND_URL, options);

  // Wait for the socket connection to be established
  await new Promise((resolve, reject) => {
    socket.on('connect', () => {
      console.log('Socket connected');
      resolve();
    });

    socket.on('connect_error', (error) => {
      //console.error('Socket connection error:', error);
      reject(error);
    });
  });

  return socket;
};