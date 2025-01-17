import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getUserById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUserById', () => {
    it('should return a user when called with a valid ID', async () => {
      const userId = '123';
      const mockUser = { id: userId, name: 'John Doe' };

      jest.spyOn(service, 'getUserById').mockResolvedValue(mockUser);

      const result = await controller.getUserById(userId);

      expect(result).toEqual(mockUser);
      expect(service.getUserById).toHaveBeenCalledWith(userId);
    });

    it('should handle errors when the user is not found', async () => {
      const userId = 'invalid-id';
      jest
        .spyOn(service, 'getUserById')
        .mockRejectedValue(new Error('User not found'));

      await expect(controller.getUserById(userId)).rejects.toThrow(
        'User not found',
      );
      expect(service.getUserById).toHaveBeenCalledWith(userId);
    });
  });
});
