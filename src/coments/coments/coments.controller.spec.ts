import { Test, TestingModule } from '@nestjs/testing';
import { ComentsController } from './coments.controller';

describe('ComentsController', () => {
  let controller: ComentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComentsController],
    }).compile();

    controller = module.get<ComentsController>(ComentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
