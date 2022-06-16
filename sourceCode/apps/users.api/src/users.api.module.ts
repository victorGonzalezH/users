import { Module, Logger } from '@nestjs/common';
import { UsersController } from './users.controller';
import { AppConfigService } from 'usa/users.application/configuration/appConfig.service';
import { ConfigService, ConfigModule } from '@nestjs/config';
import configuration from 'usa/users.application/configuration/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseConfigService } from 'usa/users.application/configuration/databaseConfig.service';
import { UsersApplicationService, UsersApplicationModule } from 'usa/users.application';
import { UsersInfrastructureModule, UserSchema, GenericUserSchema } from 'usr/users.infrastructure';
import { UsersDomainModule } from 'usr/users.domain';
import { UserRepositoryService } from 'usr/users.infrastructure/users/user-repository.service';
import { SystemSchema } from 'usr/users.infrastructure/systems/system.schema';
import { MessagesRepositoryService, MessagesSchema, MessageSchema } from 'utils';
import { UserSystemSchema } from 'usr/users.infrastructure/users/user-system.schema';

@Module({
  imports: [ConfigModule.forRoot({ load: [configuration] }), MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useClass: DatabaseConfigService,
    inject: [ConfigService],
  }), UsersApplicationModule, UsersInfrastructureModule, UsersDomainModule,
  MongooseModule.forFeature([
    { name: 'User', schema: UserSchema },
    { name: 'UserSystem', schema: UserSystemSchema },
    { name: 'System', schema: SystemSchema },
    { name: 'Messages', schema: MessagesSchema },
    { name: 'Message', schema: MessageSchema }])],
  controllers: [UsersController],
  providers: [AppConfigService, ConfigService, UsersApplicationService, UserRepositoryService, Logger, MessagesRepositoryService],
})
export class UsersApiModule {}
