const mongoose = require("mongoose");
const FileNodeSchema = require('../models/FileNode')
const fs = require('fs');
const archiver = require('archiver');
const FileNode = mongoose.model('FileNode', FileNodeSchema);

/**
 * Uploads a file to the file system.
 * 
 * @param {string} name - The name of the file.
 * @param {Buffer} content - The content of the file.
 * @param {string} parentId - The ID of the parent directory.
 * @param {string} roomId - The ID of the room.
 * @returns {Promise<Object>} The uploaded file node.
 */
async function uploadFile(name, content, parentId, roomId) {
    const fileNode = new FileNode({ name, type: 'file', content, parent: parentId, roomId });
    await fileNode.save();
    return fileNode;
}

/**
 * Creates a directory in the file system.
 * 
 * @param {string} name - The name of the directory.
 * @param {string} parentId - The ID of the parent directory.
 * @param {string} roomId - The ID of the room.
 * @param {string} [type='directory'] - The type of the directory.
 * @returns {Promise<Object>} The created directory node.
 */
async function createDirectory(name, parentId, roomId, type='directory') {
    const directoryNode = new FileNode({ name, type: type, parent: parentId, roomId });
    await directoryNode.save();
    return directoryNode;
}

/**
 * Uploads a directory structure to the file system.
 * 
 * @param {string} parentId - The ID of the parent directory.
 * @param {Array<Object>} inputArray - The array containing directory structure data.
 * @param {string} roomId - The ID of the room.
 * @returns {Promise<Object>} The uploaded directory node.
 * Implementation: Iterates over all the uploaded files and directories similar to DFS and creates a new file or directory node for the same
 */
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

/**
 * Fetches a file from the file system.
 * 
 * @param {string} nodeId - The ID of the file node.
 * @returns {Promise<Object>} The requested file node and its content.
 * @throws {Error} If the node is not found or is not a file.
 */
async function fetchFile(nodeId) {
    const fileNode = await FileNode.findById(nodeId);
    if (!fileNode || fileNode.type !== 'file') {
        throw new Error('Node not found or is not a file.');
    }
    return fileNode;
}

/**
 * Saves content to a file in the file system.
 * 
 * @param {string} nodeId - The ID of the file node.
 * @param {Buffer} content - The content to be saved.
 * @returns {Promise<Object>} The result of the operation (success or failure). Updates the file content in the database.
 */
async function saveFile(nodeId, content)
{
    try {
        // Find the file node by ID and update its content
        const updatedNode = await FileNode.findByIdAndUpdate( nodeId, { content }, { new: true } );
        // Check if the file node exists
        if (!updatedNode) {
            throw new Error('File node not found.');
        }
        return { success: true, message: 'File saved successfully.'};
    } catch (error) {
        return { success: false, message: 'Failed to save file.' };
    }
}

/**
 * Creates a root directory for a room in the file system.
 * 
 * @param {string} roomId - The ID of the room.
 * @returns {Promise<Object>} The created root directory node for a given roomId.
 */
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

/**
 * Generates a tree structure representing the file system of a room.
 * 
 * @param {string} roomId - The ID of the room.
 * @returns {Promise<Object>} The generated tree structure.
 * @throws {Error} If the root directory is not found.
 * Implementation: Retrives all the file or directory nodes for a given roomId. Applying DFS over the file structure, it generates a tree for the file structure
 */
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

/**
 * Deletes a file from the file system.
 * 
 * @param {string} nodeId - The ID of the file node.
 * @returns {Promise<Object>} The result of the operation (success or failure).
 */
async function deleteFile(nodeId) {
    try {
        const deletedNode = await FileNode.findOneAndDelete({ _id: nodeId });
        // Check if the file node exists
        if (!deletedNode) {
            throw new Error('File node not found.');
        }
        return { success: true, message: 'File deleted successfully.', deletedNode };
    } catch (error) {
        return { success: false, message: 'Failed to delete file.' };
    }
}

/**
 * Deletes a directory from the file system.
 * 
 * @param {string} nodeId - The ID of the directory node.
 * @returns {Promise<Object>} The result of the operation (success or failure).
 */
async function deleteDirectory(nodeId) {
    try {
        const deletedNode = await FileNode.findOneAndDelete({ _id: nodeId });
        // Check if the file node exists
        if (!deletedNode) {
            throw new Error('File node not found.');
        }
        return { success: true, message: 'File deleted successfully.', deletedNode };
    } catch (error) {
        return { success: false, message: 'Failed to delete file.' };
    }
}

/**
 * Renames a file in the file system.
 * 
 * @param {string} nodeId - The ID of the file node.
 * @param {string} newName - The new name for the file.
 * @returns {Promise<Object>} The result of the operation (success or failure).
 */
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
        return { success: false, message: 'Failed to rename file.' };
    }
}

/**
 * Renames a directory in the file system.
 * 
 * @param {string} nodeId - The ID of the directory node.
 * @param {string} newName - The new name for the directory.
 * @returns {Promise<Object>} The result of the operation (success or failure).
 */
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
        return { success: false, message: 'Failed to rename file.' };
    }
}

/**
 * Creates a zip file containing the contents of a room's file system.
 * 
 * @param {string} roomId - The ID of the room.
 * @param {Archiver} archive - The Archiver instance for creating the zip file.
 * @returns {Promise<Archiver>} The Archiver instance with the zip file data.
 * @throws {Error} If there is an error creating the zip file.
 * Implementation: 
        Retrives all the files for a given roomId.
        Iterates over all of them similar to DFS and then adds them to the archive output stream.
 */
async function createZipFile(roomId, archive, ) {
    try {
        // Find all folders and files belonging to the specified room ID
        const rootFolder = await FileNode.findOne({ type: 'root', roomId });
        const roomFiles = await FileNode.find({ type: { $in: ['directory', 'file'] }, roomId });
        // const files = await FileNode.find({ type: 'file', roomId });

        let currentPath = ``;
        let currentParent = rootFolder;
        const stack = [{currentParent: currentParent, currentPath: currentPath}];


        while(stack.length > 0) {
            const {currentParent, currentPath} = stack.pop();

            for (const item of roomFiles) {
                if(item.type === 'file' && item.parent.equals(currentParent._id)) {
                    const filename = currentPath + item.name;
                    archive.append(item.content, {name: filename});
                }
    
                if(item.type === 'directory' && item.parent.equals(currentParent._id)) {
                    const foldername = currentPath + `${item.name}/`;
                    archive.append(null, {name: foldername, type: 'directory'});
                    stack.push({currentParent: item, currentPath: foldername});
                }
            }

        }

        // Finalize the archive
        await archive.finalize();

        return archive;

    } catch (error) {
        throw error;
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
    saveFile,
    createZipFile,
}