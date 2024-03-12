import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteEpisodeController } from './favorite-episode.controller';

describe('FavoriteEpisodeController', () => {
  let controller: FavoriteEpisodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoriteEpisodeController],
    }).compile();

    controller = module.get<FavoriteEpisodeController>(FavoriteEpisodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
