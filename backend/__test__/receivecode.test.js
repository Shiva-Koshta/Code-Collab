const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const router = require('../routes/endpoints'); // Import the router with the endpoint

// Importing Mongoose and the RoomCodeMap model
const mongoose = require('mongoose');
const RoomCodeMap = require('../models/RoomCodeMap');

// Create an Express app and use the router
const app = express();
app.use(bodyParser.json());
app.use('/', router);

// Mocking the Mongoose functions
jest.mock('../models/RoomCodeMap');

describe('POST /receivecode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('responds with code when roomId exists', async () => {
    // Mock the findOne function of RoomCodeMap model
    RoomCodeMap.findOne.mockResolvedValueOnce({ code: 'mockedCode' });

    // Make the HTTP request to the endpoint
    const response = await request(app)
      .post('/receivecode')
      .send({ roomId: 'existingRoomId' });

    // Assert the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ code: 'mockedCode' });
  });

  it('responds with 404 when roomId does not exist', async () => {
    // Mock the findOne function of RoomCodeMap model
    RoomCodeMap.findOne.mockResolvedValueOnce(null);

    // Make the HTTP request to the endpoint
    const response = await request(app)
      .post('/receivecode')
      .send({ roomId: 'nonExistingRoomId' });

    // Assert the response
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Code not found for the specified room' });
  });

  it('responds with 500 when an error occurs', async () => {
    // Mock an error being thrown
    RoomCodeMap.findOne.mockRejectedValueOnce(new Error('Database error'));

    // Make the HTTP request to the endpoint
    const response = await request(app)
      .post('/receivecode')
      .send({ roomId: 'someRoomId' });

    // Assert the response
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal server error' });
  });
});
