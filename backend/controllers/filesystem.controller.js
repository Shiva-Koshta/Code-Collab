const { stringify } = require('uuid');
const filesys = require('../services/filesystem.services');
const fs = require('fs');
const archiver = require('archiver');

/**
 * Controller function to create a file.
 * 
 * @param {Object} req - The HTTP request object containing the file details in the body.
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Response with the newly created file node or error message.
 */
createfile = async(req, res) => {
    if (!req.body.name || !req.body.parentId || !req.body.roomId) 
    return res.status(400).json({ message: 'Please provide all required fields' })
    try {
        file = await filesys.uploadFile(req.body.name, '', req.body.parentId, req.body.roomId)
        responseJSON = {
            message: 'File created',
            file: {
                _id: file._id,
                name: file.name,
                type: file.type,
                parent: file.parentId,
            }
        }     
        res.status(200).json(responseJSON);
    } catch (error) {
        res.status(500).json({ message: 'Error creating file' })
    }
}

/**
 * Controller function to upload a file.
 * 
 * @param {Object} req - The HTTP request object containing the file details in the body.
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Response with the uploaded file node or error message.
 */
uploadfile = async(req, res) => {
    if (!req.body.name || !req.body.content || !req.body.parentId || !req.body.roomId) 
    return res.status(400).json({ message: 'Please provide all required fields' })
    try {
        file = await filesys.uploadFile(req.body.name, req.body.content, req.body.parentId, req.body.roomId)
        responseJSON = {
            message: 'File uploaded',
            file: {
                _id: file._id,
                name: file.name,
                type: file.type,
                parent: file.parentId,
            }
        }     
        res.status(200).json(responseJSON);
    } catch (error) {
        res.status(500).json({ message: 'Error uploading file' })
    }
}

/**
 * Controller function to create a directory.
 * 
 * @param {Object} req - The HTTP request object containing the directory details in the body.
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Response with the newly created directory node or error message.
 */
createdirectory = async(req, res) => {
    if (!req.body.name || !req.body.parentId || !req.body.roomId)
    return res.status(400).json({ message: 'Please provide all required fields' })

    try {
        dir = await filesys.createDirectory(req.body.name, req.body.parentId, req.body.roomId)
        responseJSON = {
            message: 'Directory created',
            directory: {
                _id: dir._id,
                name: dir.name,
                type: dir.type,
                parent: dir.parent,
            }
        }     
        res.status(200).json(responseJSON);
    } catch (error) {
        res.status(500).json({ message: 'Error creating directory' })
    }
}

/**
 * Controller function to upload a directory.
 * 
 * @param {Object} req - The HTTP request object containing the directory details in the body.
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Response with the uploaded directory node or error message.
 */
uploaddirectory = async(req, res) => {
    try {
        const treeDir = await filesys.uploadDirectory(req.body.parentId, req.body.data, req.body.roomId);
        responseJSON = {
            message: 'Folder uploaded',
            directory: treeDir,
        }    
        res.status(200).json(responseJSON);
    } catch (error) {
        res.status(500).json({ message: 'Error uploading directory' })
    }
}

/**
 * Controller function to create a root directory.
 * 
 * @param {Object} req - The HTTP request object containing the room ID in the body.
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Response with the newly created root directory node for the particular room or error message.
 */
createrootdirectory = async(req, res) => {
    if (!req.body.roomId)
    return res.status(400).json({ message: 'Please provide all required fields' })
    try {
        rootDir = await filesys.createRootDirectory(req.body.roomId); 
        responseJSON = {
            message: 'Root directory created',
            root: {
                _id: rootDir._id,
                name: rootDir.name,
                type: rootDir.type,
                parent: rootDir.parent,
            } 
        }    
        res.status(200).json(responseJSON);
    } catch (error) {
        res.status(500).json({ message: 'Error creating root directory' })
    }

}

/**
 * Controller function to fetch a file.
 * 
 * @param {Object} req - The HTTP request object containing the file ID in the body.
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Response with the content of the file requested by the frontend or error message.
 */
fetchfile = async(req, res) => {
    if (!req.body.nodeId) 
    return res.status(400).json({ message: 'Please provide all required fields' })
    try {
        file = await filesys.fetchFile(req.body.nodeId); 
        responseJSON = {
            message: 'File fetched',
            file: {
                _id: file._id,
                name: file.name,
                type: file.type,
                parent: file.parent,
                content: file.content.toString()
            } 
        }    
        res.status(200).json(responseJSON);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching file' })
    }
}

