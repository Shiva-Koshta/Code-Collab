const router = require('express').Router();
const filesystem = require('../controllers/filesystem.controller');

router.post('/createfile', filesystem.createfile); // Route to create a new file
router.post('/uploadfile', filesystem.uploadfile); // Route to upload a file
router.post('/createdirectory', filesystem.createdirectory); // Route to create a new directory
router.post('/uploaddirectory', filesystem.uploaddirectory); // Route to upload a directory
router.post('/createrootdirectory', filesystem.createrootdirectory); // Route to create a root directory
router.post('/generatetree', filesystem.generatetree); // Route to generate a directory tree
router.post('/fetchfile', filesystem.fetchfile); // Route to fetch a file
router.delete('/deletefile', filesystem.deletefile); // Route to delete a file
router.delete('/deletedirectory', filesystem.deletedirectory); // Route to delete a directory
router.put('/renamefile', filesystem.renamefile); // Route to rename a file
router.put('/renamedirectory', filesystem.renamedirectory); // Route to rename a directory
router.get('/download/:roomId', filesystem.downloadFile); // Route to download files as a ZIP archive

module.exports = router;