import { Module } from '@nestjs/common';
import { GroupRequestsController } from './group-requests/group-requests.controller';
import { GroupRequestsService } from './group-requests/group-requests.service';
import { MongooseModule } from '@nestjs/mongoose';
import { groupReqSchema } from './groupreq.schema/groupreq.schema';
import { UserSchema } from 'src/users/users.schema/user.schema';
import { groupSchema } from 'src/groups/group.schema/group.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'GroupReq', schema: groupReqSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Group', schema: groupSchema }
    ])
  ],
  controllers: [GroupRequestsController],
  providers: [GroupRequestsService],
  exports: [ GroupRequestsService ]
})
export class GroupRequestsModule {}
