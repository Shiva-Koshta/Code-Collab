const { stringify } = require('uuid');
const filesys = require('../services/filesystem.services');


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
        console.log(file.content.toString());
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


module.exports = {
    createfile,
    uploadfile,
    createdirectory,
    createrootdirectory,
    generatetree,
    fetchfile,
    deletefile,
    deletedirectory,
    renamefile,
    renamedirectory
}