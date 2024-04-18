const mongoose = require("mongoose");
const FileNodeSchema = require('../models/FileNode')

const FileNode = mongoose.model('FileNode', FileNodeSchema);

// Function to upload a file
async function uploadFile(name, content, parentId, roomId) {
    const fileNode = new FileNode({ name, type: 'file', content, parent: parentId, roomId });
    await fileNode.save();
    return fileNode;
}

// Function to create a directory
async function createDirectory(name, parentId, roomId, type='directory') {
    const directoryNode = new FileNode({ name, type: type, parent: parentId, roomId });
    await directoryNode.save();
    return directoryNode;
}

async function uploadDirectory(parentId, inputArray, roomId) {

    // helper function
    async function getFolderStructure(directoryId) {
        const stack = []; // Stack to keep track of folders to process
        const root = {}; // Root object for the tree structure
        const visited = new Set(); // Set to keep track of visited nodes
    
        // Start with the root directory
        stack.push({ id: directoryId, node: root });
    
        while (stack.length > 0) {
            const { id, node } = stack.pop();
    
            // Check if the node has already been visited
            if (visited.has(id)) {
                continue;
            }
    
            // Get the node from the database
            const currentNode = await FileNode.findById(id);
    
            // If the node doesn't exist, skip it
            if (!currentNode) {
                continue;
            }
    
            // Add name, _id, and type attributes to the node
            node.name = currentNode.name;
            node._id = currentNode._id;
            node.type = currentNode.type;
    
            // Mark the node as visited
            visited.add(id);
    
            // If the node is a directory, get its children
            if (currentNode.type === 'directory') {
                // Initialize children array for the current directory
                node.children = [];
    
                // Get the children of the current directory
                const children = await FileNode.find({ parent: id });
    
                // Add children to the stack for processing
                for (const child of children) {
                    const childNode = {};
                    node.children.push(childNode);
                    stack.push({ id: child._id, node: childNode });
                }
            }
        }
    
        return root; // Return the children of the root directory
    }

    // main body of uploadFolder function
    let topmostFolderId = null;
    for (const item of inputArray) {
        const pathSegments = item.path.split('/');
        let parent = parentId; // Set parent to parentId for the whole inputArray

        for (let i = 0; i < pathSegments.length; i++) {
            const name = pathSegments[i];
            const isDirectory = (i < pathSegments.length - 1) || item.isDirectory;
            const content = isDirectory ? null : item.content;

            let fileNode = await FileNode.findOne({ name, parent, roomId });

            if (!fileNode) {
                // Create a new FileNode if not found
                if(isDirectory) {
                    fileNode = new FileNode({
                        name,
                        type: isDirectory ? 'directory' : 'file',
                        parent,
                        roomId
                    });
                } else {
                    fileNode = new FileNode({
                        name,
                        type: isDirectory ? 'directory' : 'file',
                        parent,
                        content,
                        roomId
                    });

                }
            } else {
                // Update existing FileNode if found
                fileNode.type = isDirectory ? 'directory' : 'file';
                fileNode.content = content;
            }

            await fileNode.save();

            if (i === 0) {
                topmostFolderId = fileNode._id;
            }

            // Update parent reference for next iteration
            parent = fileNode._id;
        }
    }
    return await getFolderStructure(topmostFolderId);
}

// Function to download a file
async function fetchFile(nodeId) {
    const fileNode = await FileNode.findById(nodeId);
    if (!fileNode || fileNode.type !== 'file') {
        throw new Error('Node not found or is not a file.');
    }
    return fileNode;
}

async function fetchRoot(roomId) {
    const rootNode = await FileNode.findOne({roomId: roomId, type: 'root'});
    if (!rootNode || rootNode.type !== 'root') {
        throw new Error('Root not found or room does not exist.');
    }
    return rootNode;
}

