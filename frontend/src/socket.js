// import { io } from 'socket.io-client'

// export const initSocket = async () => {
//   const options = {
//     'force new connection': true,
//     reconnectionAttempt: 'Infinity',
//     timeout: 2000,
//     transports: ['websocket']
//   }
//   return io(process.env.REACT_APP_BACKEND_URL, options)
// }



import { io } from 'socket.io-client';

export const initSocket = async () => {
  const options = {
    'force new connection': true,
    reconnectionAttempt: 'Infinity',
    timeout: 2000,
    transports: ['websocket']
  };

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
