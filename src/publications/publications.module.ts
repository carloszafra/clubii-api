import { Module } from '@nestjs/common';
import { PublicationsController } from './publications/publications.controller';
import { PublicationsService } from './publications/publications.service';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowsModule } from '../follows/follows.module';
import { FriendshipModule } from '../friendship/friendship.module';

import { publicationSchema } from './schemas/publication.schema';
import { UserSchema } from 'src/users/users.schema/user.schema';
import { followSchema } from '../follows/schema/follow.schema';
import { friendshipSchema } from '../friendship/friendship.schema/friendship.schema';

@Module({
  imports: [
      AuthModule,
      UsersModule,
      FollowsModule,
      FriendshipModule,
      MongooseModule.forFeature([
        { name: 'Publication', schema: publicationSchema },
        { name: 'User', schema: UserSchema },
        { name: 'Follow', schema: followSchema },
        { name: 'Friendship', schema: friendshipSchema }
      ])
    ],  
  controllers: [PublicationsController],
  providers: [ PublicationsService]
})
export class PublicationsModule {}
