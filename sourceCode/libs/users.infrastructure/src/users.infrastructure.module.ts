import { Module } from '@nestjs/common';
import { UsersInfrastructureService } from './users.infrastructure.service';

@Module({
  providers: [UsersInfrastructureService],
  exports: [UsersInfrastructureService],
})
export class UsersInfrastructureModule {}
