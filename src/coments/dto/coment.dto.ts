import { IsNotEmpty } from 'class-validator';

export class comentDto {
    user: string
    publication: string;
    @IsNotEmpty() content: string;
    timestamp: Date
}