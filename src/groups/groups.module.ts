import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { GroupsController } from './groups/groups.controller';
import { GroupsService } from './groups/groups.service';
import { MongooseModule } from '@nestjs/mongoose';
import { groupSchema } from './group.schema/group.schema';
import { UserSchema } from 'src/users/users.schema/user.schema';
import { GroupRequestsModule } from '../group-requests/group-requests.module';

@Module({
  imports: [
    AuthModule,
    GroupRequestsModule,
    MongooseModule.forFeature([
      { name: 'Group', schema: groupSchema},
      { name: 'User', schema: UserSchema }
    ])
  ],
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [GroupsService]
})
export class GroupsModule {}
