import { Schema } from 'mongoose';

export const groupSchema = new Schema({
    creator: { ref: 'User', type: Schema.Types.ObjectId },
    name: {type: String, required: true},
    description: { type: String, required: true, default: 'new awesome group!'},
    coverUrl: { type: String, default: null},
    avatarUrl: { type: String, default: null},
    timestamp: { type: Date, default: Date.now }
})