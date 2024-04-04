const filesys = require('../services/filesystem.services');


createfile = async(req, res) => {
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
        console.log(responseJSON);    
        res.status(200).json(responseJSON);
    } catch (error) {
        console.log(error)
    }
}
uploadfile = async(req, res) => {
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
    }
}
createdirectory = async(req, res) => {
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
    }
}
createrootdirectory = async(req, res) => {
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
    }

}
fetchfile = async(req, res) => {
    try {
        file = await filesys.fetchFile(req.body.nodeId); 
        responseJSON = {
            message: 'File fetched',
            root: {
                _id: file._id,
                name: file.name,
                type: file.type,
                parent: file.parent,
                content: file.content
            } 
        }    
        res.status(200).json(responseJSON);
    } catch (error) {
        console.log(error)
    }
}
generatetree = async(req, res) => {
    try {
        tree = await filesys.generateTree(req.body.roomId); 
        responseJSON = {
            message: 'File fetched',
            tree: tree,
        }    
        res.status(200).json(responseJSON);
    } catch (error) {
        console.log(error)
    }
}


module.exports = {
    createfile,
    uploadfile,
    createdirectory,
    createrootdirectory,
    generatetree,
    fetchfile,
}