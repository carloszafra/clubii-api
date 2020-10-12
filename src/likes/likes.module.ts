import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UserSchema } from 'src/users/users.schema/user.schema';
import { LikesController } from './likes/likes.controller';
import { LikesService } from './likes/likes.service';
import { likeSchema } from './schema/likes.schema'; 

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {name: 'Like', schema: likeSchema },
      {name: 'User', schema: UserSchema}
    ])
  ],
  controllers: [LikesController],
  providers: [LikesService]
})
export class LikesModule {}
