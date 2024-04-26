const filesystem = require('../services/filesystem.services');
const filesystemController = require('../controllers/filesystem.controller');

describe('File System Controller', () => {
    describe('createFile', () => {
        it('should create a new file successfully', async () => {
            // Mock request body
            const req = {
                body: {
                    name: 'testFile.txt',
                    parentId: 'parentId',
                    roomId: 'roomId'
                }
            };

            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Mock the uploadFile function
            filesystem.uploadFile = jest.fn().mockResolvedValue({
                _id: 'fileId',
                name: 'testFile.txt',
                type: 'file',
                parentId: 'parentId'
            });

            // Call the createFile function
            await filesystemController.createfile(req, res);

            // Expectations
            expect(filesystem.uploadFile).toHaveBeenCalledWith('testFile.txt', '', 'parentId', 'roomId');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'File created',
                file: {
                    _id: 'fileId',
                    name: 'testFile.txt',
                    type: 'file',
                    parent: 'parentId'
                }
            });
        });
    });

    describe('uploadFile', () => {
        it('should upload a file successfully', async () => {
            // Mock request body
            const req = {
                body: {
                    name: 'testFile.txt',
                    content: 'fileContent',
                    parentId: 'parentId',
                    roomId: 'roomId'
                }
            };

            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Mock the uploadFile function
            filesystem.uploadFile = jest.fn().mockResolvedValue({
                _id: 'fileId',
                name: 'testFile.txt',
                type: 'file',
                parentId: 'parentId'
            });

            // Call the uploadFile function
            await filesystemController.uploadfile(req, res);

            // Expectations
            expect(filesystem.uploadFile).toHaveBeenCalledWith('testFile.txt', 'fileContent', 'parentId', 'roomId');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'File uploaded',
                file: {
                    _id: 'fileId',
                    name: 'testFile.txt',
                    type: 'file',
                    parent: 'parentId'
                }
            });
        });
    });

    describe('createDirectory', () => {
        it('should create a new directory successfully', async () => {
            // Mock request body
            const req = {
                body: {
                    name: 'testDirectory',
                    parentId: 'parentId',
                    roomId: 'roomId'
                }
            };

            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Mock the createDirectory function
            filesystem.createDirectory = jest.fn().mockResolvedValue({
                _id: 'directoryId',
                name: 'testDirectory',
                type: 'directory',
                parent: 'parentId'
            });

            // Call the createDirectory function
            await filesystemController.createdirectory(req, res);

            // Expectations
            expect(filesystem.createDirectory).toHaveBeenCalledWith('testDirectory', 'parentId', 'roomId');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Directory created',
                directory: {
                    _id: 'directoryId',
                    name: 'testDirectory',
                    type: 'directory',
                    parent: 'parentId'
                }
            });
        });
    });

    describe('createRootDirectory', () => {
        it('should create a new root directory successfully', async () => {
            // Mock request body
            const req = {
                body: {
                    roomId: 'roomId'
                }
            };

            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Mock the createRootDirectory function
            filesystem.createRootDirectory = jest.fn().mockResolvedValue({
                _id: 'rootDirectoryId',
                name: 'Root',
                type: 'directory',
                parent: null
            });

            // Call the createRootDirectory function
            await filesystemController.createrootdirectory(req, res);

            // Expectations
            expect(filesystem.createRootDirectory).toHaveBeenCalledWith('roomId');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Root directory created',
                root: {
                    _id: 'rootDirectoryId',
                    name: 'Root',
                    type: 'directory',
                    parent: null
                }
            });
        });
    });

    describe('fetchFile', () => {
        it('should fetch a file successfully', async () => {
            // Mock request body
            const req = {
                body: {
                    nodeId: 'fileId'
                }
            };

            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Mock the fetchFile function
            filesystem.fetchFile = jest.fn().mockResolvedValue({
                _id: 'fileId',
                name: 'testFile.txt',
                type: 'file',
                parent: 'parentId',
                content: 'fileContent'
            });

            // Call the fetchFile function
            await filesystemController.fetchfile(req, res);

            // Expectations
            expect(filesystem.fetchFile).toHaveBeenCalledWith('fileId');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'File fetched',
                file: {
                    _id: 'fileId',
                    name: 'testFile.txt',
                    type: 'file',
                    parent: 'parentId',
                    content: 'fileContent'
                }
            });
        });
    });

    describe('generateTree', () => {
        it('should generate a tree successfully', async () => {
            // Mock request body
            const req = {
                body: {
                    roomId: 'roomId'
                }
            };

            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Mock the generateTree function
            filesystem.generateTree = jest.fn().mockResolvedValue({
                // Mock tree data
            });

            // Call the generateTree function
            await filesystemController.generatetree(req, res);

            // Expectations
            expect(filesystem.generateTree).toHaveBeenCalledWith('roomId');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'File fetched',
                tree: expect.any(Object) // You can add specific expectations for the tree data if needed
            });
        });
    });

    // Add more test cases for other functions as needed
});
