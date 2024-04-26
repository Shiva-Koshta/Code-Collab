const mongoose = require('mongoose');
const { uploadFile, createDirectory, fetchFile, createRootDirectory, generateTree } = require('../services/filesystem.services');
const FileNodeSchema = require('../models/FileNode');

// Create a mock model using the schema
const FileNodeModel = mongoose.model('FileNode', FileNodeSchema);

// Mocking the save method of FileNode model
FileNodeModel.prototype.save = jest.fn();

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
            expect(fileContent.toString()).toBe('File content');

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
});

