import { Test, TestingModule } from '@nestjs/testing';
import { UsersApplicationService } from './users.application.service';

describe('Users.ApplicationService', () => {
  let service: UsersApplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersApplicationService],
    }).compile();

    service = module.get<UsersApplicationService>(UsersApplicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
