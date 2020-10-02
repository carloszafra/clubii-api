import { IsMongoId } from 'class-validator';

export class likesDto {
   @IsMongoId() user: string;
}