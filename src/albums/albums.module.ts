import { Module } from '@nestjs/common';
import { AlbumsController } from './albums/albums.controller';
import { AlbumsService } from './albums/albums.service';

@Module({
  controllers: [AlbumsController],
  providers: [AlbumsService]
})
export class AlbumsModule {}
