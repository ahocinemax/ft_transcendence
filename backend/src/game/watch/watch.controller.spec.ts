import { Test, TestingModule } from '@nestjs/testing';
import { WatchController } from './watch.controller';

describe('WatchController', () => {
  let controller: WatchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WatchController],
    }).compile();

    controller = module.get<WatchController>(WatchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
