import SoundsService from '../sounds.service';
import Sound from '../Sound.model';
import { ObjectId } from 'mongodb';
import { CreateSoundInput } from '../Sound.model';
import * as s3Service from '../../services/s3.service';

// Create mock IDs first
const mockObjectId = new ObjectId();
const mockUserId = new ObjectId();

// Mock S3 service
jest.mock('../../services/s3.service', () => ({
  deleteObject: jest.fn().mockResolvedValue(undefined),
}));

// Create mock sound data
const mockSoundData = {
  _id: mockObjectId,
  title: 'Test Sound',
  description: 'Test Description',
  metadata: {
    s3Key: 'test-key',
    bucketName: 'test-bucket',
    fileType: 'audio/mp3',
    fileSize: 1000,
  },
  user: mockUserId,
};

// Mock Sound model
jest.mock('../Sound.model', () => {
  const findById = jest.fn() as jest.Mock & { populate: jest.Mock };
  const find = jest.fn() as jest.Mock & { populate: jest.Mock };
  const findByIdAndDelete = jest.fn() as jest.Mock;
  const populate = jest.fn() as jest.Mock;
  const save = jest.fn() as jest.Mock;

  // Create a chainable query object
  const createChainableQuery = (resolveValue: any) => ({
    populate: jest.fn().mockResolvedValue(resolveValue),
  });

  const MockSound = jest.fn().mockImplementation((data) => ({
    ...data,
    _id: mockObjectId,
    save,
  })) as jest.Mock & {
    findById: typeof findById;
    find: typeof find;
    findByIdAndDelete: typeof findByIdAndDelete;
    populate: typeof populate;
  };

  MockSound.findById = findById;
  MockSound.find = find;
  MockSound.findByIdAndDelete = findByIdAndDelete;
  MockSound.populate = populate;

  return {
    __esModule: true,
    default: MockSound as unknown as typeof Sound,
  };
});

describe('Sounds Service', () => {
  // Helper function to create chainable queries
  const createChainableQuery = (resolveValue: any) => ({
    populate: jest.fn().mockResolvedValue(resolveValue),
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createSound', () => {
    it('should create a new sound', async () => {
      const userId = mockUserId;
      const soundData: CreateSoundInput = {
        title: 'Test Sound',
        description: 'Test Description',
        metadata: {
          s3Key: 'test-key',
          bucketName: 'test-bucket',
          fileType: 'audio/mp3',
          fileSize: 1000,
        },
      };

      const mockSound = {
        _id: mockObjectId,
        ...soundData,
        user: userId,
      };

      const mockSoundWithUser = {
        ...mockSound,
        user: {
          _id: userId,
          username: 'testuser',
          email: 'test@example.com',
        },
      };

      // Mock save to return the sound
      const mockSave = jest.fn().mockResolvedValue(mockSound);
      (Sound as unknown as jest.Mock).mockImplementation((data) => ({
        ...data,
        _id: mockObjectId,
        save: mockSave,
      }));

      // Mock findById().populate() to return the populated sound
      (Sound.findById as jest.Mock).mockImplementation(() =>
        createChainableQuery(mockSoundWithUser)
      );

      const result = await SoundsService.createSound(soundData, userId);

      // Verify the Sound constructor was called with correct data
      expect(Sound).toHaveBeenCalledWith({
        description: soundData.description,
        title: soundData.title,
        metadata: soundData.metadata,
        user: userId,
      });

      // Verify save was called
      expect(mockSave).toHaveBeenCalled();

      // Verify findById and populate were called
      expect(Sound.findById).toHaveBeenCalledWith(mockObjectId);
      expect(result).toEqual(mockSoundWithUser);
    });

    it('should throw error when sound creation fails', async () => {
      const userId = mockUserId;
      const soundData: CreateSoundInput = {
        title: 'Test Sound',
        description: 'Test Description',
        metadata: {
          s3Key: 'test-key',
          bucketName: 'test-bucket',
          fileType: 'audio/mp3',
          fileSize: 1000,
        },
      };

      // Mock save to throw an error
      const mockSave = jest
        .fn()
        .mockRejectedValue(new Error('Failed to create sound'));
      (Sound as unknown as jest.Mock).mockImplementation((data) => ({
        ...data,
        _id: mockObjectId,
        save: mockSave,
      }));

      await expect(
        SoundsService.createSound(soundData, userId)
      ).rejects.toThrow('Failed to create sound');
    });
  });

  describe('getSoundByUser', () => {
    it('should return sounds for a user', async () => {
      const userId = mockUserId;
      const mockSounds = [
        {
          _id: new ObjectId(),
          title: 'Sound 1',
          description: 'Description 1',
          metadata: {
            s3Key: 'key1',
            bucketName: 'bucket1',
            fileType: 'audio/mp3',
            fileSize: 1000,
          },
          user: userId,
        },
        {
          _id: new ObjectId(),
          title: 'Sound 2',
          description: 'Description 2',
          metadata: {
            s3Key: 'key2',
            bucketName: 'bucket2',
            fileType: 'audio/mp3',
            fileSize: 2000,
          },
          user: userId,
        },
      ];

      (Sound.find as jest.Mock).mockResolvedValue(mockSounds);

      const result = await SoundsService.getSoundByUser(userId);

      expect(Sound.find).toHaveBeenCalledWith({ user: userId });
      expect(result).toEqual(mockSounds);
    });
  });

  describe('getManySounds', () => {
    it('should return all sounds', async () => {
      const mockSounds = [
        {
          _id: new ObjectId(),
          title: 'Sound 1',
          description: 'Description 1',
          metadata: {
            s3Key: 'key1',
            bucketName: 'bucket1',
            fileType: 'audio/mp3',
            fileSize: 1000,
          },
          user: mockUserId,
        },
      ];

      (Sound.find as jest.Mock).mockReturnThis();
      (Sound.populate as jest.Mock).mockResolvedValue(mockSounds);

      const result = await SoundsService.getManySounds();

      expect(Sound.find).toHaveBeenCalled();
      expect(Sound.populate).toHaveBeenCalledWith(
        'user',
        '-_id username email'
      );
      expect(result).toEqual(mockSounds);
    });
  });

  describe('deleteSound', () => {
    it('should delete a sound', async () => {
      const soundId = '123';
      const mockSound = {
        _id: soundId,
        title: 'Test Sound',
        description: 'Test Description',
        metadata: {
          s3Key: 'test-key',
          bucketName: 'test-bucket',
          fileType: 'audio/mp3',
          fileSize: 1000,
        },
        user: mockUserId,
      };

      (Sound.findById as jest.Mock).mockResolvedValue(mockSound);
      (Sound.findByIdAndDelete as jest.Mock).mockResolvedValue(mockSound);

      await SoundsService.deleteSound(soundId);

      expect(Sound.findById).toHaveBeenCalledWith(soundId);
      expect(Sound.findByIdAndDelete).toHaveBeenCalledWith(soundId);
      expect(s3Service.deleteObject).toHaveBeenCalledWith(
        mockSound.metadata.s3Key
      );
    });

    it('should throw error when sound not found', async () => {
      const soundId = '123';
      (Sound.findById as jest.Mock).mockResolvedValue(null);

      await expect(SoundsService.deleteSound(soundId)).rejects.toThrow(
        'Sound not found'
      );
    });
  });
});
