import { Test, TestingModule } from '@nestjs/testing';
import { UsersInfrastructureService } from './users.infrastructure.service';

describe('Users.InfrastructureService', () => {
  let service: UsersInfrastructureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersInfrastructureService],
    }).compile();

    service = module.get<UsersInfrastructureService>(UsersInfrastructureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
