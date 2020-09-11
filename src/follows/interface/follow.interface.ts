import { Document } from 'mongoose';

export interface followI extends Document {
   follower: string;
   followed: string;
   timestamp: Date
}