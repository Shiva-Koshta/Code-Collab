const mongoose = require('mongoose');
const RoomCodeMapSchema = require('../models/RoomCodeMap');

// Mock the save method of RoomCodeMap model
RoomCodeMapSchema.prototype.save = jest.fn();

describe('RoomCodeMap Model', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create and save a new room code mapping successfully', async () => {
        // Create a new room code mapping
        const roomCodeData = {
            roomId: 'roomId',
            code: 'roomCode',
        };

        const roomCodeMap = new RoomCodeMapSchema(roomCodeData);

        // Save the room code mapping to the database
        await roomCodeMap.save();

        // Assert that the save method was called with the correct data
        expect(RoomCodeMapSchema.prototype.save).toHaveBeenCalledTimes(1);
        expect(RoomCodeMapSchema.prototype.save).toHaveBeenCalledWith();
    });

    // Add more test cases as needed for other scenarios or edge cases
});
// Mock the deleteOne method of RoomCodeMap model
RoomCodeMapSchema.deleteOne = jest.fn();

describe('RoomCodeMap Model', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should delete a room code mapping successfully', async () => {
        // Define the roomId to be deleted
        const roomIdToDelete = 'roomIdToDelete';

        // Call the deleteOne method with the roomId to delete
        await RoomCodeMapSchema.deleteOne({ roomId: roomIdToDelete });

        // Assert that the deleteOne method was called with the correct parameters
        expect(RoomCodeMapSchema.deleteOne).toHaveBeenCalledTimes(1);
        expect(RoomCodeMapSchema.deleteOne).toHaveBeenCalledWith({ roomId: roomIdToDelete });
    });

    // Add more test cases as needed for other scenarios or edge cases
});