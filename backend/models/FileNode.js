const mongoose = require('mongoose');

const FileNodeSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Name of the file or directory
    type: { type: String, enum: ['file', 'directory'], required: true }, // Type of node: 'file' or 'directory'
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'FileNode' }, // Reference to the parent node
    content: { type: Buffer }, // Buffer to store file content (only for file nodes)
    roomId: { type: String, required: true }, // Room ID associated with the file node
});

module.exports = FileNodeSchema;