import { Test, TestingModule } from '@nestjs/testing';
import { ComentsService } from './coments.service';

describe('ComentsService', () => {
  let service: ComentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComentsService],
    }).compile();

    service = module.get<ComentsService>(ComentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
