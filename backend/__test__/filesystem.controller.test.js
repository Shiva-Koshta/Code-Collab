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
        it('should return 400 and error message if required fields are missing', async () => {
            // Mock request body with missing fields
            const req = {
                body: {} // No fields provided
            };
    
            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            // Call the createFile function
            await filesystemController.createfile(req, res);
    
            // Expectations
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Please provide all required fields' });
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

        it('should return 400 and error message if required fields are missing', async () => {
            // Mock request body with missing fields
            const req = {
                body: {} // No fields provided
            };
    
            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            // Call the uploadFile function
            await filesystemController.uploadfile(req, res);
    
            // Expectations
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Please provide all required fields' });
        });
        it('should return 500 and error message if uploadFile function throws an error', async () => {
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
    
            // Mock the uploadFile function to throw an error
            filesystem.uploadFile = jest.fn().mockRejectedValue(new Error('Error uploading file'));
    
            // Call the createFile function
            await filesystemController.createfile(req, res);
    
            // Expectations
            expect(filesystem.uploadFile).toHaveBeenCalledWith('testFile.txt', '', 'parentId', 'roomId');
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error creating file' });
        });
        it('should return 500 and error message if uploadFile function throws an error', async () => {
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
    
            // Mock the uploadFile function to throw an error
            filesystem.uploadFile = jest.fn().mockRejectedValue(new Error('Error uploading file'));
    
            // Call the uploadfile function
            await filesystemController.uploadfile(req, res);
    
            // Expectations
            expect(filesystem.uploadFile).toHaveBeenCalledWith('testFile.txt', 'fileContent', 'parentId', 'roomId');
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error uploading file' });
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
        it('should return 400 and error message if required fields are missing', async () => {
            // Mock request body with missing fields
            const req = {
                body: {} // No fields provided
            };
    
            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            // Call the createDirectory function
            await filesystemController.createdirectory(req, res);
    
            // Expectations
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Please provide all required fields' });
        });
        it('should return 500 and error message if createDirectory function throws an error', async () => {
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
    
            // Mock the createDirectory function to throw an error
            filesystem.createDirectory = jest.fn().mockRejectedValue(new Error('Error creating directory'));
    
            // Call the createDirectory function
            await filesystemController.createdirectory(req, res);
    
            // Expectations
            expect(filesystem.createDirectory).toHaveBeenCalledWith('testDirectory', 'parentId', 'roomId');
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error creating directory' });
        });
    });

    describe('uploadDirectory', () => {
        it('should upload a directory successfully', async () => {
            // Mock request body
            const req = {
                body: {
                    parentId: 'parentId',
                    data: {} // Mock directory data
                }
            };

            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Mock the uploadDirectory function
            filesystem.uploadDirectory = jest.fn().mockResolvedValue({});

            // Call the uploadDirectory function
            await filesystemController.uploaddirectory(req, res);

            // Expectations
            expect(filesystem.uploadDirectory).toHaveBeenCalledWith('parentId', {}, undefined);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Folder uploaded',
                directory: {}
            });
        });
        it('should return 500 and error message if uploadDirectory function throws an error', async () => {
            // Mock request body
            const req = {
                body: {
                    parentId: 'parentId',
                    data: {} // Mock directory data
                }
            };
    
            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            // Mock the uploadDirectory function to throw an error
            filesystem.uploadDirectory = jest.fn().mockRejectedValue(new Error('Error uploading directory'));
    
            // Call the uploaddirectory function
            await filesystemController.uploaddirectory(req, res);
    
            // Expectations
            expect(filesystem.uploadDirectory).toHaveBeenCalledWith('parentId', {}, undefined);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error uploading directory' });
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
        it('should return 500 and error message if createRootDirectory function throws an error', async () => {
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
    
            // Mock the createRootDirectory function to throw an error
            filesystem.createRootDirectory = jest.fn().mockRejectedValue(new Error('Error creating root directory'));
    
            // Call the createRootDirectory function
            await filesystemController.createrootdirectory(req, res);
    
            // Expectations
            expect(filesystem.createRootDirectory).toHaveBeenCalledWith('roomId');
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error creating root directory' });
        });
        it('should return 400 and error message if required fields are missing', async () => {
            // Mock request body with missing roomId
            const req = {
                body: {}
            };
    
            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            // Call the createRootDirectory function
            await filesystemController.createrootdirectory(req, res);
    
            // Expectations
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Please provide all required fields' });
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
        it('should return 400 and error message if required fields are missing', async () => {
            // Mock request body with missing fields
            const req = {
                body: {} // No fields provided
            };
    
            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            // Call the fetchFile function
            await filesystemController.fetchfile(req, res);
    
            // Expectations
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Please provide all required fields' });
        });

        it('should return 500 and error message if fetchFile function throws an error', async () => {
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
    
            // Mock the fetchFile function to throw an error
            filesystem.fetchFile = jest.fn().mockRejectedValue(new Error('Error fetching file'));
    
            // Call the fetchFile function
            await filesystemController.fetchfile(req, res);
    
            // Expectations
            expect(filesystem.fetchFile).toHaveBeenCalledWith('fileId');
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching file' });
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
        it('should return 400 and error message if required fields are missing', async () => {
            // Mock request body with missing fields
            const req = {
                body: {} // No fields provided
            };
    
            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            // Call the generateTree function
            await filesystemController.generatetree(req, res);
    
            // Expectations
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Please provide all required fields' });
        });

        it('should return 500 and error message if generateTree function throws an error', async () => {
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
    
            // Mock the generateTree function to throw an error
            filesystem.generateTree = jest.fn().mockRejectedValue(new Error('Error generating tree'));
    
            // Call the generateTree function
            await filesystemController.generatetree(req, res);
    
            // Expectations
            expect(filesystem.generateTree).toHaveBeenCalledWith('roomId');
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching file' });
        });
    });

    describe('deleteFile', () => {
        it('should delete a file successfully', async () => {
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

            // Mock the deleteFile function
            filesystem.deleteFile = jest.fn().mockResolvedValue({});

            // Call the deleteFile function
            await filesystemController.deletefile(req, res);

            // Expectations
            expect(filesystem.deleteFile).toHaveBeenCalledWith('fileId');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, message: 'File deleted successfully.', file: {} });
        });
        it('should return 400 and error message if required fields are missing', async () => {
            // Mock request body with missing fields
            const req = {
                body: {} // No fields provided
            };
    
            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            // Call the deleteFile function
            await filesystemController.deletefile(req, res);
    
            // Expectations
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Please provide all required fields' });
        });
        it('should return 500 and error message if deleteFile function throws an error', async () => {
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
    
            // Mock the deleteFile function to throw an error
            filesystem.deleteFile = jest.fn().mockRejectedValue(new Error('Error deleting file'));
    
            // Call the deleteFile function
            await filesystemController.deletefile(req, res);
    
            // Expectations
            expect(filesystem.deleteFile).toHaveBeenCalledWith('fileId');
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('deleteDirectory', () => {
        it('should delete a directory successfully', async () => {
            // Mock request body
            const req = {
                body: {
                    nodeId: 'directoryId'
                }
            };

            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Mock the deleteDirectory function
            filesystem.deleteDirectory = jest.fn().mockResolvedValue({});

            // Call the deleteDirectory function
            await filesystemController.deletedirectory(req, res);

            // Expectations
            expect(filesystem.deleteDirectory).toHaveBeenCalledWith('directoryId');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Directory deleted successfully.', dir: {} });
        });
        it('should return 400 and error message if required fields are missing', async () => {
            // Mock request body with missing fields
            const req = {
                body: {} // No fields provided
            };
    
            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            // Call the deleteDirectory function
            await filesystemController.deletedirectory(req, res);
    
            // Expectations
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Please provide all required fields' });
        });
        it('should return 500 and error message if deleteDirectory function throws an error', async () => {
            // Mock request body
            const req = {
                body: {
                    nodeId: 'directoryId'
                }
            };
    
            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            // Mock the deleteDirectory function to throw an error
            filesystem.deleteDirectory = jest.fn().mockRejectedValue(new Error('Error deleting directory'));
    
            // Call the deleteDirectory function
            await filesystemController.deletedirectory(req, res);
    
            // Expectations
            expect(filesystem.deleteDirectory).toHaveBeenCalledWith('directoryId');
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error deleting directory' });
        });
    });

    describe('renameFile', () => {
        it('should rename a file successfully', async () => {
            // Mock request body
            const req = {
                body: {
                    nodeId: 'fileId',
                    name: 'newName.txt'
                }
            };

            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Mock the renameFile function
            filesystem.renameFile = jest.fn().mockResolvedValue({});

            // Call the renameFile function
            await filesystemController.renamefile(req, res);

            // Expectations
            expect(filesystem.renameFile).toHaveBeenCalledWith('fileId', 'newName.txt');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Renamed file' });
        });
        it('should return 500 and error message if renameFile function throws an error', async () => {
            // Mock request body
            const req = {
                body: {
                    nodeId: 'fileId',
                    name: 'newName.txt'
                }
            };
    
            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            // Mock the renameFile function to throw an error
            filesystem.renameFile = jest.fn().mockRejectedValue(new Error('Error renaming file'));
    
            // Call the renameFile function
            await filesystemController.renamefile(req, res);
    
            // Expectations
            expect(filesystem.renameFile).toHaveBeenCalledWith('fileId', 'newName.txt');
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error renaming file' });
        });
    });

    describe('renameDirectory', () => {
        it('should rename a directory successfully', async () => {
            // Mock request body
            const req = {
                body: {
                    nodeId: 'directoryId',
                    name: 'newDirectoryName'
                }
            };

            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Mock the renameDirectory function
            filesystem.renameDirectory = jest.fn().mockResolvedValue({});

            // Call the renameDirectory function
            await filesystemController.renamedirectory(req, res);

            // Expectations
            expect(filesystem.renameDirectory).toHaveBeenCalledWith('directoryId', 'newDirectoryName');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Rename directory' });
        });
        it('should return 400 and error message if required fields are missing', async () => {
            // Mock request body with missing fields
            const req = {
                body: {} // No fields provided
            };
    
            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            // Call the renameFile function
            await filesystemController.renamefile(req, res);
    
            // Expectations
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Please provide all required fields' });
        });
        it('should return 500 and error message if renameDirectory function throws an error', async () => {
            // Mock request body
            const req = {
                body: {
                    nodeId: 'directoryId',
                    name: 'newDirectoryName'
                }
            };
    
            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            // Mock the renameDirectory function to throw an error
            filesystem.renameDirectory = jest.fn().mockRejectedValue(new Error('Error renaming directory'));
    
            // Call the renameDirectory function
            await filesystemController.renamedirectory(req, res);
    
            // Expectations
            expect(filesystem.renameDirectory).toHaveBeenCalledWith('directoryId', 'newDirectoryName');
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error renaming directory' });
        });
        it('should return 400 and error message if any required field is missing', async () => {
            // Mock request body with missing fields
            const req = {
                body: {} // No nodeId or name provided
            };
    
            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            // Call the renamedirectory function
            await filesystemController.renamedirectory(req, res);
    
            // Expectations
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Please provide all required fields' });
        });
    });

    describe('downloadFile', () => {
        it('should download a file successfully', async () => {
            // Mock request object
            const req = {
                params: {
                    roomId: 'roomId'
                }
            };
    
            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                download: jest.fn().mockImplementation((zipFilePath, callback) => {
                    callback(); // Simulate download completion
                }),
                send: jest.fn()
            };
    
            // Mock fs methods
            const fs = require('fs');
            fs.createWriteStream = jest.fn().mockReturnValue({ on: jest.fn() });
            fs.unlinkSync = jest.fn();
    
            // Mock archiver
            const archiver = require('archiver');
            const archive = {
                pipe: jest.fn(),
            };
            jest.spyOn(archiver, 'create').mockReturnValue(archive);
    
            // Mock filesys.createZipFile
            const filesys = require('../services/filesystem.services');
            filesys.createZipFile = jest.fn().mockResolvedValue(archive);
    
            // Call the downloadFile function
            await filesystemController.downloadFile(req, res);
    
            // Get the callback function passed to output.on('finish')
            const finishCallback = fs.createWriteStream.mock.results[0].value.on.mock.calls.find(call => call[0] === 'finish')[1];
            finishCallback(); // Call the finish callback manually
    
            // Expectations
            expect(res.download).toHaveBeenCalled();
            expect(fs.unlinkSync).toHaveBeenCalled();
        });
        it('should handle errors during zip file creation and send Internal Server Error response', async () => {
            // Mock request object
            const req = {
                params: {
                    roomId: 'roomId'
                }
            };
        
            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                download: jest.fn(),
                send: jest.fn()
            };
        
            // Mock fs methods
            const fs = require('fs');
            fs.createWriteStream = jest.fn().mockReturnValue({ on: jest.fn() });
            fs.unlinkSync = jest.fn();
        
            // Mock archiver
            const archiver = require('archiver');
            const archive = {
                pipe: jest.fn(),
                finalize: jest.fn().mockImplementation(callback => callback())
            };
            jest.spyOn(archiver, 'create').mockReturnValue(archive);
        
            // Mock filesys.createZipFile to throw an error
            const filesys = require('../services/filesystem.services');
            filesys.createZipFile = jest.fn().mockRejectedValue(new Error('Error creating zip file'));
        
            // Call the downloadFile function
            await filesystemController.downloadFile(req, res);
        
            // Expectations
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Internal Server Error');
        });
        
    
        it('should handle errors and send Internal Server Error response', async () => {
            // Mock request object
            const req = {
                params: {
                    roomId: 'roomId'
                }
            };
    
            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                download: jest.fn(),
                send: jest.fn()
            };
    
            // Mock fs methods
            const fs = require('fs');
            fs.createWriteStream = jest.fn().mockReturnValue({ on: jest.fn() });
            fs.unlinkSync = jest.fn();
    
            // Mock archiver
            const archiver = require('archiver');
            const archive = {
                pipe: jest.fn(),
                finalize: jest.fn().mockImplementation(callback => callback())
            };
            jest.spyOn(archiver, 'create').mockReturnValue(archive);
    
            // Mock filesys.createZipFile to throw an error
            const filesys = require('../services/filesystem.services');
            filesys.createZipFile = jest.fn().mockRejectedValue(new Error('Error creating zip file'));
    
            // Call the downloadFile function
            await filesystemController.downloadFile(req, res);
    
            // Expectations
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Internal Server Error');
        });
    });
    it('should return 500 and error message if createZipFile function throws an error', async () => {
        // Mock request object
        const req = {
            params: {
                roomId: 'roomId'
            }
        };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            download: jest.fn(),
            send: jest.fn()
        };

        // Mock fs methods
        const fs = require('fs');
        fs.createWriteStream = jest.fn().mockReturnValue({ on: jest.fn() });
        fs.unlinkSync = jest.fn();

        // Mock archiver
        const archiver = require('archiver');
        const archive = {
            pipe: jest.fn(),
            finalize: jest.fn().mockImplementation(callback => callback())
        };
        jest.spyOn(archiver, 'create').mockReturnValue(archive);

        // Mock filesys.createZipFile to throw an error
        const filesys = require('../services/filesystem.services');
        filesys.createZipFile = jest.fn().mockRejectedValue(new Error('Error creating zip file'));

        // Call the downloadFile function
        await filesystemController.downloadFile(req, res);

        // Expectations
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Internal Server Error');
    });
    it('should handle errors during zip file download and send Internal Server Error response', async () => {
        // Mock request object
        const req = {
            params: {
                roomId: 'roomId'
            }
        };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            download: jest.fn().mockImplementation((zipFilePath, callback) => {
                callback(new Error('Error downloading zip file')); // Simulate error during download
            }),
            send: jest.fn()
        };

        // Call the downloadFile function
        await filesystemController.downloadFile(req, res);

        // Expectations
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Internal Server Error');
    });
});
