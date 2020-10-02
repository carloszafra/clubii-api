import { Test, TestingModule } from '@nestjs/testing';
import { GroupRequestsController } from './group-requests.controller';

describe('GroupRequestsController', () => {
  let controller: GroupRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupRequestsController],
    }).compile();

    controller = module.get<GroupRequestsController>(GroupRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
