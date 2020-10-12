import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

//third party modules 
import { MongooseModule } from '@nestjs/mongoose';

// APP MODULES
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PublicationsModule } from './publications/publications.module';
import { FollowsModule } from './follows/follows.module';
import { FriendshipModule } from './friendship/friendship.module';
import { AlbumsModule } from './albums/albums.module';
import { GroupRequestsModule } from './group-requests/group-requests.module';
import { GroupsModule } from './groups/groups.module';
import { LikesModule} from './likes/likes.module';
import { ComentsModule } from './coments/coments.module';





@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}${process.env.MONGO_URL}`),
    UsersModule,          
    AuthModule,
    PublicationsModule,
    FollowsModule,
    FriendshipModule,
    AlbumsModule,
    GroupRequestsModule,
    GroupsModule,
    LikesModule,
    ComentsModule,
   
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