// Add a function to create a root directory for a room
async function createRootDirectory(roomId) {
    // Check if the root directory already exists for the room
    const existingRootDirectory = await FileNode.findOne({ name: 'Root', type: 'root', parent: null, roomId });
    if (existingRootDirectory) {
        // Root directory already exists, no need to create again
        return existingRootDirectory;
    }

    // Create a new root directory node
    const rootDirectory = await createDirectory('Root', null, roomId, 'root');
    return rootDirectory;
}

// get tree structure for the file system of a room
async function generateTree(roomId) {
    // Find the root directory node
    const rootDirectory = await FileNode.findOne({type: 'root', parent: null, roomId });
    if (!rootDirectory) {
        throw new Error('Root directory not found.');
    }

    // Initialize the tree with the root directory
    const tree = { name: rootDirectory.name, type: rootDirectory.type, _id: rootDirectory._id };

    // Stack to keep track of nodes to process
    const stack = [{ node: rootDirectory, parentPath: tree }];

    // Iterate through the stack until it's empty
    while (stack.length > 0) {
        // Pop the top node from the stack
        const { node, parentPath } = stack.pop();

        // Find all child nodes of the current node
        const childNodes = await FileNode.find({ parent: node._id, roomId });

        // Initialize an array to store children nodes
        parentPath.children = [];

        // Iterate over each child node
        for (const childNode of childNodes) {
            // Create a new node object for the child node
            const newNode = { name: childNode.name, type: childNode.type, _id: childNode._id };

            // Push the new node to the parent's children array
            parentPath.children.push(newNode);

            // Push the child node to the stack for further processing
            stack.push({ node: childNode, parentPath: newNode });
        }
    }

    // Return the constructed tree
    return tree;
}

// Function to delete a file
async function deleteFile(nodeId) {
    try {
        const deletedNode = await FileNode.findOneAndDelete({ _id: nodeId });
        // Check if the file node exists
        if (!deletedNode) {
            throw new Error('File node not found.');
        }
        return { success: true, message: 'File deleted successfully.', deletedNode };
    } catch (error) {
        console.error('Error deleting file:', error.message);
        return { success: false, message: 'Failed to delete file.' };
    }
}

// Function to delete a directory
async function deleteDirectory(nodeId) {
    try {
        const deletedNode = await FileNode.findOneAndDelete({ _id: nodeId });
        // Check if the file node exists
        if (!deletedNode) {
            throw new Error('File node not found.');
        }
        return { success: true, message: 'File deleted successfully.', deletedNode };
    } catch (error) {
        console.error('Error deleting file:', error.message);
        return { success: false, message: 'Failed to delete file.' };
    }
}

async function renameFile(nodeId, newName) {
    try {
        // Find the file node by ID and update its name
        const updatedNode = await FileNode.findByIdAndUpdate(
            nodeId,
            { name: newName },
            { new: true } // Return the updated document
        );

        // Check if the file node exists
        if (!updatedNode) {
            throw new Error('File node not found.');
        }
        return { success: true, message: 'File renamed successfully.', updatedNode };

    } catch (error) {
        console.error('Error renaming file:', error.message);
        return { success: false, message: 'Failed to rename file.' };
    }
}

async function renameDirectory(nodeId, newName) {
    try {
        // Find the Directory node by ID and update its name
        const updatedNode = await FileNode.findByIdAndUpdate(
            nodeId,
            { name: newName },
            { new: true } // Return the updated document
        );

        // Check if the Directory node exists
        if (!updatedNode) {
            throw new Error('Directory node not found.');
        }
        return { success: true, message: 'Directory renamed successfully.', updatedNode };

    } catch (error) {
        console.error('Error renaming Directory:', error.message);
        return { success: false, message: 'Failed to rename file.' };
    }
}

module.exports = {
    uploadFile,
    createDirectory,
    uploadDirectory,
    fetchFile,
    createRootDirectory,
    generateTree,
    deleteFile,
    deleteDirectory,
    renameFile,
    renameDirectory,
    fetchRoot
}