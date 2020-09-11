import { Schema } from 'mongoose';

export const followSchema = new Schema({
    follower: { ref: 'User', type: Schema.Types.ObjectId },
    followed: { ref: 'User', type: Schema.Types.ObjectId },
    timestamp: { type: Date, default: Date.now }
})