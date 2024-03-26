const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { isURL } = require('validator');

const Schema = mongoose.Schema;

const roomSchema = new Schema({
    roomId: {
        type: String,
        default: uuidv4,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    collaborators: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    files: [{
        name: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true,
            validate: {
                validator: (value) => isURL(value),
                message: 'URL is not valid',
            },
        },
    }],
    chatMessages: [{
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        message: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true,
});

const Room = mongoose.model('Room', room
