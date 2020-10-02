import { Document } from 'mongoose';

export interface comentI extends Document{
    user: string
    publication: string;
    content: string;
    timestamp: Date
}