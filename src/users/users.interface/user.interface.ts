import { Document } from 'mongoose';

export interface userI extends Document {
    name: string;
    description: string;
    username: string;
    email: string;
    birthday: string;
    country: string;
    twitter: string;
    instagram: string;
    avatarUrl: string;
    coverUrl: string;
    password: string;
    timestamp: Date;
    hashPassword(password: string): Promise<string>;
    comparePasswords(password: string): Promise<boolean>
}