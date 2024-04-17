const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const router = require('../endpoints'); // Import the router with the endpoint

// Importing Mongoose and the required models
const mongoose = require('mongoose');
const RoomUserCount = require('../models/RoomUserCount');
const RoomCodeMap = require('../models/RoomCodeMap');

// Create an Express app and use the router
const app = express();
app.use(bodyParser.json());
app.use('/', router);

// Mocking the Mongoose functions
jest.mock('../models/RoomUserCount');
jest.mock('../models/RoomCodeMap');

describe('POST /delete-entry', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete room code map entry when room is found and user count is 0', async () => {
    // Mock the findOne function of RoomUserCount model to return a room with userCount 0
    const mockRoomId = 'mockRoomId';
    RoomUserCount.findOne.mockResolvedValueOnce({ roomId: mockRoomId, userCount: 0 });

    // Mock the findOneAndDelete function of RoomCodeMap model to return the deleted entry
    const deletedEntry = { roomId: mockRoomId, code: 'mockedCode' };
    RoomCodeMap.findOneAndDelete.mockResolvedValueOnce(deletedEntry);

    // Make the HTTP request to the endpoint
    const response = await request(app)
      .post('/delete-entry')
      .send({ roomId: mockRoomId });

    // Assert the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Room code map entry deleted successfully' });
  });

  it('should return 200 with message when room is not found', async () => {
    // Mock the findOne function of RoomUserCount model to return null
    RoomUserCount.findOne.mockResolvedValueOnce(null);

    // Make the HTTP request to the endpoint
    const response = await request(app)
      .post('/delete-entry')
      .send({ roomId: 'nonExistingRoomId' });

    // Assert the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Room not found' });
  });

  it('should return 200 with message when room has users', async () => {
    // Mock the findOne function of RoomUserCount model to return a room with userCount greater than 0
    const mockRoomId = 'mockRoomId';
    RoomUserCount.findOne.mockResolvedValueOnce({ roomId: mockRoomId, userCount: 5 });

    // Make the HTTP request to the endpoint
    const response = await request(app)
      .post('/delete-entry')
      .send({ roomId: mockRoomId });

    // Assert the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'done' });
  });

  it('should return 404 when room code map entry is not found', async () => {
    // Mock the findOne function of RoomUserCount model to return a room with userCount 0
    const mockRoomId = 'mockRoomId';
    RoomUserCount.findOne.mockResolvedValueOnce({ roomId: mockRoomId, userCount: 0 });

    // Mock the findOneAndDelete function of RoomCodeMap model to return null
    RoomCodeMap.findOneAndDelete.mockResolvedValueOnce(null);

    // Make the HTTP request to the endpoint
    const response = await request(app)
      .post('/delete-entry')
      .send({ roomId: mockRoomId });

    // Assert the response
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Room code map entry not found' });
  });

  it('should return 500 when an error occurs', async () => {
    // Mock an error being thrown
    RoomUserCount.findOne.mockRejectedValueOnce(new Error('Database error'));

    // Make the HTTP request to the endpoint
    const response = await request(app)
      .post('/delete-entry')
      .send({ roomId: 'someRoomId' });

    // Assert the response
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal server error' });
  });
});
