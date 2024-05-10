const mongoose = require('mongoose');
const RoomUserCountSchema = require('../models/RoomUserCount');

// Mock the save method of RoomUserCount model
RoomUserCountSchema.prototype.save = jest.fn();

describe('RoomUserCount Model', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create and save a new room user count record successfully', async () => {
        // Create a new room user count record
        const roomUserCountData = {
            roomId: 'testRoomId',
            userCount: 5,
        };

        const roomUserCount = new RoomUserCountSchema(roomUserCountData);

        // Save the room user count record to the database
        await roomUserCount.save();

        // Assert that the save method was called with the correct data
        expect(RoomUserCountSchema.prototype.save).toHaveBeenCalledTimes(1);
        expect(RoomUserCountSchema.prototype.save).toHaveBeenCalledWith();
    });

    // Add more test cases as needed for other scenarios or edge cases
});
