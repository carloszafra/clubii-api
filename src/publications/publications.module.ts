import { Module } from '@nestjs/common';
import { PublicationsController } from './publications/publications.controller';
import { PublicationsService } from './publications/publications.service';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';

import { publicationSchema } from './schemas/publication.schema';
import { UserSchema } from 'src/users/users.schema/user.schema';

@Module({
  imports: [
      AuthModule,
      UsersModule,
      MongooseModule.forFeature([
        { name: 'Publication', schema: publicationSchema },
        { name: 'User', schema: UserSchema }
      ])
    ],  
  controllers: [PublicationsController],
  providers: [ PublicationsService]
})
export class PublicationsModule {}
