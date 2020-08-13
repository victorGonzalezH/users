import { Module, Logger } from '@nestjs/common';
import { UsersApplicationService } from './users.application.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, GenericUserSchema } from 'usr/users.infrastructure/users/user.schema';
import { UserRepositoryService } from 'usr/users.infrastructure/users/user-repository.service';
import { UsersInfrastructureModule } from 'usr/users.infrastructure';
import { UsersDomainModule } from 'usr/users.domain';
import { SystemSchema } from 'usr/users.infrastructure/systems/system.schema';
import { AppConfigService } from './configuration/appConfig.service';
import { ConfigService } from '@nestjs/config';
import { MessageSchema } from 'utils/dist/persistence/mongodb/schemas/message.schema';
import { MessagesSchema } from 'utils/dist/persistence/mongodb/schemas/messages.schema';
import { MessagesRepositoryService } from 'utils';

@Module({
  providers: [UsersApplicationService, UserRepositoryService, Logger, AppConfigService, ConfigService, MessagesRepositoryService],
  exports: [UsersApplicationService],
  imports: [UsersInfrastructureModule, UsersDomainModule,
     MongooseModule.forFeature([{ name: 'User', schema: UserSchema }, {name: 'System', schema: SystemSchema },
     { name: 'Message', schema: MessageSchema },
     { name: 'Messages', schema: MessagesSchema }]) ],
})
export class UsersApplicationModule {}
