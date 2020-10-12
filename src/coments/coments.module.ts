import { Module } from '@nestjs/common';
import { ComentsController } from './coments/coments.controller';
import { ComentsService } from './coments/coments.service';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { comentSchema } from './schema/coment.schema';
import { UserSchema } from 'src/users/users.schema/user.schema';

@Module({
  imports: [ 
    AuthModule,
    MongooseModule.forFeature([
      {name: 'Coment', schema: comentSchema },
      {name: 'User', schema: UserSchema }
    ])
  ],
  controllers: [ComentsController],
  providers: [ComentsService]
})
export class ComentsModule {}
