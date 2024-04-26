const mongoose = require('mongoose');
const { uploadFile, createDirectory, renameDirectory,uploadDirectory, deleteDirectory,renameFile, saveFile ,deleteFile, fetchFile, createRootDirectory, generateTree, createZipFile } = require('../services/filesystem.services');
const FileNodeSchema = require('../models/FileNode');
const fs = require('fs');
const archiver = require('archiver');

// Create a mock model using the schema
const FileNodeModel = mongoose.model('FileNode', FileNodeSchema);

// Mocking the save method of FileNode model
FileNodeModel.prototype.save = jest.fn();

// Mocking the archiver library
jest.mock('archiver');

describe('FileSystem Services', () => {
    describe('uploadFile', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('uploads a file successfully', async () => {
            // Mock data for file upload
            const name = 'testFile.txt';
            const content = 'This is a test file content';
            const parentId = 'parentNodeId';
            const roomId = 'roomId';

            // Call the uploadFile function
            await uploadFile(name, content, parentId, roomId);

            // Assert the behavior of the function
            expect(FileNodeModel.prototype.save).toHaveBeenCalledTimes(1);
        });
    });
    describe('renameDirectory', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
    
        it('renames a directory successfully', async () => {
            // Mock data for directory renaming
            const nodeId = 'directoryId';
            const newName = 'newDirectoryName';
    
            // Mocking the findByIdAndUpdate method of FileNode
            const findByIdAndUpdateMock = jest.spyOn(FileNodeModel, 'findByIdAndUpdate').mockResolvedValue({
                _id: nodeId,
                name: newName,
                type: 'directory',
            });
    
            // Call the renameDirectory function
            const result = await renameDirectory(nodeId, newName);
    
            // Assert the behavior of the function
            expect(findByIdAndUpdateMock).toHaveBeenCalledWith(
                nodeId,
                { name: newName },
                { new: true }
            );
            expect(result.success).toBe(true);
            expect(result.message).toBe('Directory renamed successfully.');
            expect(result.updatedNode._id).toBe(nodeId);
            expect(result.updatedNode.name).toBe(newName);
    
            // Restore the mock
            findByIdAndUpdateMock.mockRestore();
        });
    
        it('throws an error if directory is not found', async () => {
            // Mock data for directory renaming
            const nonExistentNodeId = 'nonExistentNodeId';
            const newName = 'newDirectoryName';
            
            // Mocking the findByIdAndUpdate method of FileNodeModel to return null
            const findByIdAndUpdateMock = jest.spyOn(FileNodeModel, 'findByIdAndUpdate').mockResolvedValue(null);
            
            // Call the renameDirectory function
            const result = await renameDirectory(nonExistentNodeId, newName);
            
            // Assert the behavior of the function
            expect(findByIdAndUpdateMock).toHaveBeenCalledWith(nonExistentNodeId, { name: newName }, { new: true });
            expect(result.success).toBe(false);
            expect(result.message).toBe('Failed to rename file.');
            
            // Restore the mock
            findByIdAndUpdateMock.mockRestore();
        });
        
        
        
    });
    describe('uploadDirectory', () => {
        beforeEach(() => {
            jest.clearAllMocks(); // Clear all mocks before each test
        });
    
        it('uploads a directory successfully', async () => {
            // Mock data for directory upload
            const parentId = 'parentNodeId';
            const roomId = 'roomId';
            const inputArray = [
                { path: 'folder1', isDirectory: true },
                { path: 'folder1/file1.txt', isDirectory: false, content: 'File 1 content' },
                { path: 'folder1/subfolder', isDirectory: true },
                { path: 'folder1/subfolder/file2.txt', isDirectory: false, content: 'File 2 content' },
            ];
    
            // Mock FileNode.findOne method
            const findOneMock = jest.spyOn(FileNodeModel, 'findOne').mockImplementation((query) => {
                const { name, parent, roomId } = query;
                return Promise.resolve({
                    _id: `${name}-${parent}-${roomId}`,
                    name,
                    parent,
                    roomId,
                    type: 'directory', // Ensure type is set correctly
                    save: jest.fn(), // Mock the save method
                });
            });
    
            // Mock FileNode.find method
            const findMock = jest.spyOn(FileNodeModel, 'find').mockImplementation(() => {
                return Promise.resolve([
                    {
                        _id: 'file1-parentNodeId-roomId',
                        name: 'file1.txt',
                        parent: 'folder1-parentNodeId-roomId',
                        roomId: 'roomId',
                        type: 'file', // Ensure type is set correctly
                        save: jest.fn(),
                    },
                    {
                        _id: 'subfolder-parentNodeId-roomId',
                        name: 'subfolder',
                        parent: 'folder1-parentNodeId-roomId',
                        roomId: 'roomId',
                        type: 'directory', // Ensure type is set correctly
                        save: jest.fn(),
                    },
                ]);
            });
    
            // Call the uploadDirectory function
            await uploadDirectory(parentId, inputArray, roomId);
    
            // Assert the behavior of the function
            expect(findOneMock).toHaveBeenCalledTimes(11);
            expect(findMock).toHaveBeenCalledTimes(3);
            // Add additional assertions as needed
        });
    
        it('handles directory children properly', async () => {
            // Mock data for directory with children
            const parentId = 'parentNodeId';
            const roomId = 'roomId';
            const inputArray = [
                { path: 'folder1', isDirectory: true },
                { path: 'folder1/file1.txt', isDirectory: false, content: 'File 1 content' },
                { path: 'folder1/subfolder', isDirectory: true },
                { path: 'folder1/subfolder/file2.txt', isDirectory: false, content: 'File 2 content' },
            ];
    
            // Mock FileNode.findOne and FileNode.find methods
            const findOneMock = jest.spyOn(FileNodeModel, 'findOne').mockResolvedValueOnce({
                _id: 'folder1-parentNodeId-roomId',
                name: 'folder1',
                parent: 'parentNodeId',
                roomId: 'roomId',
                type: 'directory',
                save: jest.fn(),
            });
            const findMock = jest.spyOn(FileNodeModel, 'find').mockResolvedValueOnce([
                {
                    _id: 'file1-parentNodeId-roomId',
                    name: 'file1.txt',
                    parent: 'folder1-parentNodeId-roomId',
                    roomId: 'roomId',
                    type: 'file',
                    save: jest.fn(),
                },
                {
                    _id: 'subfolder-parentNodeId-roomId',
                    name: 'subfolder',
                    parent: 'folder1-parentNodeId-roomId',
                    roomId: 'roomId',
                    type: 'directory',
                    save: jest.fn(),
                },
            ]);
    
            // Call the uploadDirectory function
            await uploadDirectory(parentId, inputArray, roomId);
    
            // Assert the behavior of the function
            expect(findOneMock).toHaveBeenCalledTimes(11);
            expect(findMock).toHaveBeenCalledTimes(3);
            // Add additional assertions as needed
        });
        it('creates a new FileNode if not found', async () => {
            // Mock data for uploadDirectory
            const parentId = 'parentNodeId';
            const roomId = 'roomId';
            const inputArray = [
                { path: 'directory1', isDirectory: true },
                { path: 'file1.txt', isDirectory: false, content: 'File 1 content' },
                { path: 'file2.txt', isDirectory: false, content: 'File 2 content' },
            ];
    
            // Mock findOne to return null for the parent directory
            const findOneMock = jest.spyOn(FileNodeModel, 'findOne').mockResolvedValue(null);
    
            // Call the uploadDirectory function
            await uploadDirectory(parentId, inputArray, roomId);
    
            // Assert the behavior of the function
            // Check if FileNodeModel.save has been called for each item in inputArray
            expect(FileNodeModel.prototype.save).toHaveBeenCalledTimes(inputArray.length);
    
            // Restore mocks
            findOneMock.mockRestore();
        });
    });
    
    describe('renameFile', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('renames a file successfully', async () => {
            // Mock data for file renaming
            const nodeId = 'fileId';
            const newName = 'newFileName';

            // Mocking the findByIdAndUpdate method of FileNode
            const findByIdAndUpdateMock = jest.spyOn(FileNodeModel, 'findByIdAndUpdate').mockResolvedValue({
                _id: nodeId,
                name: newName,
                type: 'file',
            });

            // Call the renameFile function
            const result = await renameFile(nodeId, newName);

            // Assert the behavior of the function
            expect(findByIdAndUpdateMock).toHaveBeenCalledWith(
                nodeId,
                { name: newName },
                { new: true }
            );
            expect(result.success).toBe(true);
            expect(result.message).toBe('File renamed successfully.');
            expect(result.updatedNode._id).toBe(nodeId);
            expect(result.updatedNode.name).toBe(newName);

            // Restore the mock
            findByIdAndUpdateMock.mockRestore();
        });

        it('throws an error if file is not found', async () => {
            // Mock data for file renaming
            const nonExistentNodeId = 'nonExistentFileId';
            const newName = 'newFileName';

            // Mocking the findByIdAndUpdate method of FileNode to return null
            const findByIdAndUpdateMock = jest.spyOn(FileNodeModel, 'findByIdAndUpdate').mockResolvedValue(null);

            // Call the renameFile function
            const result = await renameFile(nonExistentNodeId, newName);

            // Assert the behavior of the function
            expect(findByIdAndUpdateMock).toHaveBeenCalledWith(nonExistentNodeId, { name: newName }, { new: true });
            expect(result).toEqual({ success: false, message: 'Failed to rename file.' });

            // Restore the mock
            findByIdAndUpdateMock.mockRestore();
        });
    });

    describe('deleteDirectory', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('deletes a directory successfully', async () => {
            // Mock data for directory deletion
            const nodeId = 'directoryId';

            // Mocking the findOneAndDelete method of FileNode
            const findOneAndDeleteMock = jest.spyOn(FileNodeModel, 'findOneAndDelete').mockResolvedValue({
                _id: nodeId,
                name: 'deletedDirectory',
                type: 'directory',
            });

            // Call the deleteDirectory function
            const result = await deleteDirectory(nodeId);

            // Assert the behavior of the function
            expect(findOneAndDeleteMock).toHaveBeenCalledWith({ _id: nodeId });
            expect(result.success).toBe(true);
            expect(result.message).toBe('File deleted successfully.');
            expect(result.deletedNode._id).toBe(nodeId);
            expect(result.deletedNode.name).toBe('deletedDirectory');

            // Restore the mock
            findOneAndDeleteMock.mockRestore();
        });

        it('throws an error if directory is not found', async () => {
            // Mock data for directory deletion
            const nonExistentNodeId = 'nonExistentDirectoryId';

            // Mocking the findOneAndDelete method of FileNode to return null
            const findOneAndDeleteMock = jest.spyOn(FileNodeModel, 'findOneAndDelete').mockResolvedValue(null);

            // Call the deleteDirectory function
            const result = await deleteDirectory(nonExistentNodeId);

            // Assert the behavior of the function
            expect(findOneAndDeleteMock).toHaveBeenCalledWith({ _id: nonExistentNodeId });
            expect(result).toEqual({ success: false, message: 'Failed to delete file.' });

            // Restore the mock
            findOneAndDeleteMock.mockRestore();
        });
    });

    describe('saveFile', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('saves a file successfully', async () => {
            // Mock data for file saving
            const nodeId = 'fileId';
            const content = 'New file content';

            // Mocking the findByIdAndUpdate method of FileNode
            const findByIdAndUpdateMock = jest.spyOn(FileNodeModel, 'findByIdAndUpdate').mockResolvedValue({
                _id: nodeId,
                content: content,
            });

            // Call the saveFile function
            const result = await saveFile(nodeId, content);

            // Assert the behavior of the function
            expect(findByIdAndUpdateMock).toHaveBeenCalledWith(
                nodeId,
                { content },
                { new: true }
            );
            expect(result.success).toBe(true);
            expect(result.message).toBe('File saved successfully.');

            // Restore the mock
            findByIdAndUpdateMock.mockRestore();
        });

        it('throws an error if file is not found', async () => {
            // Mock data for file saving
            const nonExistentNodeId = 'nonExistentFileId';
            const content = 'New file content';

            // Mocking the findByIdAndUpdate method of FileNode to return null
            const findByIdAndUpdateMock = jest.spyOn(FileNodeModel, 'findByIdAndUpdate').mockResolvedValue(null);

            // Call the saveFile function
            const result = await saveFile(nonExistentNodeId, content);

            // Assert the behavior of the function
            expect(findByIdAndUpdateMock).toHaveBeenCalledWith(
                nonExistentNodeId,
                { content },
                { new: true }
            );
            expect(result).toEqual({ success: false, message: 'Failed to save file.' });

            // Restore the mock
            findByIdAndUpdateMock.mockRestore();
        });
    });


    describe('deleteFile', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('deletes a file successfully', async () => {
            // Mock data for file deletion
            const nodeId = 'fileId';

            // Mocking the findOneAndDelete method of FileNode
            const findOneAndDeleteMock = jest.spyOn(FileNodeModel, 'findOneAndDelete').mockResolvedValue({
                _id: nodeId,
                name: 'deletedFile',
                type: 'file',
            });

            // Call the deleteFile function
            const result = await deleteFile(nodeId);

            // Assert the behavior of the function
            expect(findOneAndDeleteMock).toHaveBeenCalledWith({ _id: nodeId });
            expect(result.success).toBe(true);
            expect(result.message).toBe('File deleted successfully.');
            expect(result.deletedNode._id).toBe(nodeId);
            expect(result.deletedNode.name).toBe('deletedFile');

            // Restore the mock
            findOneAndDeleteMock.mockRestore();
        });

        it('throws an error if file is not found', async () => {
            // Mock data for file deletion
            const nonExistentNodeId = 'nonExistentFileId';

            // Mocking the findOneAndDelete method of FileNode to return null
            const findOneAndDeleteMock = jest.spyOn(FileNodeModel, 'findOneAndDelete').mockResolvedValue(null);

            // Call the deleteFile function
            const result = await deleteFile(nonExistentNodeId);

            // Assert the behavior of the function
            expect(findOneAndDeleteMock).toHaveBeenCalledWith({ _id: nonExistentNodeId });
            expect(result).toEqual({ success: false, message: 'Failed to delete file.' });

            // Restore the mock
            findOneAndDeleteMock.mockRestore();
        });
    });
    describe('createDirectory', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('creates a directory successfully', async () => {
            // Mock data for directory creation
            const name = 'testDirectory';
            const parentId = 'parentNodeId';
            const roomId = 'roomId';

            // Call the createDirectory function
            await createDirectory(name, parentId, roomId);

            // Assert the behavior of the function
            expect(FileNodeModel.prototype.save).toHaveBeenCalledTimes(1);
        });
    });

    describe('fetchFile', () => {
        it('fetches a file successfully', async () => {
            // Mock data for file fetching
            const fileId = 'fileId';

            // Mocking the findById method of FileNode
            const findByIdMock = jest.spyOn(FileNodeModel, 'findById').mockResolvedValue({
                _id: fileId,
                type: 'file',
                content: Buffer.from('File content'),
            });

            // Call the fetchFile function
            const fileContent = await fetchFile(fileId);

            // Assert the behavior of the function
            expect(findByIdMock).toHaveBeenCalledWith(fileId);
            expect(fileContent.content.toString()).toBe('File content'); // Update this line
            findByIdMock.mockRestore();
            // Restore the mock
            findByIdMock.mockRestore();
        });

        it('throws an error if file is not found', async () => {
            // Mock data for file fetching
            const nonExistentFileId = 'nonExistentFileId';

            // Mocking the findById method of FileNode to return null
            const findByIdMock = jest.spyOn(FileNodeModel, 'findById').mockResolvedValue(null);

            // Call the fetchFile function and expect it to throw an error
            await expect(fetchFile(nonExistentFileId)).rejects.toThrow('Node not found or is not a file.');

            // Assert the behavior of the function
            expect(findByIdMock).toHaveBeenCalledWith(nonExistentFileId);

            // Restore the mock
            findByIdMock.mockRestore();
        });
    });

    describe('createRootDirectory', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('creates a root directory successfully if not exists', async () => {
            // Mock data for root directory creation
            const roomId = 'roomId';

            // Mocking the findOne method of FileNode
            const findOneMock = jest.spyOn(FileNodeModel, 'findOne').mockResolvedValue(null);

            // Mocking the save method of FileNode
            const saveMock = jest.spyOn(FileNodeModel.prototype, 'save').mockResolvedValue({
                _id: 'rootDirectoryId',
                name: 'Root',
                type: 'root',
                roomId: 'roomId',
            });

            // Call the createRootDirectory function
            const rootDirectory = await createRootDirectory(roomId);

            // Assert the behavior of the function
            expect(findOneMock).toHaveBeenCalledWith({ name: 'Root', type: 'root', parent: null, roomId });
            expect(saveMock).toHaveBeenCalledTimes(1);
            expect(rootDirectory.name).toBe('Root');

            // Restore the mocks
            findOneMock.mockRestore();
            saveMock.mockRestore();
        });

        it('returns existing root directory if already exists', async () => {
            // Mock data for root directory creation
            const roomId = 'roomId';

            // Mocking the findOne method of FileNode to return an existing root directory
            const findOneMock = jest.spyOn(FileNodeModel, 'findOne').mockResolvedValue({
                _id: 'existingRootId',
                name: 'Root',
                type: 'root',
                roomId: 'roomId',
            });

            // Call the createRootDirectory function
            const rootDirectory = await createRootDirectory(roomId);

            // Assert the behavior of the function
            expect(findOneMock).toHaveBeenCalledWith({ name: 'Root', type: 'root', parent: null, roomId });
            expect(rootDirectory.name).toBe('Root');

            // Restore the mock
            findOneMock.mockRestore();
        });
    });

    describe('generateTree', () => {
        it('generates tree structure for file system successfully', async () => {
            // Mock data for tree generation
            const roomId = 'roomId';

            // Mocking the findOne and find methods of FileNode
            const findOneMock = jest.spyOn(FileNodeModel, 'findOne').mockResolvedValue({
                _id: 'rootId',
                name: 'Root',
                type: 'root',
                roomId: 'roomId',
            });

            const findMock = jest.spyOn(FileNodeModel, 'find');

            // Mocking the stack data for generating the tree
            const stack = [
                { node: { _id: 'rootId', name: 'Root', type: 'root' }, parentPath: { children: [] } },
                { node: { _id: 'childId', name: 'Child', type: 'directory' }, parentPath: { children: [] } }
            ];

            const stackPop = jest.fn(() => stack.pop());

            // Mocking the FileNode.find method to return child nodes
            findMock.mockImplementationOnce(() => {
                stackPop();
                return [{ _id: 'childId', name: 'Child', type: 'directory' }];
            }).mockImplementation(() => []);

            // Call the generateTree function
            const tree = await generateTree(roomId);

            // Assert the behavior of the function
            expect(findOneMock).toHaveBeenCalledWith({ type: 'root', parent: null, roomId });
            expect(findMock).toHaveBeenCalledWith({ parent: 'rootId', roomId });
            expect(tree.name).toBe('Root');
            expect(tree.children[0].name).toBe('Child');

            // Restore the mocks
            findOneMock.mockRestore();
            findMock.mockRestore();
        });

        it('throws an error if root directory not found', async () => {
            // Mock data for tree generation
            const roomId = 'roomId';

            // Mocking the findOne method of FileNode to return null
            const findOneMock = jest.spyOn(FileNodeModel, 'findOne').mockResolvedValue(null);

            // Call the generateTree function and expect it to throw an error
            await expect(generateTree(roomId)).rejects.toThrow('Root directory not found.');

            // Assert the behavior of the function
            expect(findOneMock).toHaveBeenCalledWith({ type: 'root', parent: null, roomId });

            // Restore the mock
            findOneMock.mockRestore();
        });
    });

    describe('createZipFile', () => {
        it('creates a zip file with folder structure successfully', async () => {
            // Mock data for zip file creation
            const roomId = 'roomId';
            const archive = {
                append: jest.fn(),
                finalize: jest.fn(),
            };
    
            // Mocking the findOne and find methods of FileNode
            const findOneMock = jest.spyOn(FileNodeModel, 'findOne').mockResolvedValue({
                _id: 'rootId',
                type: 'root',
                roomId,
            });
    
          // Inside the test case
const roomFiles = [
    { _id: 'fileId', name: 'File', type: 'file', parent: { equals: jest.fn(id => id === 'rootId') }, content: 'File content' },
    { _id: 'dirId', name: 'Directory', type: 'directory', parent: { equals: jest.fn(id => id === 'rootId') } },
    { _id: 'fileId2', name: 'File2', type: 'file', parent: { equals: jest.fn(id => id === 'dirId') }, content: 'File 2 content' },
];

            const findMock = jest.spyOn(FileNodeModel, 'find').mockResolvedValue(roomFiles);
    
            // Call the createZipFile function
            await createZipFile(roomId, archive);
    
            // Assert the behavior of the function
            expect(findOneMock).toHaveBeenCalledWith({ type: 'root', roomId });
            expect(findMock).toHaveBeenCalledWith({ type: { $in: ['directory', 'file'] }, roomId });
    
            // Assert the append method calls
            expect(archive.append).toHaveBeenCalledWith(null, { name: 'Directory/', type: 'directory' });
            expect(archive.append).toHaveBeenCalledWith('File content', { name: 'File' });
            expect(archive.append).toHaveBeenCalledWith('File 2 content', { name: 'Directory/File2' });
    
            // Assert the finalize method call
            expect(archive.finalize).toHaveBeenCalled();
    
            // Restore mocks
            findOneMock.mockRestore();
            findMock.mockRestore();
        });
        it('throws an error if error occurs during zip file creation', async () => {
            // Mock data for zip file creation
            const roomId = 'roomId';
            const archive = {
                append: jest.fn(),
                finalize: jest.fn(),
            };

            // Mocking the findOne method of FileNode to throw an error
            const findOneMock = jest.spyOn(FileNodeModel, 'findOne').mockRejectedValue(new Error('Error finding root directory'));

            // Call the createZipFile function and expect it to throw an error
            await expect(createZipFile(roomId, archive)).rejects.toThrow('Error finding root directory');

            // Assert the behavior of the function
            expect(findOneMock).toHaveBeenCalledWith({ type: 'root', roomId });

            // Restore the mock
            findOneMock.mockRestore();
        });
    }); 
});
