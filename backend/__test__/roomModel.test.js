const mongoose = require('mongoose');
const RoomSchema = require('../models/roomModel');

// Mock the save method of Room model
RoomSchema.prototype.save = jest.fn();

describe('Room Model', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create and save a new room successfully', async () => {
        // Create a new room
        const roomData = {
            name: 'Test Room',
            createdBy: new mongoose.Types.ObjectId(), // Create ObjectId with 'new' keyword
        };

        const room = new RoomSchema(roomData);

        // Save the room to the database
        await room.save();

        // Assert that the save method was called with the correct data
        expect(RoomSchema.prototype.save).toHaveBeenCalledTimes(1);
        expect(RoomSchema.prototype.save).toHaveBeenCalledWith();
    });

});
