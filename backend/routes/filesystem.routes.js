const router = require('express').Router();
const filesystem = require('../controllers/filesystem.controller');

router.post('/createfile', filesystem.createfile);
router.post('/uploadfile', filesystem.uploadfile);
router.post('/createdirectory', filesystem.createdirectory);
router.post('/createrootdirectory', filesystem.createrootdirectory);
router.post('/generatetree', filesystem.generatetree);
router.post('/fetchfile', filesystem.fetchfile);
router.delete('/deletefile', filesystem.deletefile);
router.delete('/deletedirectory', filesystem.deletedirectory);

module.exports = router;