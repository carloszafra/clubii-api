import { Document } from 'mongoose';

export interface friendshipI extends Document {
    emmiter: string;
    receiver: string;
    accepted: boolean;
    timestamp: Date
}