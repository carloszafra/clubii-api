import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

//third party modules 
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PublicationsModule } from './publications/publications.module';
import { FollowsModule } from './follows/follows.module';
import { FriendshipModule } from './friendship/friendship.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost/clubii-api'),
    UsersModule,
    AuthModule,
    PublicationsModule,
    FollowsModule,
    FriendshipModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
