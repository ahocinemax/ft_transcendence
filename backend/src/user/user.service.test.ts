import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'prisma/prisma.service';
import { GameService } from 'src/game/game.service';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        PrismaService,
        GameService,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await prismaService.user.deleteMany({});
  });

  describe('getLeaderBoard', () => {
    it('should return an array of users sorted by rank', async () => {
      // Create some test users
      const user1 = await prismaService.user.create({
        data: {
          name: 'user1',
          rank: 1,
          winRate: 0.5,
          gamesPlayed: 10,
          gamesWon: 5,
          gamesLost: 5,
        },
      });
      const user2 = await prismaService.user.create({
        data: {
          name: 'user2',
          rank: 2,
          winRate: 0.6,
          gamesPlayed: 10,
          gamesWon: 6,
          gamesLost: 4,
        },
      });
      const user3 = await prismaService.user.create({
        data: {
          name: 'user3',
          rank: 3,
          winRate: 0.7,
          gamesPlayed: 10,
          gamesWon: 7,
          gamesLost: 3,
        },
      });

      // Call the function being tested
      const result = await service.getLeaderBoard();

      // Check that the result is an array of users sorted by rank
      expect(result).toEqual([
        {
          id: user1.id,
          name: user1.name,
          rank: user1.rank,
          winRate: user1.winRate,
          gamesPlayed: user1.gamesPlayed,
          gamesWon: user1.gamesWon,
          gamesLost: user1.gamesLost,
        },
        {
          id: user2.id,
          name: user2.name,
          rank: user2.rank,
          winRate: user2.winRate,
          gamesPlayed: user2.gamesPlayed,
          gamesWon: user2.gamesWon,
          gamesLost: user2.gamesLost,
        },
        {
          id: user3.id,
          name: user3.name,
          rank: user3.rank,
          winRate: user3.winRate,
          gamesPlayed: user3.gamesPlayed,
          gamesWon: user3.gamesWon,
          gamesLost: user3.gamesLost,
        },
      ]);
    });

    it('should not return users with zero games played', async () => {
      // Create a test user with zero games played
      await prismaService.user.create({
        data: {
          name: 'user1',
          rank: 1,
          winRate: 0.5,
          gamesPlayed: 0,
          gamesWon: 0,
          gamesLost: 0,
        },
      });

      // Call the function being tested
      const result = await service.getLeaderBoard();

      // Check that the result does not include the user with zero games played
      expect(result).toEqual([]);
    });
  });
});