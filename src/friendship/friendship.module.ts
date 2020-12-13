import { Module } from '@nestjs/common';
import { FriendshipController } from './friendship/friendship.controller';
import { FriendshipService } from './friendship/friendship.service';
import { friendshipSchema } from './friendship.schema/friendship.schema';

import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/users/users.schema/user.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: 'Friendship', schema: friendshipSchema },
      { name: 'User', schema: UserSchema }
    ])
  ],
  controllers: [FriendshipController],
  providers: [FriendshipService],
  exports: [FriendshipService]
})
export class FriendshipModule {}
