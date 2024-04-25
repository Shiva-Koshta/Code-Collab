const router = require('express').Router();
const filesystem = require('../controllers/filesystem.controller');

router.post('/createfile', filesystem.createfile);
router.post('/uploadfile', filesystem.uploadfile);
router.post('/createdirectory', filesystem.createdirectory);
router.post('/uploaddirectory', filesystem.uploaddirectory);
router.post('/createrootdirectory', filesystem.createrootdirectory);
router.post('/generatetree', filesystem.generatetree);
router.post('/fetchfile', filesystem.fetchfile);
router.delete('/deletefile', filesystem.deletefile);
router.delete('/deletedirectory', filesystem.deletedirectory);
router.put('/renamefile', filesystem.renamefile);
router.put('/renamedirectory', filesystem.renamedirectory);
router.get('/download/:roomId', filesystem.downloadFile);

module.exports = router;