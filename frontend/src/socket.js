import { IO } from 'socket.io-client';

export const initSocket = async (): Promise<IO> => {
  const options = {
    forceNew: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    transports: ['websocket'],
  };

  const socket = require('socket.io-client');
  return new Promise((resolve, reject) => {
    const io = socket(process.env.REACT_APP_BACKEND_URL, options);

    io.on('connect', () => {
      console.log('Connected to server');
      resolve(io);
    });

    io.on('connect_error', (error) => {
      console.error('Failed to connect to server:', error);
      reject(error);
    });
  });
};
