import { Document } from 'mongoose';

export interface groupI extends Document {
    creator: string;
    name: string;
    description: string;
    coverUrl: string;
    avatarUrl: string;
    timestamp: Date
}