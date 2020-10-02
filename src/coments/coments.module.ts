import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from 'src/auth/auth.service';
import { publicationSchema } from 'src/publications/schemas/publication.schema';
import { UserSchema } from 'src/users/users.schema/user.schema';
import { ComentsController } from './coments/coments.controller';
import { ComentsService } from './coments/coments.service';
import { comentSchema } from './schema/coment.schema';

@Module({
  imports: [
    AuthService,
    MongooseModule.forFeature([
      { name: 'Coment', schema: comentSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Publication', schema: publicationSchema }
    ])
  ],
  controllers: [ComentsController],
  providers: [ComentsService]
})
export class ComentsModule {}
