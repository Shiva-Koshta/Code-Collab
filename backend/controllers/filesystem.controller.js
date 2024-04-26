const { stringify } = require('uuid');
const filesys = require('../services/filesystem.services');
const fs = require('fs');
const archiver = require('archiver');


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
        console.log(error)
        res.status(500).json({ message: 'Error creating file' })
    }
}
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
        console.log(error)
        res.status(500).json({ message: 'Error uploading file' })
    }
}
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
        console.log(error)
        res.status(500).json({ message: 'Error creating directory' })
    }
}
uploaddirectory = async(req, res) => {
    try {
        const treeDir = await filesys.uploadDirectory(req.body.parentId, req.body.data, req.body.roomId);
        responseJSON = {
            message: 'Folder uploaded',
            directory: treeDir,
        }    
        res.status(200).json(responseJSON);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error uploading directory' })
    }
}
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
        console.log(error)
        res.status(500).json({ message: 'Error creating root directory' })
    }

}
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
        // console.log(file.content.toString());
        res.status(200).json(responseJSON);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error fetching file' })
    }
}
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
        console.log(error)
        res.status(500).json({ message: 'Error fetching file' })
    }
}

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
deletedirectory = async(req, res) => {
    if(!req.body.nodeId) 
        return res.status(400).json({ message: 'Please provide all required fields' })
    try {
        dir = await filesys.deleteDirectory(req.body.nodeId);  
        res.status(200).json({ success: true, message: 'Directory deleted successfully.', dir });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error deleting directory' })
    }
}

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
        console.log(error)
        res.status(500).json({ message: 'Error renaming file' })
    }
}
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
        console.log(error)
        res.status(500).json({ message: 'Error renaming directory' })
    }
}

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
                    console.error('Error downloading zip file:', err);
                } else {
                    // Delete the zip file after downloading
                    fs.unlinkSync(zipFilePath);
                }
            });
        });
        
    } catch (error) {
        console.error('Error creating zip file:', error);
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