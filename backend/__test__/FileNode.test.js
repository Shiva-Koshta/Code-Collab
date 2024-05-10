const mongoose = require('mongoose');
const FileNodeSchema = require('../models/FileNode');

// Create a mock model using the schema
const FileNodeModel = mongoose.model('FileNode', FileNodeSchema);

// Mocking the save method of FileNode model
FileNodeModel.prototype.save = jest.fn();

describe('FileNode Model', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create and save a new file node successfully', async () => {
        // Create a new file node
        const fileNodeData = {
            name: 'testFile.txt',
            type: 'file',
            content: Buffer.from('This is a test file content'),
            parent: null,
            roomId: 'roomId',
        };

        const fileNode = new FileNodeModel(fileNodeData);

        // Save the file node to the database
        await fileNode.save();

        // Assert that the save method was called with the correct data
        expect(FileNodeModel.prototype.save).toHaveBeenCalledTimes(1);
        expect(FileNodeModel.prototype.save).toHaveBeenCalledWith();
    });

    it('should create and save a new directory node successfully', async () => {
        // Create a new directory node
        const directoryNodeData = {
            name: 'testDirectory',
            type: 'directory',
            parent: null,
            roomId: 'roomId',
        };

        const directoryNode = new FileNodeModel(directoryNodeData);

        // Save the directory node to the database
        await directoryNode.save();

        // Assert that the save method was called with the correct data
        expect(FileNodeModel.prototype.save).toHaveBeenCalledTimes(1);
        expect(FileNodeModel.prototype.save).toHaveBeenCalledWith();
    });

    // Add more test cases as needed for other scenarios or edge cases
});
describe('FileNode Model', () => {
  beforeEach(() => {
      jest.clearAllMocks();
  });

  it('should create and save a new root directory node successfully', async () => {
      // Create a new root directory node
      const rootDirectoryData = {
          name: 'Root',
          type: 'root',
          parent: null,
          roomId: 'roomId',
      };

      const rootDirectoryNode = new FileNodeModel(rootDirectoryData);

      // Save the root directory node to the database
      await rootDirectoryNode.save();

      // Assert that the save method was called with the correct data
      expect(FileNodeModel.prototype.save).toHaveBeenCalledTimes(1);
      expect(FileNodeModel.prototype.save).toHaveBeenCalledWith();
  });

  it('should fetch a file node by its ID successfully', async () => {
      // Mock data for file node fetching
      const fileId = 'fileId';
      const fileContent = 'File content';

      // Mock the findById method of FileNodeModel to return the file node
      const findByIdMock = jest.spyOn(FileNodeModel, 'findById').mockResolvedValueOnce({
          _id: fileId,
          type: 'file',
          content: Buffer.from(fileContent),
      });

      // Call the fetchFile function
      const fetchedFile = await FileNodeModel.findById(fileId);

      // Assert the behavior of the function
      expect(fetchedFile).toBeDefined();
      expect(fetchedFile._id).toBe(fileId);
      expect(fetchedFile.type).toBe('file');
      expect(fetchedFile.content.toString()).toBe(fileContent);

      // Restore the mock
      findByIdMock.mockRestore();
  });

  it('should return null when fetching a non-existent file node by its ID', async () => {
      // Mock data for non-existent file node fetching
      const nonExistentFileId = 'nonExistentFileId';

      // Mock the findById method of FileNodeModel to return null
      const findByIdMock = jest.spyOn(FileNodeModel, 'findById').mockResolvedValueOnce(null);

      // Call the fetchFile function
      const fetchedFile = await FileNodeModel.findById(nonExistentFileId);

      // Assert the behavior of the function
      expect(fetchedFile).toBeNull();

      // Restore the mock
      findByIdMock.mockRestore();
  });

  // Add more test cases as needed for other scenarios or edge cases
});
