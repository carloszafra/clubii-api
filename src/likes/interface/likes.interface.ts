import { Document } from 'mongoose';

export interface likeI extends Document {
    publication: string;
    user: string;
    timestamp: Date
}