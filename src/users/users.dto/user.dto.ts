import { IsEmail, IsNotEmpty } from 'class-validator';

export class userDto {
    @IsNotEmpty() name: string;
    description: string;
    @IsNotEmpty() username: string;
    @IsEmail() email: string;
    birthday: string; 
    country: string;
    twitter: string;
    instagram: string;
    avatarUrl: string;
    coverUrl: string;
    @IsNotEmpty() password: string;
    timestamp: Date;
}