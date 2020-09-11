import { Module } from '@nestjs/common';
import { FollowsController } from './follows/follows.controller';
import { FollowsService } from './follows/follows.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { followSchema } from './schema/follow.schema';
import { UserSchema } from 'src/users/users.schema/user.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: 'Follow', schema: followSchema },
      { name: 'User', schema: UserSchema }
    ])
  ],
  controllers: [FollowsController],
  providers: [FollowsService]
})
export class FollowsModule {}
