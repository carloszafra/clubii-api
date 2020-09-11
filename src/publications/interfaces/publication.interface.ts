import { Document } from 'mongoose';

export interface publicationI extends Document {
    creator: string;
    content: string;
    fileUrl: string;
    timestamp: Date
}