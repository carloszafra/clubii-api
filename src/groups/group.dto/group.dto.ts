import { IsMongoId } from 'class-validator';

export class groupDto {
    @IsMongoId()
    creator: string;
    name: string;
    description: string;
    coverUrl: string;
    avatarUrl: string;
    timestamp: Date
}