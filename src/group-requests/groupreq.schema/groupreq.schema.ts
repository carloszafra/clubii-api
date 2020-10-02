import { Schema } from 'mongoose';

export const groupReqSchema = new Schema({
    emmiter: { ref: 'User', type: Schema.Types.ObjectId },
    receiver: { ref: 'User', type: Schema.Types.ObjectId },
    group: { ref: 'Group', type: Schema.Types.ObjectId },
    accepted: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
})