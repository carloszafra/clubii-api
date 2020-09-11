import { Schema } from 'mongoose';

export const friendshipSchema = new Schema({
    emmiter: { ref: 'User', type: Schema.Types.ObjectId, required: true },
    receiver: { ref: 'User', type: Schema.Types.ObjectId, required: true },
    accepted: { type: Boolean, required: true, default: false },
    timestamp: { type: Date, default: Date.now }
})