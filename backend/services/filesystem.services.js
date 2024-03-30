const mongoose = require("mongoose");

const FileNode = mongoose.model('FileNode', FileNodeSchema);

// Function to upload a file
async function uploadFile(name, content, parentId, roomId) {
    const fileNode = new FileNode({ name, type: 'file', content, parent: parentId, roomId });
    await fileNode.save();
    return fileNode;
}

// Function to create a directory
async function createDirectory(name, parentId, roomId) {
    const directoryNode = new FileNode({ name, type: 'directory', parent: parentId, roomId });
    await directoryNode.save();
    return directoryNode;
}

// Function to download a file
async function fetchFile(nodeId) {
    const fileNode = await FileNode.findById(nodeId);
    if (!fileNode || fileNode.type !== 'file') {
        throw new Error('Node not found or is not a file.');
    }
    return fileNode.content;
}

// Add a function to create a root directory for a room
async function createRootDirectory(roomId) {
    // Check if the root directory already exists for the room
    const existingRootDirectory = await FileNode.findOne({ name: 'Root', type: 'directory', parent: null, roomId });
    if (existingRootDirectory) {
        // Root directory already exists, no need to create again
        return existingRootDirectory;
    }

    // Create a new root directory node
    const rootDirectory = await createDirectory('Root', null, roomId);

    return rootDirectory;
}

// get tree structure for the file system of a room
async function generateTree(roomId) {
    // Find the root directory node
    const rootDirectory = await FileNode.findOne({ name: 'Root', type: 'directory', parent: null, roomId });
    if (!rootDirectory) {
        throw new Error('Root directory not found.');
    }

    // Initialize the tree with the root directory and its ObjectId
    const tree = { [rootDirectory.name]: { _id: rootDirectory._id } };

    // Stack to keep track of nodes to process
    const stack = [{ node: rootDirectory, parentPath: tree[rootDirectory.name] }];

    // Iterate through the stack until it's empty
    while (stack.length > 0) {
        // Pop the top node from the stack
        const { node, parentPath } = stack.pop();

        // Find all child nodes of the current node
        const childNodes = await FileNode.find({ parent: node._id, roomId });

        // Iterate over each child node
        for (const childNode of childNodes) {
            // If the child node is a directory
            if (childNode.type === 'directory') {
                // Add the directory to the parent's tree with its ObjectId
                parentPath[childNode.name] = { _id: childNode._id };
                // Push the directory node to the stack for further processing
                stack.push({ node: childNode, parentPath: parentPath[childNode.name] });
            } else {
                // If the child node is a file, add it directly to the parent's tree with its ObjectId
                parentPath[childNode.name] = { _id: childNode._id };
                // Or you can set it to the file's metadata
            }
        }
    }

    // Return the constructed tree
    return tree;
}

module.exports = {
    uploadFile,
    createDirectory,
    fetchFile,
    createRootDirectory,
    generateTree,
}