/**
 * Controller function to generate a directory tree.
 * 
 * @param {Object} req - The HTTP request object containing the room ID in the body.
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Response with the directory tree of the particular room or error message.
 */
generatetree = async(req, res) => {
    if (!req.body.roomId)
    return res.status(400).json({ message: 'Please provide all required fields' })
    try {
        tree = await filesys.generateTree(req.body.roomId); 
        responseJSON = {
            message: 'File fetched',
            tree: tree,
        }    
        res.status(200).json(responseJSON);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching file' })
    }
}

/**
 * Controller function to delete a file.
 * 
 * @param {Object} req - The HTTP request object containing the file ID in the body.
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Response with success message on deleting the requested file node from the database or error message.
 */
deletefile = async(req, res) => {
    if(!req.body.nodeId) 
        return res.status(400).json({ message: 'Please provide all required fields' })
    try {
        const file = await filesys.deleteFile(req.body.nodeId);
        res.status(200).json({ success: true, message: 'File deleted successfully.', file });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

/**
 * Controller function to delete a directory.
 * 
 * @param {Object} req - The HTTP request object containing the directory ID in the body.
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Response with success message on deleting the requested directory node from the database or error message.
 */
deletedirectory = async(req, res) => {
    if(!req.body.nodeId) 
        return res.status(400).json({ message: 'Please provide all required fields' })
    try {
        dir = await filesys.deleteDirectory(req.body.nodeId);  
        res.status(200).json({ success: true, message: 'Directory deleted successfully.', dir });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting directory' })
    }
}

/**
 * Controller function to rename a file.
 * 
 * @param {Object} req - The HTTP request object containing the file ID and new name in the body.
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Response with success message on updating the name field of the requested file node or error message.
 */
renamefile = async(req, res) => {
    if(!req.body.nodeId || !req.body.name) 
        return res.status(400).json({ message: 'Please provide all required fields' })
    try {
        file = await filesys.renameFile(req.body.nodeId, req.body.name)
        responseJSON = {
            message: 'Renamed file',
        }     
        res.status(200).json(responseJSON);
    } catch (error) {
        res.status(500).json({ message: 'Error renaming file' })
    }
}

/**
 * Controller function to rename a directory.
 * 
 * @param {Object} req - The HTTP request object containing the directory ID and new name in the body.
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Response with success message on updating the name field of the requested directory node or error message.
 */
renamedirectory = async(req, res) => {
    if(!req.body.nodeId || !req.body.name) 
        return res.status(400).json({ message: 'Please provide all required fields' })
    try {
        dir = await filesys.renameDirectory(req.body.nodeId, req.body.name)
        responseJSON = {
            message: 'Rename directory',
        }     
        res.status(200).json(responseJSON);
    } catch (error) {
        res.status(500).json({ message: 'Error renaming directory' })
    }
}

/**
 * Controller function to download a zip file of the room's contents.
 * 
 * @param {Object} req - The HTTP request object containing the room ID in the params.
 * @param {Object} res - The HTTP response object.
 * @returns {JSON} Response with the created zip file containing all the files and directories of the particular roomId or error message.
 */
downloadFile = async (req, res) => {
    const roomId = req.params.roomId;

    try {
        // Define the path for the zip file
        const zipFilePath = `room_${roomId}_files.zip`;

        // Create a write stream for the zip file
        const output = fs.createWriteStream(zipFilePath);

        // Create a new archiver instance for creating the zip file
        let archive = archiver('zip', {
            zlib: { level: 9 } // Set compression level to maximum
        });

        // Pipe the archive data to the output file
        archive.pipe(output);

        archive = await filesys.createZipFile(roomId, archive);

        output.on("finish", () => {
            // Send the zip file to the client
            res.download(zipFilePath, (err) => {
                if (err) {
                    // console.error('Error downloading zip file:', err);
                } else {
                    // Delete the zip file after downloading
                    fs.unlinkSync(zipFilePath);
                }
            });
        });
        
    } catch (error) {
        // console.error('Error creating zip file:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    createfile,
    uploadfile,
    createdirectory,
    uploaddirectory,
    createrootdirectory,
    generatetree,
    fetchfile,
    deletefile,
    deletedirectory,
    renamefile,
    renamedirectory,
    downloadFile,
}