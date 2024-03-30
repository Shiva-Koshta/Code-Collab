const filesys = require('../services/filesystem.services')

uploadfile = async(req, res) => {
    return await filesys.uploadFile()
}
createdirectory = async(req, res) => {
    return await filesys.createDirectory()
}
createrootdirectory = async(req, res) => {
    return await filesys.createRootDirectory()
}
generatetree = async(req, res) => {
    return await filesys.generateTree()
}
fetchfile = async(req, res) => {
    return await filesys.fetchFile()
}


module.exports = {
    uploadfile,
    createdirectory,
    createrootdirectory,
    generatetree,
    fetchfile,
}