import { Document } from 'mongoose';

export interface groupReqI extends Document {
    emmiter: string;
    receiver: string;
    group: string;
    accepted: boolean;
    timestamp: Date
}