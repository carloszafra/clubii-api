import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserService } from './services/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './users.schema/user.schema';
import { AuthModule } from '../auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    forwardRef( () => AuthModule),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema }
    ]),
    MulterModule.register(),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [ UserService ]
})
export class UsersModule {}
